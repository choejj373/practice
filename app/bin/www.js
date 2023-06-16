
"use strict";


const app = require("../app");
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () =>{
    console.log("서버 가동");
});

const SocketIO = require("socket.io");
const io = SocketIO( server, {path: "/socket.io"});

io.on("connection", function( socket ){
    console.log( socket.id, " connected...");

    io.emit( "msg", `${socket.id} has entered the chatroom.`);

    socket.on("msg", function(data){
        console.log( socket.id, "Received Msg: ", data);
        io.emit( "msg", `${socket.id}: ${data}`);
    });

    socket.on("disconnect", function(data){
        io.emit("msg",  `${socket.id} has left the chatroom.` );
    });
});   