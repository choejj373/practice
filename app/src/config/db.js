"use strict"
const mysql = require("mysql");

const dbPool = mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PSWORD,
    database:process.env.DB_DATABASE,
    connectionLimit:10,

});

function getConnection(callback){
    dbPool.getConnection( function(err, conn ){
        if(!err){
            callback(conn);
        }
    });
}
 
module.exports = getConnection;