"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const poll_controller_1 = require("../controllers/poll.controller");
const router = (0, express_1.Router)();
// Create a new poll (Teacher)
router.post("/", poll_controller_1.PollController.createPoll);
// Get current active poll (State recovery)
router.get("/current", poll_controller_1.PollController.getCurrentPoll);
// Get poll history
router.get("/history", poll_controller_1.PollController.getPollHistory);
exports.default = router;
//# sourceMappingURL=poll.routes.js.map