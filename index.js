import express from "express";
import cookieParser from "cookie-parser";
const app = express();
import { connectDB } from "./database/db.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import userRoutes from "./routes/userRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import postRoutes from "./routes/postsRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import verifyToken from "./middleware/verifyToken.js";

app.use(express.json());
app.use(cookieParser());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/user", verifyToken, userRoutes);
app.use("/api/post", verifyToken, postRoutes);
app.use("/api/comment", verifyToken, commentRoutes);
app.use("/api/story", verifyToken, storyRoutes);
app.use("/api/conversation", verifyToken, conversationRoutes);
app.use("/api/message", verifyToken, messageRoutes);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("app is running");
});
