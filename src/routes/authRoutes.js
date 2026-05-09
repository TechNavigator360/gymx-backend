const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Public auth endpoint for registering a new user.
router.post("/register", authController.register);

// Public auth eindpoint for logging in an existing user.
router.post("/login", authController.login);

// Protected auth endpoint
// The middleware validates the JWT before the controller is reached.
router.get(
    "/me",
    authMiddleware.authenticateToken,
    authController.getMe
);

module.exports = router;