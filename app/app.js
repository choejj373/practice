"use strict";

const express = require("express");
const dotenv = require ("dotenv");

const cookieParser = require('cookie-parser');
const session = require("express-session");


dotenv.config();

/**====================================================*/
// For Log System
/* const logger = require("./src/config/logger")
const { log } = require("winston");

logger.error("error");
logger.warn("warning");
logger.info("info");
logger.verbose("verbose");
logger.debug("debug");
logger.silly("silly");
*/

const minute = 1000 * 60;
const hour = minute * 60;

const app = express();


app.use(cookieParser(process.env.COOKIE_SECRET));
/**---------------------------------------------------------------*/
// MemoryStore For Dev
// app.use(
//     session({
//         secret:process.env.COOKIE_SECRET,
//         resave:false,
//         saveUninitialized: false, 
//     })
// );

/**---------------------------------------------------------------*/
// 
// const memcachedStore = require("connect-memcached")(session);
// const cookieParser = require('cookie-parser');
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
/*const MySqlStore = require("express-mysql-session")(session);
const options = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PSWORD,
    database: process.env.DATABASE,

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
        rolling:true,
        cookie:{
            maxAge: minute * 5,
        }
    })
);

 */

const Redis = require('ioredis');
const RedisStore = require('connect-redis').default;

const redis = new Redis({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    password:process.env.REDIS_PASSWORD,    
})

let redisStore = new RedisStore({
    client: redis,
})

const sessionMiddleware = session({

    resave: false,
    saveUninitialized:false,
    secret: process.env.COOKIE_SECRET,
    cookie:{
        httpOnly:true,
        secure:false,
        maxAge: minute * 5,
    },
    store: redisStore
});

app.use( sessionMiddleware );

const home = require("./src/routes/home");


app.set("views", "./src/views" );
app.set("view engine", "ejs");

app.use(express.static(`${__dirname}/src/public`));

app.use(express.json());
app.use(express.urlencoded( { extended:true } ));

app.use('/', home);

 
module.exports.app = app;
module.exports.sessionMiddleware = sessionMiddleware;