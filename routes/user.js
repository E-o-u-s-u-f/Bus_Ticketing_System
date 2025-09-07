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
        const { fullname, email, phone, urole } = req.body;
        if (!fullname || !email || !phone || !urole) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const pool = await poolPromise;

        const check = await pool.request()
            .input("email", sql.VarChar, email)
            .query("SELECT * FROM users WHERE email = @email");

        if (check.recordset.length > 0) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const result = await pool.request()
            .input("fullname", sql.VarChar, fullname)
            .input("email", sql.VarChar, email)
            .input("phone", sql.VarChar, phone)
            .input("urole", sql.VarChar, urole)
            .query("INSERT INTO users (fullname, email, phone, urole) OUTPUT INSERTED.* VALUES (@fullname,@email,@phone,@urole)");

        const newUser = result.recordset[0];

        res.status(201).json({
            success: true,
            message: "User inserted successfully",
            user: newUser
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

module.exports = router;
