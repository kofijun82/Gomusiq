import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import { createServer } from "http";

import { initializeSocket } from "./socket.js";
import { connectDB } from "./lib/db.js";

import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";
import paymentRoutes from "./routes/payment.route.js"; // Added payment route

dotenv.config();

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 5000; // Added default PORT fallback

const httpServer = createServer(app);
initializeSocket(httpServer);

// CORS middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Update with your frontend URL in production
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json());
app.use(clerkMiddleware()); // Middleware for authentication

// File upload middleware
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB maximum file size
    },
  })
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/payment", paymentRoutes); // Payment route

// Error handler middleware
app.use((err, req, res, next) => {
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// Webhook placeholder for Paystack
app.post("/api/payment/webhook", express.raw({ type: "application/json" }), (req, res) => {
  // TODO: Add webhook handling logic
  console.log("Webhook event received:", req.body);
  res.status(200).send("Webhook received");
});

// Start server
httpServer.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
  connectDB();
});
