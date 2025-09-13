const express = require('express');
const router = express.Router();
const SSLCommerzPayment = require('sslcommerz-lts');k
const { sql, poolPromise } = require('../db'); // your mssql setup

const store_id = '<your_store_id>';
const store_passwd = '<your_store_password>';
const is_live = false;

// Create ticket and initiate payment
router.post('/init', async (req, res) => {
    try {
        const { userid, scheid, seatnum } = req.body;

        if (!userid || !scheid || !seatnum) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const pool = await poolPromise;

        // 1️⃣ Insert ticket (is_sold = 0)
        const result = await pool.request()
            .input("userid", sql.Int, userid)
            .input("scheid", sql.Int, scheid)
            .input("seatnum", sql.VarChar(10), seatnum)
            .query(`INSERT INTO tickets (userid, scheid, seatnum, btime, tamount, is_sold)
                    OUTPUT INSERTED.ticket_id, INSERTED.tamount
                    VALUES (@userid, @scheid, @seatnum, GETDATE(), 0, 0)`);

        const ticket = result.recordset[0];
        const ticketId = ticket.ticket_id;
        const amount = 500; // or fetch schedule fare from schedules table

        // 2️⃣ Initiate SSLCommerz
        const data = {
            total_amount: amount,
            currency: 'BDT',
            tran_id: 'TICKET' + ticketId, // unique transaction id
            success_url: `http://localhost:3030/success?ticketid=${ticketId}&userid=${userid}`,
            fail_url: 'http://localhost:3030/fail',
            cancel_url: 'http://localhost:3030/cancel',
            ipn_url: 'http://localhost:3030/ipn',
            shipping_method: 'Courier',
            product_name: `Bus Ticket #${ticketId}`,
            cus_name: 'Customer Name',
            cus_email: 'customer@example.com',
            cus_phone: '01711111111',
        };

        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        const apiResponse = await sslcz.init(data);

        res.json({ success: true, gateway_url: apiResponse.GatewayPageURL });
    } catch (err) {
        console.error("Payment init error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
