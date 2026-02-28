import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

interface Option {
  id: string;
  text: string;
  votes: number;
}

type Participant = {
  socketId: string;
  studentId: string;
  name: string;
};


export default function Student() {
  const socket = useSocket();

  /* ================= STUDENT ID ================= */
  const studentId =
    sessionStorage.getItem("studentId") ||
    (() => {
      const id = crypto.randomUUID();
      sessionStorage.setItem("studentId", id);
      return id;
    })();

  /* ================= STUDENT NAME ================= */
  const [name, setName] = useState(
    () => sessionStorage.getItem("studentName") || ""
  );
  const [nameEntered, setNameEntered] = useState(!!name);
  const [participants, setParticipants] = useState<Participant[]>([]);


  /* ================= POLL STATE ================= */
  const [pollId, setPollId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [options, setOptions] = useState<Option[]>([]);
  const [remainingTime, setRemainingTime] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [pollEnded, setPollEnded] = useState(false);
  const [kicked, setKicked] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
const [activeTab, setActiveTab] = useState<"chat" | "participants">("chat");
const [messages, setMessages] = useState<any[]>([]);
const [newMessage, setNewMessage] = useState("");

  const onboarding = !nameEntered;

  /* ================= FETCH CURRENT POLL (REFRESH SAFE) ================= */
  useEffect(() => {
  const handleUnload = () => {
    socket?.disconnect();
  };

  window.addEventListener("beforeunload", handleUnload);
  return () => window.removeEventListener("beforeunload", handleUnload);
}, [socket]);
  useEffect(() => {
    if (onboarding) return;

    fetch(`http://localhost:5000/poll/current?studentId=${studentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.poll) {
          setPollId(data.poll._id);
          setQuestion(data.poll.question);
          setOptions(data.poll.options);
          setRemainingTime(data.remainingTime);
          setHasVoted(data.hasVoted);
          setPollEnded(data.remainingTime === 0);
        } else {
          resetPoll();
          setQuestion("");
          setOptions([]);
        }
      });
  }, [studentId, onboarding]);

  

 useEffect(() => {
  if (!socket || !nameEntered) return;

  socket.emit("student_join", {
    studentId,
    name,
  });

  socket.on("name_error", (msg: string) => {
    alert(msg);
    sessionStorage.removeItem("studentName");
    setNameEntered(false);
    // setJoined(false);
    setName("");
  });

//   socket.on("student_list", (list) => {
//   setActiveStudents(list);
// });

  socket.on("kicked", () => {
    sessionStorage.clear();
    setKicked(true);
  });

  socket.on("student_list", (list: Participant[]) => {
  setParticipants(list);
});

  socket?.emit("send_message", {
  sender: name,
  role: "student",
  message: newMessage,
});

  socket?.on("chat_history", (history) => {
  setMessages(history);
});

socket?.on("chat_message", (msg) => {
  setMessages((prev) => [...prev, msg]);
});

  return () => {
    socket.off("name_error");
    socket.off("kicked");
    socket?.off("chat_message");
  socket?.off("chat_history");
  socket.off("student_list");
  };
}, [socket, nameEntered]);

  /* ================= SOCKET LISTENERS ================= */
  useEffect(() => {
    if (!socket || onboarding) return;

    // 🔥 NEW POLL OR REFRESHED POLL
    socket.on("poll_state", (data) => {
      setPollId(data.pollId);
      setQuestion(data.question);
      setOptions(data.options);
      setRemainingTime(data.remainingTime);
      setSelectedOption(null);
    //   setHasSubmitted(false);
      setHasVoted(false); // NEW POLL → allow vote again
      setPollEnded(false);
    });
    socket.on("vote_update", (poll) => {
      setOptions(poll.options);
    });

    // 🔥 TIMER SYNC
    socket.on("poll_timer", (data) => {
      setRemainingTime(data.remainingTime);
      if (data.remainingTime === 0) setPollEnded(true);
    });

    socket.on("poll_ended", () => {
      setPollEnded(true);
    });

    return () => {
      socket.off("poll_state");
      socket.off("vote_update");
      socket.off("poll_timer");
      socket.off("poll_ended");
    };
  }, [socket, onboarding]);

  const sendMessage = () => {
  if (!newMessage.trim()) return;

  socket?.emit("send_message", {
    sender: name,
    role: "student",
    message: newMessage,
  });

  setNewMessage("");
};

  /* ================= VOTE ================= */
  const vote = () => {
    if (!socket || !pollId || !selectedOption || hasVoted || pollEnded) return;

    socket.emit("vote", {
      pollId,
      optionId : selectedOption,
      studentId,
      name,
    });

    setHasVoted(true); // prevents multiple votes
  };

  const resetPoll = () => {
    setPollId(null);
    setQuestion("");
    setOptions([]);
    setRemainingTime(0);
    setHasVoted(false);
    setPollEnded(false);
  };

  /* ================= ONBOARDING ================= */
  if (onboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Let’s Get Started
          </h2>

          <input
            className="w-full border rounded-md p-2 mb-6"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button
            className={`w-full py-2 rounded-full text-white font-semibold text-lg ${
              name.trim()
                ? "bg-violet-600 hover:bg-violet-700"
                : "bg-violet-300 cursor-not-allowed"
            }`}
            disabled={!name.trim()}
            onClick={() => {
              const cleanName = name.trim();
  sessionStorage.setItem("studentName", cleanName);
  setName(cleanName);
              setNameEntered(true);
            // socket?.emit("student_join", { name: cleanName });
// setNameEntered(true);
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (kicked) {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">
          You’ve been Kicked out !
        </h1>
        <p className="text-gray-600">
          Looks like the teacher had removed you from the poll system.
          Please try again sometime.
        </p>
        <button
  onClick={() => {
    setKicked(false);
    setNameEntered(false);
  }}
  className="mt-6 bg-purple-600 text-white px-4 py-2 rounded"
>
  Try Again
</button>
      </div>
    </div>
  );
}

  /* ================= NO POLL ================= */
  if (!question && nameEntered) {
  return (
    <div className="min-h-screen flex items-center justify-center text-gray-600">
      Waiting for teacher to start poll or Entered the name…
    </div>
  );
}


return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="w-full max-w-md bg-white rounded-xl shadow p-6 space-y-5">

      {/* QUESTION HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Question</h2>
        <span className="text-red-500 font-semibold">
          ⏱ {remainingTime}s
        </span>
      </div>

      <div className="bg-gray-700 text-white p-3 rounded-md">
        {question}
      </div>

      {/* OPTIONS */}
      <div className="space-y-3">
        {options.map((o, index) => {
          const totalVotes = options.reduce(
            (sum, r) => sum + r.votes,
            0
          );
          const percent =
            totalVotes > 0
              ? Math.round((o.votes / totalVotes) * 100)
              : 0;

          const showResult = hasVoted || pollEnded;

          return (
            <button
              key={o.id}
              disabled={showResult}
              onClick={() => setSelectedOption(o.id)}
              className={`relative w-full p-3 rounded-lg border text-left overflow-hidden
                ${
                  !showResult
                    ? selectedOption === o.id
                      ? "border-violet-600 bg-violet-50"
                      : "hover:bg-gray-100"
                    : "cursor-default"
                }
              `}
            >
              {/* RESULT BAR (only after submit) */}
              {showResult && (
                <div
                  className="absolute top-0 left-0 h-full bg-violet-500 opacity-80"
                  style={{ width: `${percent}%` }}
                />
              )}

              <div className="relative flex justify-between items-center">
                <span className="flex items-center gap-2 font-medium">
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-violet-600 text-white text-sm">
                    {index + 1}
                  </span>
                  {o.text}
                </span>

                {showResult && (
                  <span className="font-semibold text-violet-700">
                    {percent}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* SUBMIT BUTTON (only before submit) */}
      {!hasVoted && !pollEnded && (
        <button
          onClick={vote}
          disabled={!selectedOption}
          className={`w-full py-2 rounded-full font-semibold text-white ${
            selectedOption
              ? "bg-violet-600 hover:bg-violet-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Submit Answer
        </button>
      )}

      {/* AFTER POLL ENDS */}
      {hasVoted && (
        <p className="text-center font-semibold text-gray-600 pt-2">
          Wait for the teacher to ask a new question..
        </p>
       )} 
       <button
  onClick={() => setChatOpen(!chatOpen)}
  className="fixed bottom-6 right-6 bg-violet-600 text-white p-4 rounded-full shadow-lg"
>
  💬
</button>
{chatOpen && (
  <div className="fixed bottom-20 right-6 w-80 h-96 bg-white shadow-xl rounded-xl flex flex-col">

    {/* TABS */}
    <div className="flex border-b">
      <button
        onClick={() => setActiveTab("chat")}
        className={`flex-1 p-2 ${activeTab === "chat" ? "border-b-2 border-violet-600 font-semibold" : ""}`}
      >
        Chat
      </button>
      <button
        onClick={() => setActiveTab("participants")}
        className={`flex-1 p-2 ${activeTab === "participants" ? "border-b-2 border-violet-600 font-semibold" : ""}`}
      >
        Participants
      </button>
    </div>

    {/* CONTENT */}
    {activeTab === "chat" ? (
      <>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {messages
  .filter((msg) => msg.message?.trim() !== "")
  .map((msg) => (
    <div key={msg.id} className="text-sm">
      <span className="font-semibold">
        {msg.sender}:
      </span>{" "}
      {msg.message}
    </div>
))}
        </div>

        <div className="p-2 border-t flex gap-2">
          <input
            className="flex-1 border rounded px-2 py-1"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type message..."
          />
          <button
            onClick={sendMessage}
            className="bg-violet-600 text-white px-3 rounded"
          >
            Send
          </button>
        </div>
      </>
    ) : (
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {participants.map((student) => (
          <div key={student.socketId} className="flex justify-between">
            <span>{student.name}</span>
            {/* <button
              onClick={() => socket?.emit("kick_student", student.socketId)}
              className="text-blue-600 text-sm"
            >
              Kick out
            </button> */}
          </div>
        ))}
      </div>
    )}
  </div>
)}
    </div>
  </div>
);
}