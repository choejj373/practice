"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require ("dotenv");

dotenv.config();

const app = express();

const session = require("express-session");
const MySqlStore = require("express-mysql-session")(session);
const minute = 1000 * 60;
const hour = minute * 60;
const options = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "1214",
    database: "practice",

    clearExpired: true,
    checkExpirationInterval: minute,
    expiration: hour,
};

const sessionStore = new MySqlStore( options );

app.use(
    session({
        key: "session_cookie_name",
        secret: "session_cookie_secret",
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie:{
            maxAge: minute * 5,
        }
    })
);


const home = require("./src/routes/home");

app.set("views", "./src/views" );
app.set("view engine", "ejs");

app.use(express.static(`${__dirname}/src/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended:true } ));

app.use('/', home);

module.exports = app;
 
