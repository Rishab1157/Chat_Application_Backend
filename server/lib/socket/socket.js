import {Server} from 'socket.io'
import http from 'http'
import express from 'express'

const app=express()
const server=http.createServer(app)

const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        callback(null, true); 
      },
      credentials: true,
    }
});

export function getReceiverSocketId(userId){
  return userSocketMap[userId]
}

// used to store online users
const userSocketMap={} // userId:socketId

io.on("connection", (socket) => {
  console.log("🔥 SOCKET CONNECTED:", socket.id);

  const userId = socket.handshake.auth?.userId;
  console.log("🔥 USER ID:", userId);

  if (!userId) {
    console.log("⛔ Missing userId, disconnecting");
    socket.disconnect(true);
    return;
  }

  userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});


export {io,app,server};