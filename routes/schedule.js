const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');

// GET /api/schedules
// Optional query params: fromlocation, tolocation, date (YYYY-MM-DD), upcomingOnly=true|false
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    const {
      fromlocation,
      tolocation,
      date,          // "YYYY-MM-DD"
      upcomingOnly,  // "true" | "false" | undefined
    } = req.query;

    // Base query
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
      JOIN bus b    ON s.busid    = b.busid
      LEFT JOIN driver d ON b.busid = d.assignedbusid
      WHERE 1 = 1
    `;

    // From filter (case/whitespace-insensitive)
    if (fromlocation) {
      query += `
        AND LOWER(LTRIM(RTRIM(r.fromlocation))) = LOWER(LTRIM(RTRIM(@fromlocation)))
      `;
      request.input("fromlocation", sql.VarChar, fromlocation);
    }

    // To filter (case/whitespace-insensitive)
    if (tolocation) {
      query += `
        AND LOWER(LTRIM(RTRIM(r.tolocation))) = LOWER(LTRIM(RTRIM(@tolocation)))
      `;
      request.input("tolocation", sql.VarChar, tolocation);
    }

    // Date filter
    if (date) {
      // Only rows on that calendar date
      query += `
        AND CAST(s.dtime AS DATE) = @date
      `;
      request.input("date", sql.Date, date);
    }

    // Upcoming-only logic
    // - with date:
    //    * if date < today  -> none
    //    * if date = today  -> s.dtime >= now
    //    * if date > today  -> all for that date (already filtered above)
    // - without date:
    //    * s.dtime >= now
    if (String(upcomingOnly).toLowerCase() === "true") {
      if (date) {
        query += `
          AND (
            @date > CAST(GETDATE() AS DATE)                           -- future date
            OR (@date = CAST(GETDATE() AS DATE) AND s.dtime >= GETDATE()) -- today & not yet departed
          )
        `;
        // If @date < today, both conditions are false → returns none automatically
      } else {
        // No date provided: just future departures
        query += `
          AND s.dtime >= GETDATE()
        `;
      }
    }

    // Order by soonest first
    query += ` ORDER BY s.dtime ASC`;

    const result = await request.query(query);
    return res.status(200).json({ success: true, data: result.recordset });
  } catch (error) {
    console.error("Fetch schedules error:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;