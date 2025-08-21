const sql = require('mssql');
require('dotenv').config();

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        encrypt: false,        // SQL Server does not require encryption by default
        enableArithAbort: true
    },
    instanceName: process.env.DB_INSTANCE // important for SQLEXPRESS
};

const pool = new sql.ConnectionPool(config);

const poolPromise = pool.connect()
    .then(pool => {
        console.log('Connected to database');
        return pool;
    })
    .catch(err => {
        console.error('Database connection failed: ', err);
        throw err;
    });

module.exports = {
    sql,
    poolPromise
};
