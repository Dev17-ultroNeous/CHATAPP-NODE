const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoute")
const dotenv = require("dotenv");

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config({ path: "./config.env" });

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || "error";
    res.status(statusCode).json({
        status,
        message: err.message,
    });
});

var clients = {};
io.on("connection", (socket) => {
    console.log("connetetd");
    console.log(socket.id, "has joined");
    socket.on("signin", (id) => {
        clients[id] = socket;
    });

    socket.on("message", (msg) => {
        let targetId = msg.targetId;
        if (clients[targetId]) clients[targetId].emit("message", msg);
    });
    socket.on("typing", function (data) {
        socket.broadcast.emit("typing", data);
    });
    socket.on("disconnect", async (req, res, next) => {
        io.emit("signin", `--- left the chat---`);
    });
});

app.use(userRoutes);





mongoose.connect(
    process.env.dbUrl,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    },
    (err) => {
        console.log("mongodb connected");
    }
);

var server = http.listen(3000, () => {
    console.log("server is running on port", server.address().port);
});



