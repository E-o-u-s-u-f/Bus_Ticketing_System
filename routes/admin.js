const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');

router.post("/login", async (req, res) => {
    try {
        const { email, PassKey } = req.body;

        if (!email || !PassKey) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input("email", sql.VarChar, email)
            .query("SELECT * FROM admin WHERE email = @email");

        if (result.recordset.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Admin not found"
            });
        }

        const adminUser = result.recordset[0];

        if (adminUser.PassKey !== PassKey) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                adminid: adminUser.adminid,
                fullname: adminUser.fullname,
                email: adminUser.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error, try again",
            error: error.message
        });
    }
});

router.post("/register", async (req, res) => {
    try {
        const { fullname, email, PassKey } = req.body;

        if (!fullname || !email || !PassKey) {
            return res.status(400).json({
                success: false,
                message: "All fields (fullname, email, PassKey) are required"
            });
        }

        const pool = await poolPromise;

        // check duplicate email
        const check = await pool.request()
            .input("email", sql.VarChar, email)
            .query("SELECT * FROM admin WHERE email = @email");

        if (check.recordset.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }
        
        const result = await pool.request()
            .input("fullname", sql.VarChar, fullname)
            .input("email", sql.VarChar, email)
            .input("PassKey", sql.VarChar, PassKey)
            .query("INSERT INTO admin (fullname, email, PassKey) OUTPUT INSERTED.adminid VALUES (@fullname, @email, @PassKey)");

        const newAdmin = result.recordset[0];

        res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            user: { 
                adminid: newAdmin.adminid,
                fullname, 
                email 
            }
        });

    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({
            success: false,
            message: "Server error, try again",
            error: error.message
        });
    }
});

router.post("/routes", async (req, res) => {
    try {
        const { fromlocation, tolocation } = req.body;

        if (!fromlocation || !tolocation) {
            return res.status(400).json({ success: false, message: "From and To locations are required" });
        }

        const pool = await poolPromise;

        // Duplicate check
        const exists = await pool.request()
            .input("fromlocation", sql.VarChar, fromlocation)
            .input("tolocation", sql.VarChar, tolocation)
            .query("SELECT 1 FROM routes WHERE fromlocation = @fromlocation AND tolocation = @tolocation");

        if (exists.recordset.length > 0) {
            return res.status(409).json({ success: false, message: "Route already exists" });
        }

        const result = await pool.request()
            .input("fromlocation", sql.VarChar, fromlocation)
            .input("tolocation", sql.VarChar, tolocation)
            .query("INSERT INTO routes (fromlocation, tolocation) OUTPUT INSERTED.rid VALUES (@fromlocation, @tolocation)");

        res.status(201).json({ success: true, message: "Route created successfully", route: result.recordset[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

router.post("/bus", async (req, res) => {
    try {
        const { busnumber, bustype, company, status } = req.body;

        if (!busnumber || !bustype || !company || !status) {
            return res.status(400).json({ success: false, message: "Required fields are missing" });
        }

        const pool = await poolPromise;

        // Duplicate check
        const exists = await pool.request()
            .input("busnumber", sql.VarChar, busnumber)
            .query("SELECT 1 FROM bus WHERE busnumber = @busnumber");

        if (exists.recordset.length > 0) {
            return res.status(409).json({ success: false, message: "Bus with this number already exists" });
        }

        const result = await pool.request()
            .input("busnumber", sql.VarChar, busnumber)
            .input("bustype", sql.VarChar, bustype)
            .input("company", sql.VarChar, company)
            .input("status", sql.VarChar, status)
            .query("INSERT INTO bus (busnumber, bustype, company, status) OUTPUT INSERTED.busid VALUES (@busnumber, @bustype, @company, @status)");

        res.status(201).json({ success: true, message: "Bus created successfully", bus: result.recordset[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

router.post("/schedule", async (req, res) => {
    try {
        const { dtime, routesid, busid, fare } = req.body;

        if (!dtime || !routesid || !busid || !fare) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const pool = await poolPromise;

        // ✅ Validate route exists
        const routeCheck = await pool.request()
            .input("routesid", sql.Int, routesid)
            .query("SELECT 1 FROM routes WHERE rid = @routesid");

        if (routeCheck.recordset.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid route ID" });
        }

        // ✅ Validate bus exists
        const busCheck = await pool.request()
            .input("busid", sql.Int, busid)
            .query("SELECT 1 FROM bus WHERE busid = @busid");

        if (busCheck.recordset.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid bus ID" });
        }

        // ✅ Prevent duplicate schedules (same bus, same time)
        const exists = await pool.request()
            .input("busid", sql.Int, busid)
            .input("dtime", sql.DateTime, dtime)
            .query("SELECT 1 FROM schedules WHERE busid = @busid AND dtime = @dtime");

        if (exists.recordset.length > 0) {
            return res.status(409).json({ success: false, message: "Schedule already exists for this bus at this time" });
        }

        // ✅ Insert new schedule
        const result = await pool.request()
            .input("dtime", sql.DateTime, dtime)
            .input("routesid", sql.Int, routesid)
            .input("busid", sql.Int, busid)
            .input("fare", sql.Decimal(10, 2), fare)
            .query("INSERT INTO schedules (dtime, routesid, busid, fare) OUTPUT INSERTED.scheid VALUES (@dtime, @routesid, @busid, @fare)");

        res.status(201).json({ success: true, message: "Schedule created successfully", schedule: result.recordset[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});


router.post("/generate-tickets", async (req, res) => {
    try {
        const { scheid, seatCount } = req.body;

        const pool = await poolPromise;

        const schedule = await pool.request()
            .input("scheid", sql.Int, scheid)
            .query("SELECT fare FROM schedules WHERE scheid = @scheid");

        if (schedule.recordset.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid schedule ID" });
        }

        const fare = schedule.recordset[0].fare;

        for (let i = 1; i <= seatCount; i++) {
            await pool.request()
                .input("scheid", sql.Int, scheid)
                .input("seatnum", sql.VarChar, "A" + i)
                .input("fare", sql.Decimal(10,2), fare)
                .query(`
                    INSERT INTO tickets (userid, scheid, seatnum, btime, tamount, is_sold)
                    VALUES (NULL, @scheid, @seatnum, GETDATE(), @fare, 0)
                `);
        }

        res.status(201).json({ success: true, message: "Tickets generated successfully" });

    } catch (error) {
        console.error("Ticket generation error:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

router.get("/routes", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM routes");

        res.status(200).json({ success: true, data: result.recordset });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

router.get("/bus", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM bus");

        res.status(200).json({ success: true, data: result.recordset });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

router.get("/schedule", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM schedules");

        res.status(200).json({ success: true, data: result.recordset });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

router.put("/routes/:rid", async (req, res) => {
    try {
        const { rid } = req.params;
        const { fromlocation, tolocation } = req.body;

        if (!fromlocation && !tolocation) {
            return res.status(400).json({ success: false, message: "At least one field (fromlocation or tolocation) is required" });
        }

        const pool = await poolPromise;
        let updateQuery = "UPDATE routes SET ";
        const updates = [];

        if (fromlocation) updates.push("fromlocation = @fromlocation");
        if (tolocation) updates.push("tolocation = @tolocation");

        updateQuery += updates.join(", ") + " WHERE rid = @rid";

        const result = await pool.request()
            .input("rid", sql.Int, rid)
            .input("fromlocation", sql.VarChar, fromlocation || null)
            .input("tolocation", sql.VarChar, tolocation || null)
            .query(updateQuery);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ success: false, message: "Route not found or no changes made" });
        }

        res.status(200).json({ success: true, message: "Route updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

router.put("/bus/:busid", async (req, res) => {
    try {
        const { busid } = req.params;
        const { busnumber, bustype, company, status } = req.body;

        if (!busnumber || !bustype || !status) {
            return res.status(400).json({ success: false, message: "busnumber, bustype, and status are required" });
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input("busid", sql.Int, busid)
            .input("busnumber", sql.VarChar, busnumber)
            .input("bustype", sql.VarChar, bustype)
            .input("company", sql.VarChar, company || null)
            .input("status", sql.VarChar, status)
            .query("UPDATE bus SET busnumber=@busnumber, bustype=@bustype, company=@company, status=@status WHERE busid=@busid");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ success: false, message: "Bus not found" });
        }

        res.status(200).json({ success: true, message: "Bus updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

router.put("/schedule/:scheid", async (req, res) => {
    try {
        const { scheid } = req.params;
        const { dtime, routesid, busid, fare } = req.body;

        if (!dtime || !routesid || !busid || !fare) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input("scheid", sql.Int, scheid)
            .input("dtime", sql.DateTime, dtime)
            .input("routesid", sql.Int, routesid)
            .input("busid", sql.Int, busid)
            .input("fare", sql.Decimal(10,2), fare)
            .query("UPDATE schedules SET dtime=@dtime, routesid=@routesid, busid=@busid, fare=@fare WHERE scheid=@scheid");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ success: false, message: "Schedule not found" });
        }

        res.status(200).json({ success: true, message: "Schedule updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

router.delete("/routes/:rid", async (req, res) => {
    try {
        const { rid } = req.params;
        const pool = await poolPromise;

        // Step 1: Delete payments related to tickets of schedules on this route
        await pool.request()
            .input("rid", sql.Int, rid)
            .query(`
                DELETE FROM payment
                WHERE ticketid IN (
                    SELECT t.ticket_id
                    FROM tickets t
                    JOIN schedules s ON t.scheid = s.scheid
                    WHERE s.routesid = @rid
                )
            `);

        // Step 2: Delete tickets of schedules on this route
        await pool.request()
            .input("rid", sql.Int, rid)
            .query(`
                DELETE FROM tickets
                WHERE scheid IN (
                    SELECT scheid FROM schedules WHERE routesid = @rid
                )
            `);

        // Step 3: Delete schedules on this route
        await pool.request()
            .input("rid", sql.Int, rid)
            .query("DELETE FROM schedules WHERE routesid = @rid");

        // Step 4: Delete the route
        const result = await pool.request()
            .input("rid", sql.Int, rid)
            .query("DELETE FROM routes WHERE rid = @rid");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ success: false, message: "Route not found" });
        }

        res.status(200).json({ success: true, message: "Route deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

router.delete("/bus/:busid", async (req, res) => {
    try {
        const { busid } = req.params;
        const pool = await poolPromise;

        // Step 1: Delete payments linked to tickets of this bus
        await pool.request()
            .input("busid", sql.Int, busid)
            .query(`
                DELETE FROM payment
                WHERE ticketid IN (
                    SELECT t.ticket_id
                    FROM tickets t
                    JOIN schedules s ON t.scheid = s.scheid
                    WHERE s.busid = @busid
                )
            `);

        // Step 2: Delete tickets linked to schedules of this bus
        await pool.request()
            .input("busid", sql.Int, busid)
            .query(`
                DELETE FROM tickets
                WHERE scheid IN (
                    SELECT scheid FROM schedules WHERE busid = @busid
                )
            `);

        // Step 3: Delete schedules linked to this bus
        await pool.request()
            .input("busid", sql.Int, busid)
            .query("DELETE FROM schedules WHERE busid = @busid");

        // Step 4: Unassign drivers assigned to this bus
        await pool.request()
            .input("busid", sql.Int, busid)
            .query("UPDATE driver SET assignedbusid = NULL WHERE assignedbusid = @busid");

        // Step 5: Delete the bus
        const result = await pool.request()
            .input("busid", sql.Int, busid)
            .query("DELETE FROM bus WHERE busid = @busid");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ success: false, message: "Bus not found" });
        }

        res.status(200).json({ success: true, message: "Bus deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

router.delete("/schedule/:scheid", async (req, res) => {
    try {
        const { scheid } = req.params;
        const pool = await poolPromise;

        // Step 1: Delete payments related to tickets of this schedule
        await pool.request()
            .input("scheid", sql.Int, scheid)
            .query(`
                DELETE FROM payment 
                WHERE ticketid IN (
                    SELECT ticket_id FROM tickets WHERE scheid = @scheid
                )
            `);

        // Step 2: Delete tickets related to this schedule
        await pool.request()
            .input("scheid", sql.Int, scheid)
            .query("DELETE FROM tickets WHERE scheid = @scheid");

        // Step 3: Delete the schedule
        const result = await pool.request()
            .input("scheid", sql.Int, scheid)
            .query("DELETE FROM schedules WHERE scheid = @scheid");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ success: false, message: "Schedule not found" });
        }

        res.status(200).json({ success: true, message: "Schedule deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

router.get("/schedule/search", async (req, res) => {
  try {
    const { fromlocation, tolocation, date, page = 1, pageSize = 50 } = req.query;

    const pageNum = Math.max(parseInt(page, 10), 1);
    const size = Math.min(Math.max(parseInt(pageSize, 10), 1), 200);
    const offset = (pageNum - 1) * size;

    const pool = await poolPromise;

    // Base query with joins
    let query = `
      SELECT
        s.scheid, s.dtime, s.routesid, s.busid, s.fare,
        r.fromlocation, r.tolocation,
        b.busnumber, b.bustype, b.company, b.status,
        d.fullname AS drivername, d.licensenum
      FROM schedules s
      JOIN routes r ON s.routesid = r.rid
      JOIN bus b ON s.busid = b.busid
      LEFT JOIN driver d ON b.busid = d.assignedbusid
      WHERE 1=1
    `;

    const request = pool.request();

    // Apply filters
    if (fromlocation) {
      query += " AND r.fromlocation = @fromlocation";
      request.input("fromlocation", sql.VarChar, fromlocation);
    }

    if (tolocation) {
      query += " AND r.tolocation = @tolocation";
      request.input("tolocation", sql.VarChar, tolocation);
    }

    if (date) {
      query += " AND CAST(s.dtime AS DATE) = @date";
      request.input("date", sql.Date, date);
    }

    // Count total
    const countResult = await request.query(`SELECT COUNT(*) AS total FROM (${query}) AS sub`);
    const total = countResult.recordset[0]?.total || 0;

    // Fetch paginated data
    query += ` ORDER BY s.dtime ASC OFFSET ${offset} ROWS FETCH NEXT ${size} ROWS ONLY`;
    const result = await request.query(query);

    return res.status(200).json({
      success: true,
      page: pageNum,
      pageSize: size,
      total,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Schedule search error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});


module.exports = router;
