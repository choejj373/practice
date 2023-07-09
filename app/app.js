"use strict";

const express = require("express");
const dotenv = require ("dotenv")
const crypto = require ("crypto");
const cookieParser = require('cookie-parser');
const expressSession = require("express-session");
const cors = require("cors"); 
// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth2").Strategy;

dotenv.config();

// console.log( SymmetricKey );
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

    // clearExpired: true,
    // checkExpirationInterval: minute,
    // expiration: hour,
};

const sessionMySqlStore = new MySqlStore( options );


const sessionMiddleware = session({
        key: "session_cookie_name",
        secret: "session_cookie_secret",
        store: sessionMySqlStore,
        resave: false,
        saveUninitialized: false,
        rolling:true,
        cookie:{
            maxAge: minute * 5,
        }
    })

*/
 
/*
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
*/
//app.use( sessionMiddleware );




// // passport 초기화 및 session 연결
// app.use(passport.initialize());
// // app.use(passport.session());

// // login이 최초로 성공했을 때만 호출되는 함수
// // done(null, user.id)로 세션을 초기화 한다.
//  passport.serializeUser(function (user, done) {
//     console.log( "serializeUser" );
//     done(null, user );
//  });

// // 사용자가 페이지를 방문할 때마다 호출되는 함수
// // done(null, id)로 사용자의 정보를 각 request의 user 변수에 넣어준다.
//  passport.deserializeUser(function (id, done) {
//     console.log( "deserializeUser" );
//     done(null, id);
//  });

// Google login 전략
// 로그인 성공 시 callback으로 request, accessToken, refreshToken, profile 등이 나온다.
// 해당 콜백 function에서 사용자가 누구인지 done(null, user) 형식으로 넣으면 된다.
// 이 예시에서는 넘겨받은 profile을 전달하는 것으로 대체했다.
// passport.use(
//     new GoogleStrategy(
//         {
//             clientID: process.env.GOOGLE_ID,
//             clientSecret: process.env.GOOGLE_SECRET,
//             callbackURL: "http://localhost:3000/auth/google/callback",
//             passReqToCallback: true,
//         },
//         function (request, accessToken, refreshToken, profile, done) {
//             console.log(profile);
//             console.log(accessToken);
            

//             return done(null, profile);
//         }
//     )
// );

const home = require("./src/routes/home");


app.set("views", "./src/views" );
app.set("view engine", "ejs");

app.use(express.static(`${__dirname}/src/public`));

app.use(express.json());
app.use(express.urlencoded( { extended:true } ));

app.use('/', home);

// app.use(function (req, res, next) {     
//     res.header("Access-Control-Allow-Origin", "*");     
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");     
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');     
//     next(); 
// });

app.use(cors());
module.exports = app;

// module.exports.sessionMiddleware = sessionMiddleware;