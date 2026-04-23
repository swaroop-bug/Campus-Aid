require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");


const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");
const quizRoutes = require("./routes/quiz");
const lostFoundRoutes = require("./routes/lostFound");
const passwordRoutes = require("./routes/password");
const chatbotRoutes = require("./routes/chatbot");

const adminRoutes = require("./routes/admin");
const railwayRoutes = require("./routes/railway");
const issueRoutes = require("./routes/issue");
const announcementRoutes = require("./routes/announcements");

const app = express();

connectDB();

app.use(cors({
  origin: ["https://campusaid-somaiya.web.app", "https://campusaid-somaiya.firebaseapp.com", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Health check for Render
app.get("/healthz", (req, res) => res.status(200).send("OK"));

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/lostfound", lostFoundRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/railway", railwayRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api", announcementRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
