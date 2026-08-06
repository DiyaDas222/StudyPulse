import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dns from "dns";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import topicRoutes from "./routes/topicRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import subTopicRoutes from "./routes/subTopicRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
// Prefer IPv4 over IPv6
dns.setDefaultResultOrder("ipv4first");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/subtopics", subTopicRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to StudyPulse API 🚀",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});