import mongoose from "mongoose";

const PollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [
    {
      id: String,
      text: String,
      votes: { type: Number, default: 0 }
    }
  ],
  startTime: { type: Number }, // server timestamp
  duration: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  endsAt: { type: Number, required: true },
});

export const Poll = mongoose.model("Poll", PollSchema);