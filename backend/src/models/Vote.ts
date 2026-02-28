import mongoose from "mongoose";

const VoteSchema = new mongoose.Schema({
  pollId: { type: mongoose.Schema.Types.ObjectId, ref: "Poll" },
  studentId: { type: String }, // UUID
  optionId: { type: String }
});

// 🚫 Prevent double voting
VoteSchema.index({ pollId: 1, studentId: 1 }, { unique: true });

export const Vote = mongoose.model("Vote", VoteSchema);