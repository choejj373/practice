
"use strict";
const session = require("express-session");

const app = require("../app");
const PORT = process.env.PORT || 3000;


const minute = 1000 * 60;
const hour = minute * 60;

/**---------------------------------------------------------------*/
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
    // name: "aaaa",
    cookie:{
        httpOnly:true,
        secure:false,
        maxAge: minute * 5,
    },
    store: redisStore
});

app.use( sessionMiddleware );

const server = app.listen(PORT, () =>{
    console.log("서버 가동");
});

/**=========================================================== */
const SocketIO = require("socket.io");
const ioForClient = SocketIO( server, {path: "/socket.io"});

/**=========================================================== */
const ioConnector = require("socket.io-client");
const socketConnector = ioConnector.connect( process.env.MATCHMAKINGSVR_URL);
/**=========================================================== */
socketConnector.on('connection',()=>{
    logger.Info("match making server is connected");
});
socketConnector.on("matched",(data)=>{
     console.log("matched : " + data);
     // 클라이언트에게 멀티플레이 서버로 접속
    //  ioForClient.sockets.to(data)emit("move","http://localhost:3002");
});

socketConnector.on("match-failed",(data)=>{
    console.log("match failed : " + data);
    // 클라이언트에게 멀티플레이 서버로 접속
    // ioForClient.emit("match-failed");
    // ioForClient.sockets.to(data).emit("matchfailed")
})


/**=========================================================== */
// http session과 연동
const wrap = (middleware) => (socket,next) => middleware(socket.request, socket.request.res || {}, next);
ioForClient.use( wrap( sessionMiddleware));
ioForClient.use( (socket,next) =>{
    const session = socket.request.session;
    // console.log( session.userId );
    // 인증 안된 session이라면 여기서 접속 차단 가능하다.아니면 on connection에서도 가능
    next();
});

/**=========================================================== */
ioForClient.on("connection", function( socket ){
    console.log( socket.id, " connected...");
    // console.log( socket.request.session);

    socket.on("disconnect", function(reason){
        console.log( socket.id, " : Disconnected")
    });

    socket.on('match', function(data){
        console.log("match : ");
        let msg = { 
            userId:socket.request.session.user_id,
            socketId:socket.id
        };
        console.log( msg );
        socketConnector.emit('match', JSON.stringify(msg) );
    });
});   