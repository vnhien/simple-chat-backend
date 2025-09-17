import dotenv from "dotenv";
// Load environment variables
dotenv.config();
import cors from "cors";
import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import http from "node:http";
import mongoose from "mongoose";
import { initSocketServices } from "./sockets";
import { globalStorage } from "./models/GlobalStorage";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import { subscribeToNotification } from "./controllers/subscription.controllers";

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Connect to MongoDB
const MONGODB_URI = process.env.MONGO_DB_CONNECT_STRING || "mongodb://localhost:27017/chat-backend";
mongoose
  .connect(MONGODB_URI, {
    dbName: "simple-chat",
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
  });

initSocketServices(server);
// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());

// Root route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from Express + TypeScript 👋" });
});

// Example API route
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Auth routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
// Aubsctibe to notification
app.post("/chat/subscribe", subscribeToNotification);

// Start server
server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
