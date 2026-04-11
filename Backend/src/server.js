import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connectDB from "./config/db.js";
import http from "http";
import './modules/assignment/assignment.cron.js'
import { initSocket } from "./sockets/socket.js";
// Connect DB
connectDB();

const PORT = process.env.PORT || 5000;


// Create HTTP server
const server = http.createServer(app);

// Initialize Socket
initSocket(server);



server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});