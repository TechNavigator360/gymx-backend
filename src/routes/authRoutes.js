const express = require("express");
const router = express.Router();

// Import the controller that handles authentication requests
const authController = require("../controllers/authController");

// Public auth endpoint for registering a new user.
router.post("/register", authController.register);

// Public auth eindpoint for logging in an existing user.
router.post("/login", authController.login);

module.exports = router;