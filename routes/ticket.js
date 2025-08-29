const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');

router.get("/", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM tickets");
        res.status(200).json({ success: true, empData: result.recordset });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

module.exports = router;
