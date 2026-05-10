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

module.exports = {
    createSession,
};