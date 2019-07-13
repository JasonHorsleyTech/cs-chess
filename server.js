const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// app.use('/style', express.static(__dirname + '/style'));
app.get('/', (req, res) => res.sendFile(__dirname + "/index.html"));
app.get('/dist/build.js', (req, res) => res.sendFile(__dirname + "/dist/build.js"));

io.on("connection", (socket) => {
    socket.on("message", (msg) => {
        io.emit("message", msg);
    });
});

http.listen(3000, () => { console.log("Listening on port 3000") });