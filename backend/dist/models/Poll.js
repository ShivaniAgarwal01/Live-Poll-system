"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poll = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PollSchema = new mongoose_1.default.Schema({
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
exports.Poll = mongoose_1.default.model("Poll", PollSchema);
//# sourceMappingURL=Poll.js.map