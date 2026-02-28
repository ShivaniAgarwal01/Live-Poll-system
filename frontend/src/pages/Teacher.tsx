import React, { useEffect, useState, useRef } from "react";
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
  const [remainingTime, setRemainingTime] = useState<number>(60);
  const [duration, setDuration] = useState(60);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "participants">("chat");
  const [messages, setMessages] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"create" | "live">("create");
  const [newMessage, setNewMessage] = useState("");

  const fetchHistory = async () => {
    const res = await fetch("http://localhost:5000/poll/history");
    const data = await res.json();
    setHistory(data);
    setShowHistory(true);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("vote_update", (poll) => setResults(poll.options));
    socket.on("student_list", (list: Student[]) => setStudents(list));
    socket.on("poll_ended", () => {
      setPollActive(false);
      setRemainingTime(duration);
    });
    socket.on("poll_timer", (data) =>
      setRemainingTime(data.remainingTime)
    );
    socket.on("students_update", (list) => setStudents(list));
    socket.on("chat_history", (history) => setMessages(history));
    socket.on("chat_message", (msg) =>
      setMessages((prev) => [...prev, msg])
    );

    return () => {
      socket.off("vote_update");
      socket.off("poll_ended");
      socket.off("students_update");
      socket.off("poll_timer");
      socket.off("student_list");
      socket.off("chat_history");
      socket.off("chat_message");
    };
  }, [socket, duration]);

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

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    socket?.emit("send_message", {
      sender: "Teacher",
      role: "teacher",
      message: newMessage,
    });
    setNewMessage("");
  };

  const createPoll = async () => {
    if (!question.trim() || options.some((o) => !o.trim())) return;

    const res = await fetch("http://localhost:5000/poll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, options, duration }),
    });

    if (!res.ok) return alert("Failed to create poll");

    const poll = await res.json();

    setActiveQuestion(question);
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

  return (
    <div className="min-h-screen bg-white relative flex items-center justify-center">

      {viewMode === "live" && (
        <button
          onClick={fetchHistory}
          className="absolute top-8 right-10 bg-(--color-primary) hover:bg-(--color-primary-dark) text-white text-sm px-6 py-2 rounded-full shadow-md transition"
        >
          View Poll History
        </button>
      )}

      <div className="w-full max-w-4xl px-6">
        {viewMode === "create" && (
          <CreatePollView
            question={question}
            setQuestion={setQuestion}
            options={options}
            setOptions={setOptions}
            duration={duration}
            setDuration={setDuration}
            createPoll={createPoll}
          />
        )}

        {viewMode === "live" && (
          <LivePollView
            activeQuestion={activeQuestion}
            results={results}
            remainingTime={remainingTime}
            pollActive={pollActive}
            setViewMode={setViewMode}
          />
        )}
      </div>

      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 bg-(--color-primary) text-white w-14 h-14 rounded-full shadow-lg text-xl"
      >
        💬
      </button>

      {chatOpen && (
        <ChatPanel
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          messages={messages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessage={sendMessage}
          students={students}
          socket={socket}
        />
      )}

      {showHistory && (
        <PollHistoryModal history={history} setShowHistory={setShowHistory} />
      )}
    </div>
  );
}


const CreatePollView = React.memo(
  ({
    question,
    setQuestion,
    options,
    setOptions,
    duration,
    setDuration,
    createPoll,
  }: any) => {

    const addOption = () => {
      setOptions([...options, ""]);
    };

    const removeOption = (index: number) => {
      if (options.length <= 2) return;
      const copy = [...options];
      copy.splice(index, 1);
      setOptions(copy);
    };

    return (
      <div className="max-w-4xl mx-auto">

        {/* Badge */}
        <div className="mb-6">
          <span className="bg-(--color-primary) text-white px-4 py-1 rounded-full text-sm font-semibold">
            ✦ Intervue Poll
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl text-(--color-dark) mb-2">
          Let’s <span className="font-bold">Get Started</span>
        </h1>

        <p className="text-(--color-grey) mb-6 max-w-xl">
          You’ll have the ability to create and manage polls, ask questions, and monitor student responses in real-time.
        </p>

        <div className="space-y-2">

          {/* Duration */}
          <div className="flex justify-end">
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="bg-(--color-whitish) px-4 py-2 rounded-md text-sm outline-none"
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
              className="w-full mt-2 bg-(--color-whitish) rounded-lg p-4 outline-none resize-none"
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          {/* Options */}
          <div className="space-y-4">
            <label className="font-semibold text-(--color-dark)">
              Edit Options
            </label>

            {options.map((opt: string, i: number) => (
              <div key={i} className="flex items-center gap-3">

                {/* Option Number */}
                <div className="w-7 h-7 rounded-full bg-(--color-primary) text-white flex items-center justify-center text-sm font-semibold">
                  {i + 1}
                </div>

                {/* Input */}
                <input
                  className="flex-1 bg-(--color-whitish) rounded-lg px-4 py-2 outline-none"
                  value={opt}
                  onChange={(e) => {
                    const copy = [...options];
                    copy[i] = e.target.value;
                    setOptions(copy);
                  }}
                />

                {/* Remove Button */}
                {options.length > 2 && (
                  <button
                    onClick={() => removeOption(i)}
                    className="text-red-500 text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            {/* ADD OPTION BUTTON */}
            <button
              onClick={addOption}
              className="mt-2 text-(--color-primary) font-semibold text-sm border border-(--color-primary) px-4 py-2 rounded-lg transition hover:bg-(--color-primary) hover:text-white"
            >
              + Add More Option
            </button>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              onClick={createPoll}
              className="bg-(--color-primary) hover:bg-(--color-primary-dark) text-white px-8 py-3 rounded-full font-semibold transition"
            >
              Ask Question
            </button>
          </div>
        </div>
      </div>
    );
  }
);

const LivePollView = React.memo(
  ({ activeQuestion, results, remainingTime, pollActive, setViewMode }: any) => {

    const totalVotes = results.reduce(
      (sum: number, r: any) => sum + r.votes,
      0
    );

    return (
      <div className="max-w-3xl mx-auto">

        {/* Top Title */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-semibold text-(--color-dark)">
            Question
          </h2>
        </div>

        {/* Poll Card */}
        <div className="bg-white rounded-xl border border-(--color-primary-light) shadow-sm overflow-hidden">

          {/* Question Header */}
          <div className="bg-(--color-dark) text-white px-6 py-3 font-semibold">
            {activeQuestion}
          </div>

          {/* Results */}
          <div className="p-6 space-y-5">
            {results.map((o: any, index: number) => {
  const percent =
    totalVotes > 0
      ? Math.round((o.votes / totalVotes) * 100)
      : 0;

  return (
    <div key={o.id}>
      <div className="relative w-full h-12 bg-(--color-whitish) rounded-sm overflow-hidden">

        {/* Filled Portion */}
        <div
          className="absolute left-0 top-0 h-12 bg-(--color-primary) transition-all duration-500"
          style={{ width: `${percent}%` }}
        />

        {/* Content Inside Bar */}
        <div className="relative z-10 flex items-center justify-between h-12 px-4 text-sm font-medium">

          {/* Left Side: Number + Text */}
          <div className="flex items-center gap-3">

            {/* Number */}
            <div className="w-7 h-7 rounded-full bg-white text-(--color-primary) flex items-center justify-center text-xs font-bold">
              {index + 1}
            </div>

            {/* Option Text */}
            <span className="text-(--color-dark)">
              {o.text}
            </span>
          </div>

          {/* Percentage */}
          <span className="font-semibold text-(--color-dark)">
            {percent}%
          </span>
        </div>

      </div>
    </div>
  );
})}
            {/* Timer */}
            <div className="text-right mt-4">
              <span className="bg-(--color-primary-light) text-white px-4 py-1 rounded-full text-sm">
                Time Left: {remainingTime}s
              </span>
            </div>
          </div>
        </div>

        {/* Ask New */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => !pollActive && setViewMode("create")}
            disabled={pollActive}
            className={`px-8 py-3 rounded-full text-white transition ${
              pollActive
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-(--color-primary) hover:bg-(--color-primary-dark)"
            }`}
          >
            + Ask a new question
          </button>
        </div>
      </div>
    );
  }
);

const ChatPanel = React.memo(
  ({
    activeTab,
    setActiveTab,
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    students,
    socket
  }: any) => {

    return (
      <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col">

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
              {messages
                .filter((msg: any) => msg.message?.trim() !== "")
                .map((msg: any, index: number) => (
                  <div
                    key={index}
                    className={`flex flex-col ${
                      msg.role === "teacher"
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    <span
                      className={`text-xs mb-1 font-semibold ${
                        msg.role === "teacher"
                          ? "text-(--color-primary)"
                          : "text-(--color-dark)"
                      }`}
                    >
                      {msg.sender}
                    </span>

                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg ${
                        msg.role === "teacher"
                          ? "bg-(--color-primary) text-white"
                          : "bg-(--color-whitish)"
                      }`}
                    >
                      {msg.message}
                    </div>
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
            {students.map((student: any) => (
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
    );
  }
);

const PollHistoryModal = React.memo(
  ({ history, setShowHistory }: any) => {
    return (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

        <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 relative">

          <button
            onClick={() => setShowHistory(false)}
            className="absolute top-4 right-4 text-xl text-(--color-dark)"
          >
            ×
          </button>

          <h2 className="text-2xl font-bold mb-6 text-(--color-dark)">
            Poll History
          </h2>

          {history.map((poll: any, idx: number) => {
            const totalVotes = poll.options.reduce(
              (sum: number, o: any) => sum + o.votes,
              0
            );

            return (
              <div
                key={idx}
                className="mb-8 p-5 bg-(--color-whitish) rounded-xl"
              >
                <h3 className="font-semibold mb-4 text-(--color-dark)">
                  {poll.question}
                </h3>

                {poll.options.map((opt: any) => {
                  const percent =
                    totalVotes > 0
                      ? Math.round((opt.votes / totalVotes) * 100)
                      : 0;

                  return (
                    <div key={opt.id} className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{opt.text}</span>
                        <span className="font-semibold text-(--color-primary)">
                          {percent}%
                        </span>
                      </div>

                      <div className="w-full h-3 bg-white rounded-full overflow-hidden">
                        <div
                          className="h-3 bg-(--color-primary)"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);