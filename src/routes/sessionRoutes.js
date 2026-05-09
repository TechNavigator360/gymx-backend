const express = require("express");
const router = express.Router();

const sessionController = require("../controllers/sessionController");
const { authenticateToken } = require("../middleware/authMiddleware");

// Protected route for creating a training session.
// The logged-in user comes from the JWT middleware.
router.post("/", authenticateToken, sessionController.createSession);

module.exports = router;