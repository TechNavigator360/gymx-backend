const sessionService = require("../services/sessionService");

const createSession = async (req, res) => {

    try {
        
        // User identity comes from the JWT middleware.
        const userId = req.user.id;

        // Request body contains session input data.
        const sessionData = req.body;

        const result = await sessionService.createSession(
        userId, 
        sessionData
        );

        res.status(201).json(result);
    }
    catch (error) {

        res.status(400).json({
            message: error.message,
        });
    }
};

const getSessions = async (req, res) => {
    try {
        const userId = req.user.id;

        const sessions = await sessionService.getSessions(userId);

        res.status(200).json(sessions);
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong while retrieving training sessions",
        });
    }
};

const getSessionById = async (req, res) => {
    res.status(501).json({
        message: "Get training session endpoint not implemented yet"
    });
};

const deleteSession = async (req, res) => {
    try {
        // Get session id from route parameter
        const sessionId = parseInt(req.params.id);

        // Validate session id
        if (isNaN(sessionId)) {
            return res.status(400).json({
                message: "Invalid session id",
            });
        }

        // Logged-in user id from JWT middleware
        const userId = req.user.id;

        // Delegate business logic to service layer
        await sessionService.deleteSession(sessionId, userId);

        // Successful deletion returns 204 with no response body
        res.status(204).send();
    }
    catch (error) {

        // Session does not exist
        if (error.message == "SESSION_NOT_FOUND") {
            return res.status(404).json({
                message: "Training session not found",
            });
        }

        // Session belongs to another user
        if (error.message === "FORBIDDEN") {
            return res.status(403).json({
                message: "You are not allowed to delete this training session",
            });
        }

        // Generic server error
        res.status(500).json({
            message: "Something went wrong while deleting the training session",
        });
    }

};

module.exports = {
    createSession,
    getSessions,
    getSessionById,
    deleteSession,
};