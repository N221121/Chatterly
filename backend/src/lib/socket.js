import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleare.js";

const app = express();
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: [ENV.CLIENT_URL],
        credentials: true,
    },
});
//authentication middleware
io.use(socketAuthMiddleware);

//to check whethe the user in online or offline
export function getReceiverSocketId(userId) {
    return userSocketMap[userId]
}

const userSocketMap = {};  // userId:socketId
io.on("connection", (socket) => {
    console.log("A user connected", socket.user.fullName);

    const userId = socket.userId;
    userSocketMap[userId] = socket.id;
    
    console.log("Current Online Users:", userSocketMap);

    //io.emit() is used to send events to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    //socket.on means we listen for events from clients
    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.user.fullName);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

    });
    socket.on("typing", ({ receiverId }) => {
        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("userTyping", {
                senderId: socket.userId,
            });
        }
    });

    socket.on("stopTyping", ({ receiverId }) => {
        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("userStoppedTyping", {
                senderId: socket.userId,
            });
        }
    });

    // socket.js

    /*socket.on("call-user", ({ to, offer }) => {
        const receiverSocketId = getReceiverSocketId(to);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("incoming-call", {
                from: socket.userId,
                offer,
            });
        }
    });*/

    socket.on("call-user", ({ to, offer }) => {

        console.log("===== CALL USER =====");
        console.log("Caller:", socket.user.fullName);
        console.log("Caller ID:", socket.userId);
        console.log("Receiver ID:", to);

        const receiverSocketId = getReceiverSocketId(to);

        console.log("Receiver Socket:", receiverSocketId);
        console.log("Online Users:", userSocketMap);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("incoming-call", {
                from: socket.userId,
                offer,
            });

            console.log("Incoming call emitted");
        } else {
            console.log("Receiver socket not found");
        }
    });

    socket.on("answer-call", ({ to, answer }) => {
        const receiverSocketId = getReceiverSocketId(to);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("call-answered", {
                answer,
            });
        }
    });

    socket.on("ice-candidate", ({ to, candidate }) => {

    const receiverSocketId = getReceiverSocketId(to);

    if (receiverSocketId) {

        io.to(receiverSocketId).emit("ice-candidate", {
            candidate,
        });

    }

});
    socket.on("call-rejected", ({ to }) => {

        const receiverSocketId = getReceiverSocketId(to);

        if (receiverSocketId) {

            io.to(receiverSocketId).emit("call-rejected");

        }

    });
    socket.on("end-call", ({ to }) => {

        const receiverSocketId = getReceiverSocketId(to);

        if (receiverSocketId) {

            io.to(receiverSocketId).emit("end-call");

        }

    });
});



export { io, app, server };
