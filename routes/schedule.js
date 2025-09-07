const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');

router.get("/", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
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
        `);

        res.status(200).json({ success: true, data: result.recordset });
    } catch (error) {
        console.error("Fetch schedules error:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

module.exports = router;
