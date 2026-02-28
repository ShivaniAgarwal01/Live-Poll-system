import { Request, Response } from "express";
import { PollService } from "../services/poll.service";

export class PollController {

  // POST /poll
  static async createPoll(req: Request, res: Response) {
    try {
      const poll = await PollService.createPoll(req.body);
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
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

  // GET /poll/current
  static async getCurrentPoll(req: Request, res: Response) {
    try {
      const studentId = req.query.studentId as string | undefined;
      const data = await PollService.getCurrentPoll(studentId);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  // GET /poll/history
  static async getPollHistory(req: Request, res: Response) {
    try {
      const history = await PollService.getPollHistory();
      res.json(history);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

}