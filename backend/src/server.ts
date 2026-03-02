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

/* Load env */
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

/* Create HTTP + Socket server */
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.set("io", io);
pollSocket(io);


/* Connect MongoDB WITHOUT killing server */
(async () => {
  try {
    console.log("MONGO_URI USED BY APP =", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ MongoDB connected");
    isDBConnected = true;

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ MongoDB connection failed:");
    console.error(err);
    process.exit(1); // stop app if DB not connected
  }
})();

