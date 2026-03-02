"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollService = void 0;
const Poll_1 = require("../models/Poll");
const Vote_1 = require("../models/Vote");
class PollService {
    static async createPoll(data) {
        const existingPoll = await Poll_1.Poll.findOne({ isActive: true });
        const endsAt = Date.now() + data.duration * 1000;
        if (existingPoll) {
            throw new Error("Poll already active");
        }
        const poll = await Poll_1.Poll.create({
            question: data.question,
            options: data.options.map(opt => ({
                id: crypto.randomUUID(),
                text: opt,
                votes: 0
            })),
            startTime: Date.now(),
            duration: data.duration,
            endsAt,
            isActive: true
        });
        return poll;
    }
    static async submitVote(pollId, studentId, optionId) {
        const poll = await Poll_1.Poll.findById(pollId);
        if (!poll || !poll.isActive) {
            throw new Error("Poll not active");
        }
        await Vote_1.Vote.create({ pollId, studentId, optionId });
        const option = poll.options.find(o => o.id === optionId);
        if (option)
            option.votes += 1;
        await poll.save();
        return poll;
    }
    static async getCurrentPoll(studentId) {
        const poll = await Poll_1.Poll.findOne({ isActive: true });
        if (!poll) {
            return { poll: null, remainingTime: 0, hasVoted: false };
        }
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - poll.startTime) / 1000);
        const remainingTime = Math.max(poll.duration - elapsedSeconds, 0);
        // Check if student already voted
        let hasVoted = false;
        if (studentId) {
            const vote = await Vote_1.Vote.findOne({
                pollId: poll._id,
                studentId
            });
            hasVoted = !!vote;
        }
        // Auto end poll if time expired
        if (remainingTime === 0 && poll.isActive) {
            poll.isActive = false;
            await poll.save();
        }
        return {
            poll,
            remainingTime,
            hasVoted
        };
    }
    // 📜 POLL HISTORY
    static async getPollHistory() {
        return Poll_1.Poll.find({ isActive: false })
            .sort({ startTime: -1 });
    }
}
exports.PollService = PollService;
//# sourceMappingURL=poll.service.js.map