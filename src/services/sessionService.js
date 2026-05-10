const sessionRepository = require("../repositories/sessionRepository");

// Service layer for training session business logic.
// This layer will later handle validation, ownership rules and session-related logic.

const createSession = async (userId, sessionData) => {

    // Date is required.
    if (!sessionData.date) {
        throw new Error("Training session date is required");
    }

    // Validate date format.
    const parseDate = new Date(sessionData.date);

    if (isNaN(parseDate.getTime())) {
        throw new Error("Invalid training sessions date");
    }

    const newSession = {
        userId,
        date: parseDate,
    };

    return await sessionRepository.createSession(newSession);
};

module.exports = {
    createSession,
};