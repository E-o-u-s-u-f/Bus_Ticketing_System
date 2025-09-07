const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');

router.get("/:scheid", async (req, res) => {
    const { scheid } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("scheid", sql.Int, scheid)
            .query("SELECT ticket_id, seatnum, is_sold FROM tickets WHERE scheid = @scheid");

        res.status(200).json({
            success: true,
            tickets: result.recordset
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

router.put("/:ticket_id", async (req, res) => {
    const { ticket_id } = req.params;
    const { is_sold } = req.body;

    if (typeof is_sold !== "boolean" && typeof is_sold !== "number") {
        return res.status(400).json({ success: false, message: "is_sold must be 0 or 1 / boolean" });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("ticket_id", sql.Int, ticket_id)
            .input("is_sold", sql.Bit, is_sold)
            .query("UPDATE tickets SET is_sold = @is_sold WHERE ticket_id = @ticket_id");

        res.status(200).json({ success: true, message: "Ticket status updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

module.exports = router;
