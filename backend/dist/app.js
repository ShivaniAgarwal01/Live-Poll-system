"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const poll_routes_1 = __importDefault(require("./routes/poll.routes"));
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/poll", poll_routes_1.default);
// Optional health check (VERY useful)
app.get("/", (_req, res) => {
    res.send("Live Polling Backend is running 🚀");
});
exports.default = app;
//# sourceMappingURL=app.js.map