"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pollSocket = pollSocket;
const poll_service_1 = require("../services/poll.service");
const Poll_1 = require("../models/Poll");
const server_1 = require("../server");
const chatMessages = [];
function pollSocket(io) {
    const students = new Map();
    io.on("connection", (socket) => {
        console.log("🔌 Socket connected:", socket.id);
        // Test event for socket connection
        socket.on("test", (msg) => {
            console.log(`Received test event from client: ${msg}`);
            socket.emit("test_response", `Server received: ${msg}`);
        });
        socket.on("student_join", ({ studentId, name }) => {
            const nameTaken = Array.from(students.values()).some((s) => s.name === name);
            if (nameTaken) {
                socket.emit("name_error", "Name already taken");
                return;
            }
            students.set(socket.id, {
                socketId: socket.id,
                studentId,
                name,
            });
            io.emit("student_list", Array.from(students.values()));
        });
        socket.on("send_message", ({ sender, role, message }) => {
            if (!message || !message.trim())
                return;
            const newMessage = {
                id: crypto.randomUUID(),
                sender,
                role,
                message,
                timestamp: Date.now(),
            };
            chatMessages.push(newMessage);
            io.emit("chat_message", newMessage);
        });
        // Send chat history on join
        socket.emit("chat_history", chatMessages);
        socket.on("kick_student", (socketId) => {
            const targetSocket = io.sockets.sockets.get(socketId);
            if (targetSocket) {
                targetSocket.emit("kicked");
                targetSocket.disconnect(true); // 🔧 VERY IMPORTANT
            }
            students.delete(socketId);
            io.emit("student_list", Array.from(students.values()));
        });
        socket.on("vote", async (data) => {
            try {
                const poll = await poll_service_1.PollService.submitVote(data.pollId, data.studentId, data.optionId);
                io.emit("vote_update", poll);
            }
            catch (err) {
                socket.emit("error", err.message);
            }
        });
        socket.on("disconnect", () => {
            if (students.has(socket.id)) {
                students.delete(socket.id);
                io.emit("student_list", Array.from(students.values()));
            }
            console.log("❌ Socket disconnected:", socket.id);
        });
    });
    // 🔥 SERVER TIMER CHECK (OPTIONAL BUT GOOD)
    setInterval(async () => {
        if (!server_1.isDBConnected)
            return;
        const poll = await Poll_1.Poll.findOne({ isActive: true });
        if (!poll)
            return;
        const elapsed = Math.floor((Date.now() - poll.startTime) / 1000);
        // const remaining = poll.duration - elapsed;
        const remainingTime = Math.max(0, Math.floor((poll.endsAt - Date.now()) / 1000));
        if (remainingTime == 0) {
            poll.isActive = false;
            await poll.save();
            io.emit("poll_ended", poll);
        }
        else {
            io.emit("poll_timer", {
                pollId: poll._id,
                remainingTime: remainingTime
            });
        }
    }, 1000);
    //   if (elapsed >= poll.duration) {
    //     poll.isActive = false;
    //     await poll.save();
    //     io.emit("poll_ended", poll);
    //   }
    // }, 1000);
}
//# sourceMappingURL=poll.sockets.js.map