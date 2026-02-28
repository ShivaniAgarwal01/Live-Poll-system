import { Router } from "express";
import { PollController } from "../controllers/poll.controller";

const router = Router();

// Create a new poll (Teacher)
router.post("/", PollController.createPoll);

// Get current active poll (State recovery)
router.get("/current", PollController.getCurrentPoll);

// Get poll history
router.get("/history", PollController.getPollHistory);

export default router;