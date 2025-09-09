const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');

router.get("/", async (req, res) => {
    try {
        const { fromlocation, tolocation, date } = req.query;
        const pool = await poolPromise;

        let query = `
            SELECT 
                s.scheid,
                s.dtime,
                r.fromlocation,
                r.tolocation,
                b.busnumber,
                b.bustype,
                d.fullname AS drivername,
                d.licensenum,
                s.fare
            FROM schedules s
            JOIN routes r ON s.routesid = r.rid
            JOIN bus b ON s.busid = b.busid
            LEFT JOIN driver d ON b.busid = d.assignedbusid
            WHERE 1=1
        `;

        const request = pool.request();

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

        const result = await request.query(query);

        res.status(200).json({ success: true, data: result.recordset });
    } catch (error) {
        console.error("Fetch schedules error:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});


module.exports = router;
