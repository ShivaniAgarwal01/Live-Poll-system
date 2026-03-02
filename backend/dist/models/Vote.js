"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vote = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const VoteSchema = new mongoose_1.default.Schema({
    pollId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Poll" },
    studentId: { type: String }, // UUID
    optionId: { type: String }
});
// 🚫 Prevent double voting
VoteSchema.index({ pollId: 1, studentId: 1 }, { unique: true });
exports.Vote = mongoose_1.default.model("Vote", VoteSchema);
//# sourceMappingURL=Vote.js.map