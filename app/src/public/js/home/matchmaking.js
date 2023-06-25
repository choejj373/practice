let socket = io.connect('http://localhost:3000',
{
    path: '/socket.io',
    // transports: ['websocket']
});

socket.on('error', (err)=>{
    console.log("error : ", err);
});

socket.on('connect',()=>{
    // const Id1 = "<%- sessionId%>";
    // const Id2 = "<% sessionId%>";
    console.log("connected");
    // console.log( local.sessionId );
    // console.log( Id2 );
    socket.emit('match' );
});