import {Server} from "socket.io";
import http from "http";
import express from "express";
import {ENV} from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleare.js";

const app= express();
const server = http.createServer(app)

const io=new Server(server,{
    cors: {
        origin:[ENV.CLIENT_URL],
        credentials: true,
    },
});
//authentication middleware
io.use(socketAuthMiddleware);

//to handle offline and online users
//storing online users
const userSocketMap = {};  // userId:socketId
io.on("connection", (socket)=>{
    console.log("A user connected",socket.user.fullName);

    const userId=socket.userId;
    userSocketMap[userId]=socket.id

    //io.emit() is used to send events to all connected clients
    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    //socket.on means we listen for events from clients
    socket.on("disconnect",()=>{
        console.log("A user disconnected",socket.user.fullName);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    });
});

export { io, app, server};