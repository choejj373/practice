"use strict"
// const mysql = require("mysql2");

// const dbPool = mysql.createPool({
//     host:process.env.DB_HOST,
//     user:process.env.DB_USER,
//     password:process.env.DB_PSWORD,
//     database:process.env.DB_DATABASE,
//     connectionLimit:10,
//     multipleStatements: true,
// });
// //try catch 필요한가?
// function getConnection(callback){
//     dbPool.getConnection( function(err, conn ){
//         if(!err){
//             callback(conn);
//         }
//     });
// }
 
//module.exports = getConnection;
//module.exports = dbPool;