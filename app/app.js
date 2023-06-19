"use strict";

const express = require("express");
const dotenv = require ("dotenv");
const session = require("express-session");
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

const minute = 1000 * 60;
const hour = minute * 60;


/**---------------------------------------------------------------*/
// MemoryStore For Dev
app.use(
    session({
        secret:process.env.COOKIE_SECRET,
        resave:false,
        saveUninitialized: false, 
    })
);
/**---------------------------------------------------------------*/
// const memcachedStore = require("connect-memcached")(session);
// app.use(cookieParser(process.env.COOKIE_SECRET));
//
// const sessionOption = {
//     resave: false,
//     saveUninitialized: false,
//     secret: process.env.COOKIE_SECRET,
//     proxy: "true",
//     store: new memcachedStore({ 
//         hosts: "127.0.0.1",
//         port: 11211,
//         secret: "123, easy as ABC",
//         // maxExpiration:60,
//         // clearExpired: true,
//         // checkExpirationInterval: minute,
//         // expiration: hour,
//         unset: 'destroy'
//     }),
//     rolling:true,
//     cookie:{
//          maxAge: minute,
//     },
// }; 
// app.use( session(sessionOption));

/**---------------------------------------------------------------*/
// const MySqlStore = require("express-mysql-session")(session);
// const options = {
//     host: "localhost",
//     port: 3306,
//     user: "root",
//     password: "1214",
//     database: "practice",

//     clearExpired: true,
//     checkExpirationInterval: minute,
//     expiration: hour,
// };

// const sessionStore = new MySqlStore( options );

// app.use(
//     session({
//         key: "session_cookie_name",
//         secret: "session_cookie_secret",
//         store: sessionStore,
//         resave: false,
//         saveUninitialized: false,
//         rolling:true,
//         cookie:{
//             maxAge: minute * 5,
//         }
//     })
// );


const home = require("./src/routes/home");

app.set("views", "./src/views" );
app.set("view engine", "ejs");

app.use(express.static(`${__dirname}/src/public`));

app.use(express.json());
app.use(express.urlencoded( { extended:true } ));

app.use('/', home);

module.exports = app;
 
