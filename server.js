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
        const result= await pool.request().query("SELECT * FROM users");
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

app.post("/api/users",async(req,res)=>{
    try{
        const {userid,fullname,email,phone,urole} =req.body;
        if(!userid || !fullname || !email ||!phone || !urole)
        {
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }
        const pool =await poolPromise;
        const result= 
        await pool
        .request()
        .input("userid",sql.Int,userid)
        .input("fullname",sql.VarChar,fullname)
        .input("email",sql.VarChar,email)
        .input("phone",sql.VarChar,phone)
        .input("urole",sql.VarChar,urole)
        .query("Insert into users (userid, fullname, email, phone, urole) values (@userid, @fullname, @email, @phone, @urole)");
        res.status(201).json({
             success: true,
             message: "User inserted successfully",
             rowsAffected: result.rowsAffected[0],
        });
    }
    catch(error){
       res.status(500).json(error.message);
    }
})

app.get("/api/Schedules",async(req,res)=>{
    try{
        const pool =await poolPromise;
        const result= await pool.request().query("SELECT * FROM schedules");
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

