const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");

const app = express();

// Allow the backend API to receive requests from other applications or frontends
app.use(cors()); 

// Automatically convert incoming JSON request bodies into JavaScript objects
app.use(express.json());

// Simple endpoint used to check if the backend server is running correctly
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "GYMX backend is running"
    });
});

// All authentication-related endpoints will start with /api/auth
app.use("/api/auth", authRoutes);

// All session-related endpoints begin with /api/sessions
app.use("/api/sessions", sessionRoutes);

module.exports = app;