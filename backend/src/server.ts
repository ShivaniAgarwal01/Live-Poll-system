import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import mongoose from "mongoose";
import app from "./app";
import path from "path";
import { pollSocket } from "./sockets/poll.sockets";

// dotenv.config();
dotenv.config({
  path: path.resolve(process.cwd(), ".env")
});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" ,  methods: ["GET", "POST"]} });
app.set("io", io);
pollSocket(io);
console.log("👉 MONGO_URI USED BY APP =", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI!)
.then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });


server.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000");
});
