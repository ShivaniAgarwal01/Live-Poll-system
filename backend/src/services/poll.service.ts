import { Poll } from "../models/Poll";
import { Vote } from "../models/Vote";

export class PollService {

  static async createPoll(data: {
    question: string;
    options: string[];
    duration: number;
  }) {
    const existingPoll = await Poll.findOne({ isActive: true });
    const endsAt = Date.now() + data.duration * 1000;

    if (existingPoll) {
      throw new Error("Poll already active");
    }

    const poll = await Poll.create({
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

  static async submitVote(pollId: string, studentId: string, optionId: string) {
    const poll = await Poll.findById(pollId);
    if (!poll || !poll.isActive) {
      throw new Error("Poll not active");
    }

    await Vote.create({ pollId, studentId, optionId });

    const option = poll.options.find(o => o.id === optionId);
    if (option) option.votes += 1;

    await poll.save();
    return poll;
  }
  static async getCurrentPoll(studentId?: string) {
    const poll = await Poll.findOne({ isActive: true });

    if (!poll) {
      return { poll: null };
    }

    const now = Date.now();
    const elapsedSeconds = Math.floor((now - poll.startTime!) / 1000);
    const remainingTime = Math.max(
      poll.duration - elapsedSeconds,
      0
    );

    // Check if student already voted
    let hasVoted = false;
    if (studentId) {
      const vote = await Vote.findOne({
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
    return Poll.find({ isActive: false })
      .sort({ startTime: -1 });
  }


}