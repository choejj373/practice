// "use strict";

const express = require("express");
// const bodyParser = require("body-parser");
const dotenv = require ("dotenv");
const session = require("express-session");
const cookieParser = require('cookie-parser');


//const redisStore = require("connect-redis").default;
const memcachedStore = require("connect-memcached")(session);

//const redis = require("redis");

dotenv.config();

const app = express();

const minute = 1000 * 60;
const hour = minute * 60;


// let redisClient = redis.createClient({
//     url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
//     legacyMode : true
// });

// redisClient.on( 'connect', ()=>{
//     console.info( 'Redis Connected!');

//     redisClient.on('error', (err)=>{
//         console.error('Redis Client Error', err);
//     })
// })

// redisClient.connect().then();
// const redisCli = redisClient.v4;

app.use(cookieParser(process.env.COOKIE_SECRET));

const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    proxy: "true",
    store: new memcachedStore({ 
        hosts: "127.0.0.1",
        port: 11211,
        secret: "123, easy as ABC",
        // maxExpiration:60,
        // clearExpired: true,
        // checkExpirationInterval: minute,
        // expiration: hour,
        unset: 'destroy'
    }),
    rolling:true,
    cookie:{
         maxAge: minute,
    },

 
}; 

app.use( session(sessionOption));

//redisClient.set('key', '123');
// redisClient.get('key',(err,value)=>{
//     console.log(value);
// });
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

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded( { extended:true } ));

app.use(express.json());
app.use(express.urlencoded( { extended:true } ));

app.use('/', home);

module.exports = app;
 
