const express = require("express");
const cors = require("cors");

// Import the authentication routes separately to keep the application organized
const authRoutes = require("./routes/authRoutes");

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

module.exports = app;