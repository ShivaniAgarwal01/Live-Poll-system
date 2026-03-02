"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollController = void 0;
const poll_service_1 = require("../services/poll.service");
class PollController {
    // POST /poll
    static async createPoll(req, res) {
        try {
            const poll = await poll_service_1.PollService.createPoll(req.body);
            req.app.get("io").emit("poll_state", {
                active: true,
                pollId: poll._id,
                question: poll.question,
                options: poll.options.map(o => ({
                    id: o.id,
                    text: o.text
                })),
                duration: poll.duration,
                remainingTime: poll.duration
            });
            res.status(201).json(poll);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    // GET /poll/current
    static async getCurrentPoll(req, res) {
        try {
            const studentId = req.query.studentId;
            const data = await poll_service_1.PollService.getCurrentPoll(studentId);
            res.json(data);
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    // GET /poll/history
    static async getPollHistory(req, res) {
        try {
            const history = await poll_service_1.PollService.getPollHistory();
            res.json(history);
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}
exports.PollController = PollController;
//# sourceMappingURL=poll.controller.js.map