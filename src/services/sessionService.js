const sessionRepository = require("../repositories/sessionRepository");

// Service layer for training session business logic.
// This layer will later handle validation, ownership rules and session-related logic.

const createSession = async (userId, sessionData) => {

    // Combine authenticated user id with incoming session data.
    const newSession = {
        userId,
        ...sessionData,
    };

    return await sessionRepository.createSession(newSession);
};

module.exports = {
    createSession,
};