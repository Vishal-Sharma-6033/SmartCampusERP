import { Server } from "socket.io";
let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Connected:", socket.id);

    socket.on("join", ({ userId, role }) => {
      socket.join(userId); // private room
      socket.join(role);   // role-based room

      console.log(`User ${userId} joined`);
    });

   
    socket.on("disconnect", () => {
      console.log(" Disconnected:", socket.id);
    });
  });
};
export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};