const express = require("express");
const router = express.Router();

// Import the controller that handles authentication requests
const authController = require("../controllers/authController");

// Route for registering a new user account
router.post("/register", authController.register);

module.exports = router;