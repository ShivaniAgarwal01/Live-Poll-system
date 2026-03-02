"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDBConnected = void 0;
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
exports.isDBConnected = false;
const app_1 = __importDefault(require("./app"));
const path_1 = __importDefault(require("path"));
const poll_sockets_1 = require("./sockets/poll.sockets");
const dns_1 = __importDefault(require("dns"));
dns_1.default.setServers(["1.1.1.1", "8.8.8.8"]);
/* 1️⃣ Load env */
dotenv_1.default.config({
    path: path_1.default.resolve(process.cwd(), ".env"),
});
/* 2️⃣ Create HTTP + Socket server */
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
});
app_1.default.set("io", io);
/* 3️⃣ Start server FIRST (IMPORTANT) */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
/* 4️⃣ Init sockets */
(0, poll_sockets_1.pollSocket)(io);
console.log("MONGO_URI USED BY APP =", process.env.MONGO_URI);
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
});
mongoose_1.default.set("bufferCommands", false);
/* 5️⃣ Connect MongoDB WITHOUT killing server */
(async () => {
    try {
        console.log("MONGO_URI USED BY APP =", process.env.MONGO_URI);
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected");
        exports.isDBConnected = true;
    }
    catch (err) {
        console.error("❌ MongoDB connection failed (server still running):");
        console.error(err);
        exports.isDBConnected = false;
    }
})();
server.listen(process.env.PORT || 5000, () => {
    console.log("Server running on port 5000");
});
//# sourceMappingURL=server.js.map