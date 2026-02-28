import { Server, Socket } from "socket.io";
import { PollService } from "../services/poll.service";
import { Poll } from "../models/Poll";

interface StudentInfo {
  socketId: string;
  studentId: string;
  name: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  role: "teacher" | "student";
  message: string;
  timestamp: number;
}

const chatMessages: ChatMessage[] = [];

export function pollSocket(io: Server) {

  const students = new Map<string, StudentInfo>();
  
  io.on("connection", (socket: Socket) => {
    console.log("🔌 Socket connected:", socket.id);

    // Test event for socket connection
    socket.on("test", (msg) => {
      console.log(`Received test event from client: ${msg}`);
      socket.emit("test_response", `Server received: ${msg}`);
    });

    socket.on("student_join", ({ studentId, name }) => {
  const nameTaken = Array.from(students.values()).some(
        (s) => s.name === name
      );

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
      if(!message || !message.trim()) return;
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

//   socket.on("disconnect", () => {
//   for (const [id] of students) {
//     if (id === socket.id) {
//       students.delete(id);
//       io.emit("student_list", [...students.entries()]);
//     }
//   }
// });



// socket.on("kick_student", (studentId: string) => {
//       for (const [sockId, student] of students.entries()) {
//         if (student.studentId === studentId) {
//           io.to(sockId).emit("kicked");
//           io.sockets.sockets.get(sockId)?.disconnect(true);
//           students.delete(sockId);
//           break;
//         }
//       }

//       io.emit("student_list", Array.from(students.values()));
//     });
socket.on("kick_student", (socketId: string) => {
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
        const poll = await PollService.submitVote(
          data.pollId,
          data.studentId,
          data.optionId
        );

        io.emit("vote_update", poll);
      } catch (err: any) {
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

    // socket.on("disconnect", () => {
    //   console.log("❌ Socket disconnected:", socket.id);
    // });
  // });

  // 🔥 SERVER TIMER CHECK (OPTIONAL BUT GOOD)
  setInterval(async () => {
    const poll = await Poll.findOne({ isActive: true });
    if (!poll) return;

    const elapsed =Math.floor((Date.now() - poll.startTime!) / 1000);
      // const remaining = poll.duration - elapsed;
      const remainingTime = Math.max(
    0,
    Math.floor((poll.endsAt - Date.now()) / 1000)
  );

      if (remainingTime == 0) {
    poll.isActive = false;
    await poll.save();
    io.emit("poll_ended", poll);
  } else {
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