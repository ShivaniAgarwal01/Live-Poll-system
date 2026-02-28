# 🗳️ Real-Time Classroom Polling System

Live-Poll System is a real-time classroom polling application that allows teachers to create live polls and students to vote instantly. The system includes live vote updates, countdown timers, chat functionality, participant management, and poll history.

---

## 📌 Overview

This project enables interactive classroom engagement using WebSockets for real-time communication. Teachers can create timed polls and monitor responses live, while students can vote and participate in chat.

---

## 🚀 Features

### 👩‍🏫 Teacher Features
- Create polls with multiple options
- Select poll duration (30 / 45 / 60 / 90 seconds)
- View live vote percentages
- Real-time countdown timer
- Prevent new poll creation while one is active
- View poll history
- Live chat with students
- View participant list
- Kick out students

### 👨‍🎓 Student Features
- Join with name
- Vote in live polls
- See real-time results
- View countdown timer
- Participate in chat
- View participants
- Receive kicked screen if removed

---

## 🏗️ Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Socket.io Client

### Backend
- Node.js
- Express.js
- Socket.io
- REST APIs
-MongoDB
---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/live-Poll-system.git
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs at:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at:

```
http://localhost:5173
```

---

## 🔌 Socket Events

### Teacher → Server
- `create_poll`
- `kick_student`
- `send_message`

### Student → Server
- `join`
- `vote`
- `send_message`

### Server → Clients
- `vote_update`
- `poll_timer`
- `poll_ended`
- `student_list`
- `chat_message`
- `chat_history`
- `kicked`

---

## ⏱ Poll Timer Logic

- Teacher selects duration before poll creation.
- Server controls countdown timer.
- Remaining time broadcast using `poll_timer`.
- When timer reaches 0:
  - Poll ends
  - `poll_ended` emitted
  - Teacher can create new poll

---

## 💬 Chat Message Format

```ts
{
  sender: string;
  role: "teacher" | "student";
  message: string;
}
```

- Sender name appears above message
- Teacher messages aligned right
- Student messages aligned left

---

## 📊 Vote Percentage Calculation

```js
const percentage = (optionVotes / totalVotes) * 100;
```

Results update in real-time using `vote_update`.

---

---

## 🔄 Application Flow

1. Teacher creates poll.
2. Server stores poll and starts timer.
3. Students vote.
4. Live updates broadcast to all clients.
5. Timer ends → poll closes.
6. Poll saved in history.
7. Teacher can start new poll.

---

## ✨ Future Improvements

- Authentication system
- Room-based classrooms
- MongoDB integration
- Export poll results as CSV
- Chat timestamps
- Deployment to cloud platforms

---

## 📜 License

This project is built for educational and assessment purposes.
