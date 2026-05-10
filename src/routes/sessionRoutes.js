const express = require("express");
const router = express.Router();

const sessionController = require("../controllers/sessionController");
const { authenticateToken } = require("../middleware/authMiddleware");

// POST /api/sessions/
// Protected route for creating a training session. The logged-in user comes from the JWT middleware.
router.post("/", authenticateToken, sessionController.createSession);

// DELETE /api/sessions/:id
// Protected endpoint for deleting one training session owned by the logged-in user
router.delete("/:id", authenticateToken, sessionController.deleteSession);

module.exports = router;