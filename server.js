const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sql, poolPromise } = require('./db');
const app = express();
app.use(bodyParser.json());
app.use(cors());

const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const ticketRoutes = require('./routes/ticket');
const scheduleRoutes = require('./routes/schedule');

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/schedules', scheduleRoutes);

const SSLCommerzPayment = require('sslcommerz-lts')
const store_id = process.env.STORE_ID;
const store_passwd =process.env.STORE_PASS;
const is_live = false //true for live, false for sandbox

app.post("/payment", async (req, res) => {
  const { fullName, email, phone, nid, address, ticket_ids } = req.body;

  if (!ticket_ids || ticket_ids.length === 0) {
    return res.status(400).json({ error: "No ticket IDs provided" });
  }

  try {
    const pool = await poolPromise;

    // 1️⃣ Get total amount for selected tickets
    const ticketsResult = await pool.request()
      .query(`SELECT tamount FROM tickets WHERE ticket_id IN (${ticket_ids.map(id => `'${id}'`).join(',')})`);

    if (ticketsResult.recordset.length === 0) {
      return res.status(404).json({ error: "No tickets found" });
    }

    const totalAmount = ticketsResult.recordset.reduce((sum, row) => sum + Number(row.tamount), 0);

    // 2️⃣ Generate transaction id
    const tran_id = `${Date.now()}`;

    // 3️⃣ Save pending payment info
    await pool.request()
      .input('tran_id', tran_id)
      .input('fullName', fullName)
      .input('email', email)
      .input('phone', phone)
      .input('nid', nid)
      .input('address', address)
      .input('ticket_ids', JSON.stringify(ticket_ids))
      .input('totalAmount', totalAmount)
      .query(`
        INSERT INTO payment_pending (tran_id, fullName, email, phone, nid, address, ticket_ids, totalAmount)
        VALUES (@tran_id, @fullName, @email, @phone, @nid, @address, @ticket_ids, @totalAmount)
      `);

    // 4️⃣ Prepare SSLCommerz data
    const data = {
      total_amount: totalAmount,
      currency: 'BDT',
      tran_id: tran_id,
      success_url: `http://localhost:5000/payment/success/${tran_id}`,
      fail_url: 'http://localhost:3030/fail',
      cancel_url: 'http://localhost:3030/cancel',
      ipn_url: 'http://localhost:3030/ipn',
      shipping_method: 'Online',
      product_name: 'Bus Tickets',
      product_category: 'Transport',
      product_profile: 'general',
      cus_name: fullName,
      cus_email: email,
      cus_add1: address,
      cus_nid: nid,
      cus_city: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: phone,
      ship_name: fullName,
      ship_add1: address,
      ship_city: 'Dhaka',
      ship_postcode: 1000,
      ship_country: 'Bangladesh',
    };

    // 5️⃣ Initialize SSLCommerz
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);
    const GatewayPageURL = apiResponse.GatewayPageURL;

    console.log('Redirecting to:', GatewayPageURL);
    res.send({ url: GatewayPageURL });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment initialization failed" });
  }
});

app.post("/payment/success/:tran_id", async (req, res) => {
  const { tran_id } = req.params;

  try {
    const pool = await poolPromise;

    // 1️⃣ Retrieve pending payment
    const pendingResult = await pool.request()
      .input('tran_id', tran_id)
      .query('SELECT * FROM payment_pending WHERE tran_id = @tran_id');

    if (pendingResult.recordset.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const pending = pendingResult.recordset[0];
    const { fullName, email, phone, nid, address, ticket_ids } = pending;
    const ticketsArray = JSON.parse(ticket_ids);

    // 2️⃣ Check if user exists
    let userResult = await pool.request()
      .input('email', email)
      .query('SELECT userid FROM users WHERE email = @email');

    let userid;
    if (userResult.recordset.length === 0) {
      // Insert new user safely using SCOPE_IDENTITY()
      const insertUser = await pool.request()
        .input('fullname', fullName)
        .input('email', email)
        .input('phone', phone)
        .input('nid', nid)
        .input('address', address)
        .input('urole', 'user')
        .query(`
          INSERT INTO users (fullname, email, phone, nid, address, urole)
          VALUES (@fullname, @email, @phone, @nid, @address, @urole);
          SELECT SCOPE_IDENTITY() AS userid;
        `);
      userid = insertUser.recordset[0].userid;
    } else {
      userid = userResult.recordset[0].userid;
    }

    // 3️⃣ Update tickets to assign user and mark as sold
    await pool.request()
      .query(`UPDATE tickets
              SET userid = ${userid}, is_sold = 1
              WHERE ticket_id IN (${ticketsArray.map(id => `'${id}'`).join(',')})`);

    // 4️⃣ Insert payment records
    const ptime = new Date();
    for (let ticket of ticketsArray) {
      const ticketAmountResult = await pool.request()
        .query(`SELECT tamount FROM tickets WHERE ticket_id = ${ticket}`);
      const tamount = ticketAmountResult.recordset[0].tamount;

      await pool.request()
        .input('ticketid', ticket)
        .input('userid', userid)
        .input('ptime', ptime)
        .input('tamount', tamount)
        .input('method', 'Online')
        .input('pstatus', 'paid')
        .input('tran_id', tran_id)
        .query(`
          INSERT INTO payment (ticketid, userid, ptime, tamount, method, pstatus, tran_id)
          VALUES (@ticketid, @userid, @ptime, @tamount, @method, @pstatus, @tran_id)
        `);
    }

    // 5️⃣ Delete pending record
    await pool.request()
      .input('tran_id', tran_id)
      .query('DELETE FROM payment_pending WHERE tran_id = @tran_id');

    res.send(`<h2>Payment successful!</h2><p>Transaction ID: ${tran_id}</p>`);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Post-payment processing failed" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on "${PORT}"`));
