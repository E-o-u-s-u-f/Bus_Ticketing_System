const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');

router.get("/", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM users");
        res.status(200).json({ success: true, empData: result.recordset });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { userid, fullname, email, phone, urole } = req.body;
        if (!userid || !fullname || !email || !phone || !urole) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const pool = await poolPromise;
        await pool.request()
            .input("userid", sql.Int, userid)
            .input("fullname", sql.VarChar, fullname)
            .input("email", sql.VarChar, email)
            .input("phone", sql.VarChar, phone)
            .input("urole", sql.VarChar, urole)
            .query("INSERT INTO users (userid, fullname, email, phone, urole) VALUES (@userid,@fullname,@email,@phone,@urole)");
        res.status(201).json({ success: true, message: "User inserted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
