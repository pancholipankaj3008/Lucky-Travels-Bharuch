// Load environment variables FIRST
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

// Routes AFTER dotenv
const adminRoutes = require("./routes/adminRoutes");
const carRoutes = require("./routes/carRoutes");
const emailRoutes = require("./routes/emailRoutes");

const app = express();

// Middleware
app.use(
  cors({
    origin: (process.env.CLIENT_URL || "http://localhost:5173").split(",").map((url) => url.trim()),
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Home route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Lucky Travels API!",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Lucky Travels Backend is running!",
    database: "Configured",
  });
});

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/email", emailRoutes);

// Start server
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
