// Service layer for training session business logic.
// This layer will later handle validation,
// ownership rules and session-related logic.

const createSession = async (userId, sessionData) => {
    return {
        message: "Session servide not implemented yet",
        userId, 
        sessionData,
    };
};

module.exports = {
    createSession,
};