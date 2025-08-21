const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sql, poolPromise } = require('./db.js');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on "${PORT}"`));

app.get("/api/tickets",async(req,res)=>{
    try{
        const pool =await poolPromise;
        const result= await pool.request().query("SELECT * FROM tickets");
        console.log(result);

        res.status(200).json({
            success:true,
            empData:result.recordset
        });
    }
    catch(error){
        console.log(`Error`,error);
        res.status(500).json({
            success:false,
            message:"Server error,try again",
            error:error.message
        });
    }
})

app.get("/api/Users",async(req,res)=>{
    try{
        const pool =await poolPromise;
        const result= await pool.request().query("SELECT * FROM Users");
        console.log(result);

        res.status(200).json({
            success:true,
            empData:result.recordset
        });
    }
    catch(error){
        console.log(`Error`,error);
        res.status(500).json({
            success:false,
            message:"Server error,try again",
            error:error.message
        });
    }
})

app.get("/api/Schedules",async(req,res)=>{
    try{
        const pool =await poolPromise;
        const result= await pool.request().query("SELECT * FROM Schedules");
        console.log(result);

        res.status(200).json({
            success:true,
            empData:result.recordset
        });
    }
    catch(error){
        console.log(`Error`,error);
        res.status(500).json({
            success:false,
            message:"Server error,try again",
            error:error.message
        });
    }
})
