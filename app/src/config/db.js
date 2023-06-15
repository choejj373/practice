"use strict"
const mysql = require("mysql");

const db = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PSWORD,
    database:process.env.DB_DATABASE,

});
 
// const db = mysql.createConnection({
//     host:"localhost",
//     user:"root",
//     password:"1214",
//     database:"practice",

// });

db.connect();

module.exports = db;