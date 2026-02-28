import express from "express";
import cors from "cors";
import pollRoutes from "./routes/poll.routes";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/poll", pollRoutes);

// Optional health check (VERY useful)
app.get("/", (_req, res) => {
  res.send("Live Polling Backend is running 🚀");
});

export default app;