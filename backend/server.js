import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import collegeRoutes from "./routes/collegeRoutes.js"; // adjust if needed
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/colleges", collegeRoutes);
app.use("/api", userRoutes);
app.use("/api/profile", profileRoutes);

// Mock database connection removed
// Default route
app.get("/", (req, res) => res.send("🎓 Career Advisor API is running..."));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
