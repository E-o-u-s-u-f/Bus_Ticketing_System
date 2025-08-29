const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');

router.post("/login", async (req, res) => {
    try {
        const { adminid, fullname, email, PassKey } = req.body;

        if (!adminid || !fullname || !email || !PassKey) {
            return res.status(400).json({
                success: false,
                message: "adminid, fullname, email and password are required"
            });
        }

        
        const pool = await poolPromise;
        const result = await pool.request()
            .input("adminid", sql.Int, adminid)
            .input("fullname", sql.VarChar, fullname)
            .input("email", sql.VarChar, email)
            .query("SELECT * FROM admin WHERE adminid = @adminid AND fullname = @fullname AND email = @email");

        
        if (result.recordset.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid admin ID, fullname, or email"
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
        const { adminid, fullname, email, PassKey } = req.body;

        if (!adminid || !fullname || !email || !PassKey) {
            return res.status(400).json({
                success: false,
                message: "All fields (adminid, fullname, email, PassKey) are required"
            });
        }
        const pool = await poolPromise;
        const check = await pool.request()
            .input("adminid", sql.Int, adminid)
            .input("email", sql.VarChar, email)
            .query("SELECT * FROM admin WHERE adminid = @adminid OR email = @email");

        if (check.recordset.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Admin ID or Email already exists"
            });
        }

        await pool.request()
            .input("adminid", sql.Int, adminid)
            .input("fullname", sql.VarChar, fullname)
            .input("email", sql.VarChar, email)
            .input("PassKey", sql.VarChar, PassKey)
            .query("INSERT INTO admin (adminid, fullname, email, PassKey) VALUES (@adminid, @fullname, @email, @PassKey)");

        res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            user: { adminid, fullname, email }
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
        const { rid, fromlocation, tolocation } = req.body;

        if (!rid || !fromlocation || !tolocation) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const pool = await poolPromise;
        await pool.request()
            .input("rid", sql.Int, rid)
            .input("fromlocation", sql.VarChar, fromlocation)
            .input("tolocation", sql.VarChar, tolocation)
            .query("INSERT INTO routes (rid, fromlocation, tolocation) VALUES (@rid, @fromlocation, @tolocation)");

        res.status(201).json({ success: true, message: "Route created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

router.post("/bus", async (req, res) => {
    try {
        const { busid, busnumber, bustype, company, status } = req.body;

        if (!busid || !busnumber || !bustype || !status) {
            return res.status(400).json({ success: false, message: "Required fields are missing" });
        }

        const pool = await poolPromise;
        await pool.request()
            .input("busid", sql.Int, busid)
            .input("busnumber", sql.VarChar, busnumber)
            .input("bustype", sql.VarChar, bustype)
            .input("company", sql.VarChar, company)
            .input("status", sql.VarChar, status)
            .query("INSERT INTO bus (busid, busnumber, bustype, company, status) VALUES (@busid, @busnumber, @bustype, @company, @status)");

        res.status(201).json({ success: true, message: "Bus created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

router.post("/schedule", async (req, res) => {
    try {
        const { scheid, dtime, routesid, busid, fare } = req.body;

        if (!scheid || !dtime || !routesid || !busid || !fare) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const pool = await poolPromise;
        await pool.request()
            .input("scheid", sql.Int, scheid)
            .input("dtime", sql.DateTime, dtime)
            .input("routesid", sql.Int, routesid)
            .input("busid", sql.Int, busid)
            .input("fare", sql.Decimal(10, 2), fare)
            .query("INSERT INTO schedules (scheid, dtime, routesid, busid, fare) VALUES (@scheid, @dtime, @routesid, @busid, @fare)");

        res.status(201).json({ success: true, message: "Schedule created successfully" });
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

        if (!fromlocation || !tolocation) {
            return res.status(400).json({ success: false, message: "Both fromlocation and tolocation are required" });
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input("rid", sql.Int, rid)
            .input("fromlocation", sql.VarChar, fromlocation)
            .input("tolocation", sql.VarChar, tolocation)
            .query("UPDATE routes SET fromlocation = @fromlocation, tolocation = @tolocation WHERE rid = @rid");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ success: false, message: "Route not found" });
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

module.exports = router;
