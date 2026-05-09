const sessionService = require("../services/sessionService");

const createSession = async (req, res) => {

    // User identity comes from the JWT middleware.
    const userId = req.user.id;

    // Request body contains session input data.
    const sessionData = req.body;

    const result = await sessionService.createSession(
        userId, 
        sessionData
    );

    res.status(501).json(result);
};

module.exports = {
    createSession,
};