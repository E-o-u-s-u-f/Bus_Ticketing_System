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
        `;

        // If all filters are provided, add WHERE condition
        if (fromlocation && tolocation && date) {
            query += `
                WHERE r.fromlocation = @fromlocation 
                AND r.tolocation = @tolocation 
                AND CAST(s.dtime AS DATE) = @date
            `;
        }

        const request = pool.request();

        if (fromlocation && tolocation && date) {
            request.input('fromlocation', sql.VarChar, fromlocation);
            request.input('tolocation', sql.VarChar, tolocation);
            request.input('date', sql.Date, date);
        }

        const result = await request.query(query);

        res.status(200).json({ success: true, data: result.recordset });
    } catch (error) {
        console.error("Fetch schedules error:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

module.exports = router;
