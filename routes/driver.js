const express = require("express");
const router = express.Router();
const { poolPromise } = require("../db");

// Get all drivers
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT d.driverid, d.fullname, d.phone, d.licensenum, d.assignedbusid,
             b.busnumber, b.company
      FROM driver d
      LEFT JOIN bus b ON d.assignedbusid = b.busid
      ORDER BY d.driverid DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching drivers" });
  }
});

// Add a new driver
router.post("/", async (req, res) => {
  try {
    const { fullname, phone, licensenum, assignedbusid } = req.body;

    if (!fullname || !licensenum) {
      return res.status(400).json({ message: "Full name and license number are required" });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input("fullname", fullname)
      .input("phone", phone || null)
      .input("licensenum", licensenum)
      .input("assignedbusid", assignedbusid || null)
      .query(`
        INSERT INTO driver (fullname, phone, licensenum, assignedbusid)
        OUTPUT INSERTED.driverid
        VALUES (@fullname, @phone, @licensenum, @assignedbusid)
      `);

    const driverid = result.recordset[0].driverid;

    // Update schedules only by bus if assigned
    if (assignedbusid) {
      await pool.request()
        .input("busid", assignedbusid)
        .query(`
          UPDATE schedules
          SET busid = @busid
          WHERE busid IS NULL
        `);
    }

    res.status(201).json({ message: "Driver added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding driver" });
  }
});

// Update driver bus assignment
router.put("/:driverid/assign-bus", async (req, res) => {
  try {
    const { driverid } = req.params;
    const { busid } = req.body;

    if (!busid) {
      return res.status(400).json({ message: "Bus ID is required" });
    }

    const pool = await poolPromise;

    // Update driver table
    await pool.request()
      .input("driverid", driverid)
      .input("busid", busid)
      .query(`
        UPDATE driver
        SET assignedbusid = @busid
        WHERE driverid = @driverid
      `);

    // Update schedules only by bus if needed
    await pool.request()
      .input("busid", busid)
      .query(`
        UPDATE schedules
        SET busid = @busid
        WHERE busid IS NULL
      `);

    res.json({ message: "Driver bus assignment updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating bus assignment" });
  }
});

// Delete driver
router.delete("/:driverid", async (req, res) => {
  try {
    const { driverid } = req.params;

    if (!driverid) {
      return res.status(400).json({ message: "Driver ID is required" });
    }

    const pool = await poolPromise;
    await pool.request()
      .input("driverid", driverid)
      .query(`DELETE FROM driver WHERE driverid = @driverid`);

    res.json({ message: `Driver #${driverid} deleted successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting driver" });
  }
});

module.exports = router;
