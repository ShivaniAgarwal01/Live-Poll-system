// import http from "http";
// import dotenv from "dotenv";
// import { Server } from "socket.io";
// import mongoose from "mongoose";
// import app from "./app";
// import path from "path";
// import { pollSocket } from "./sockets/poll.sockets";

// // dotenv.config();
// dotenv.config({
//   path: path.resolve(process.cwd(), ".env")
// });

// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" ,  methods: ["GET", "POST"]} });
// app.set("io", io);
// pollSocket(io);
// console.log("MONGO_URI USED BY APP =", process.env.MONGO_URI);
// mongoose.connect(process.env.MONGO_URI!)
// .then(() => console.log("MongoDB connected"))
//   .catch((err) => {
//     console.error("MongoDB connection error:", err);
//     process.exit(1);
//   });


// server.listen(process.env.PORT ||5000, () => {
//   console.log("Server running on port 5000");
// });

import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import mongoose from "mongoose";
export let isDBConnected = false;
import app from "./app";
import path from "path";
import { pollSocket } from "./sockets/poll.sockets";
import dns from "dns";

dns.setServers(["1.1.1.1" ,"8.8.8.8"]);

/* 1️⃣ Load env */
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

/* 2️⃣ Create HTTP + Socket server */
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.set("io", io);

/* 3️⃣ Start server FIRST (IMPORTANT) */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* 4️⃣ Init sockets */
pollSocket(io);

mongoose.set("bufferCommands", false);

/* 5️⃣ Connect MongoDB WITHOUT killing server */
(async () => {
  try {
    console.log("MONGO_URI USED BY APP =", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ MongoDB connected");
    isDBConnected = true;
  } catch (err) {
    console.error("❌ MongoDB connection failed (server still running):");
    console.error(err);
    isDBConnected = false;
  }
})();