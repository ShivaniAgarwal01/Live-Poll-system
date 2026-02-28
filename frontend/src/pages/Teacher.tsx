import { useEffect, useState ,useRef } from "react";
import { useSocket } from "../hooks/useSocket";

interface ResultOption {
  id: string;
  text: string;
  votes: number;
}

type Student = {
  socketId: string;
  studentId: string;
  name: string;
};

export default function Teacher() {
  const socket = useSocket();
  const joinedRef = useRef(false);

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [results, setResults] = useState<ResultOption[]>([]);
  const [pollActive, setPollActive] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState("");
  // Timer state for teacher
  const [remainingTime, setRemainingTime] = useState<number>(60);
  // Poll history modal state
  const [duration, setDuration] = useState(60);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
const [students, setStudents] = useState<Student[]>([]);
const [showChat, setShowChat] = useState(false);
const [chatOpen, setChatOpen] = useState(false);
const [activeTab, setActiveTab] = useState<"chat" | "participants">("chat");
const [messages, setMessages] = useState<any[]>([]);
const [viewMode, setViewMode] = useState<"create" | "live">("create");
const [newMessage, setNewMessage] = useState("");
  // Fetch poll history
  const fetchHistory = async () => {
    const res = await fetch("http://localhost:5000/poll/history");
    const data = await res.json();
    setHistory(data);
    setShowHistory(true);
  };

  

  /* ================= SOCKET LISTENERS ================= */

  useEffect(() => {
    if (!socket) return;

    socket.on("vote_update", (poll) => {
      setResults(poll.options);
    });
    socket.on("student_list", (list: Student[]) => {
  setStudents(list);
});
    socket.on("poll_ended", () => {
      setPollActive(false);
      setRemainingTime(duration);
    });

    socket.on("poll_timer", (data) => {
      setRemainingTime(data.remainingTime);
    });

     socket.on("students_update", (list) => {
    setStudents(list); // list = [ [socketId, name] ]
  });
  socket?.on("chat_history", (history) => {
  setMessages(history);
});

socket?.on("chat_message", (msg) => {
  setMessages((prev) => [...prev, msg]);
});

    return () => {
      socket.off("vote_update");
      socket.off("poll_ended");
          socket.off("students_update");
      socket.off("poll_timer");
      socket.off("student_list");
      socket.off("chat_history");
      socket.off("chat_message");
      // socket.off("kicked");
    };
  }, [socket]);

  /* ================= CHECK ACTIVE POLL ON REFRESH ================= */

  useEffect(() => {
    fetch("http://localhost:5000/poll/current")
      .then((res) => res.json())
      .then((data) => {
        if (data?.poll) {
          setPollActive(true);
          setActiveQuestion(data.poll.question);
          setResults(data.poll.options);
          setRemainingTime(data.poll.remainingTime);
        }
      });
  }, []);

  const kickStudent = (socketId: string) => {
  socket?.emit("kick_student", socketId);
};


const sendMessage = () => {
  if (!newMessage.trim()) return;

  socket?.emit("send_message", {
    sender: "Teacher",
    role: "teacher",
    message: newMessage,
  });

  setNewMessage("");
};
  /* ================= CREATE POLL ================= */


  const createPoll = async () => {
    if (!question.trim() || options.some((o) => !o.trim())) return;

    const res = await fetch("http://localhost:5000/poll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        options,
        duration,
      }),
    });

    if (!res.ok) {
      alert("Failed to create poll");
      return;
    }

    const poll = await res.json();
     setActiveQuestion(question);

    // 🔥 INITIALIZE RESULTS IMMEDIATELY
    setResults(
      poll.options.map((o: any) => ({
        id: o.id,
        text: o.text,
        votes: 0,
      }))
    );

    setPollActive(true);
    setViewMode("live");
    setQuestion("");
    setOptions(["", ""]);
  };

  /* ================= UI ================= */

return (
  <div className="min-h-screen bg-(--color-whitish) flex justify-center px-6 py-10 relative">

    <div className="w-full max-w-4xl">
      {/* HEADER BADGE */}
      <div className="mb-6 flex items-start">
        <span className="bg-(--color-primary) text-white text-sm px-4 py-1 rounded-full font-semibold">
          ✦ Intervue Poll
        </span>
      </div>
      {/* Poll History Button */}
<div className="flex justify-end mb-4">
  <button
    onClick={fetchHistory}
    className="bg-(--color-primary) hover:bg-(--color-primary-dark) text-white text-sm px-5 py-2 rounded-full font-semibold transition"
  >
    View Poll History
  </button>
</div>

      {/* TITLE */}
      <h1 className="text-3xl  text-(--color-dark) mb-2">
        Let’s <span className="font-bold">Get Started</span>
      </h1>

      <p className="text-(--color-dark-light) mb-3 max-w-xl">
        You’ll have the ability to create and manage polls, ask questions,
        and monitor your students' responses in real-time.
      </p>

      {/* CREATE POLL CARD */}
      <div className="bg-(--color-whitish) rounded-xl space-y-2 ">
    {/* div */}
        {/* Duration */}
        <div className="flex justify-end">
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="bg-(--color-dark-light)/10 px-4 py-2 rounded-md text-sm outline-none"
          >
            <option value={30}>30 seconds</option>
            <option value={45}>45 seconds</option>
            <option value={60}>60 seconds</option>
            <option value={90}>90 seconds</option>
          </select>
        </div>

        {/* Question */}
        <div>
          <label className="font-bold text-(--color-dark)">
            Enter your question
          </label>
          <textarea
            className="w-full mt-2 bg-(--color-dark-light)/10 rounded-lg p-4 outline-none resize-none"
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          
        </div>

        {/* Options */}
        <div className="space-y-4 ">
          <label className="font-semibold text-(--color-dark)">
            Edit Options
          </label>

          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-3 mt-3 mb-4">
              <div className="w-6 h-6 rounded-full bg-(--color-primary) text-white flex items-center justify-center text-sm">
                {i + 1}
              </div>
              <input
                className="flex-1 bg-(--color-dark-light)/10 rounded-lg px-4 py-2 outline-none"
                value={opt}
                onChange={(e) => {
                  const copy = [...options];
                  copy[i] = e.target.value;
                  setOptions(copy);
                }}
              />
            </div>
          ))}

          <button
            onClick={() => setOptions([...options, ""])}
            className="text-(--color-primary) text-sm font-medium border border-(--color-primary) px-4 py-2 rounded-sm transition hover:bg-(--color-primary) hover:text-white"
          >
            + Add More option
          </button>
        </div>

        {/* Timer */}
        {/* <div>
          <span className="text-sm bg-(--color-primary-light) text-white px-4 py-1 rounded-full">
            {pollActive ? `Time Left: ${remainingTime}s` : `${duration} seconds`}
          </span>
        </div> */}

        {/* Submit */}
        <div className="flex justify-end">
          <button
            onClick={createPoll}
            disabled={pollActive}
            className="bg-(--color-primary) hover:bg-(--color-primary-dark) text-white px-8 py-3 rounded-full font-semibold transition disabled:opacity-50"
          >
            {pollActive ? "Poll Running..." : "Ask Question"}
          </button>
        </div>
      </div>

      {/* LIVE RESULTS */}
      {/* {results.length > 0 && (
        <div className="mt-10 bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="font-semibold text-(--color-dark) mb-4">
            {activeQuestion}
          </h3>

          <div className="space-y-4">
            {results.map((o) => {
              const totalVotes = results.reduce(
                (sum, r) => sum + r.votes,
                0
              );
              const percent =
                totalVotes > 0
                  ? Math.round((o.votes / totalVotes) * 100)
                  : 0;

              return (
                <div key={o.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-(--color-dark)">
                      {o.text}
                    </span>
                    <span className="text-(--color-primary) font-semibold">
                      {percent}%
                    </span>
                  </div>

                  <div className="w-full h-4 bg-(--color-whitish) rounded-full overflow-hidden">
                    <div
                      className="h-4 bg-(--color-primary)"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div> */}
    {viewMode === "live" && (
      <div className="max-w-3xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-semibold text-(--color-dark)">
            Question
          </h2>

          <button
            onClick={fetchHistory}
            className="bg-(--color-primary) text-white text-sm px-5 py-2 rounded-full"
          >
            View Poll History
          </button>
        </div>

        {/* Poll Card */}
        <div className="bg-white rounded-xl border border-(--color-primary-light) shadow-sm overflow-hidden">

          <div className="bg-(--color-dark) text-white px-6 py-3 font-semibold">
            {activeQuestion}
          </div>

          <div className="p-6 space-y-4">
            {results.map((o, index) => {
              const totalVotes = results.reduce(
                (sum, r) => sum + r.votes,
                0
              );
              const percent =
                totalVotes > 0
                  ? Math.round((o.votes / totalVotes) * 100)
                  : 0;

              return (
                <div key={o.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-(--color-dark)">
                      {o.text}
                    </span>
                    <span className="text-(--color-primary) font-semibold">
                      {percent}%
                    </span>
                  </div>

                  <div className="w-full h-5 bg-(--color-whitish) rounded-full overflow-hidden">
                    <div
                      className="h-5 bg-(--color-primary)"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ask New */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setViewMode("create")}
            className="bg-(--color-primary) hover:bg-(--color-primary-dark) text-white px-8 py-3 rounded-full"
          >
            + Ask a new question
          </button>
        </div>
      </div>
    )}

    {/* CHAT BUTTON */}
    <button
      onClick={() => setChatOpen(!chatOpen)}
      className="fixed bottom-6 right-6 bg-(--color-primary) text-white w-14 h-14 rounded-full shadow-lg text-xl"
    >
      💬
    </button>

    {/* CHAT PANEL */}
    {chatOpen && (
      <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col">

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 p-3 text-sm ${
              activeTab === "chat"
                ? "border-b-2 border-(--color-primary) font-semibold"
                : ""
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab("participants")}
            className={`flex-1 p-3 text-sm ${
              activeTab === "participants"
                ? "border-b-2 border-(--color-primary) font-semibold"
                : ""
            }`}
          >
            Participants
          </button>
        </div>

        {activeTab === "chat" ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    msg.role === "teacher"
                      ? "bg-(--color-primary) text-white ml-auto"
                      : "bg-(--color-whitish)"
                  }`}
                >
                  {msg.message}
                </div>
              ))}
            </div>

            <div className="border-t p-3 flex gap-2">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type message..."
                className="flex-1 bg-(--color-whitish) rounded-lg px-3 py-2 outline-none"
              />
              <button
                onClick={sendMessage}
                className="bg-(--color-primary) text-white px-4 rounded-lg"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
            {students.map((student) => (
              <div
                key={student.socketId}
                className="flex justify-between items-center"
              >
                <span className="text-(--color-dark)">
                  {student.name}
                </span>
                <button
                  onClick={() =>
                    socket?.emit("kick_student", student.socketId)
                  }
                  className="text-(--color-primary) text-sm"
                >
                  Kick out
                </button>
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
