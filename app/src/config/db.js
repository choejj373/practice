"use strict"
const mysql = require("mysql");
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"1214",
    database:"practice",

});

db.connect();

module.exports = db;