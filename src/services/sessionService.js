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

const getSessions = async (userId, week) => {
    if (week && week !== "current") {
        throw new Error("INVALID_WEEK_FILTER");
    }

    let startDate = null;
    let endDate = null;

    if (week === "current") {
        const now = new Date();

        const currentDay = now.getDay();
        const daysSinceMonday = currentDay === 0 ? 6 : currentDay -1;

        startDate = new Date(now);
        startDate.setDate(now.getDate() - daysSinceMonday);
        startDate.setHours(0, 0, 0, 0);

        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
    }

    return await sessionRepository.findSessionsByUserId(
        userId,
        startDate,
        endDate
    );
};

const getSessionById = async (sessionId, userId) => {
    const session = await sessionRepository.findSessionById(sessionId);

    if (!session) {
        throw new Error("SESSION_NOT_FOUND");
    }

    // Users may only access their own training sessions
    if (session.user_id !== userId) {
        throw new Error("FORBIDDEN");
    }

    return session;
}

const deleteSession = async (sessionId, userId) => {
    // Check if the training session exists
    const session = await sessionRepository.findSessionById(sessionId);

    if (!session) {
        throw new Error("SESSION_NOT_FOUND");
    }

    // Enforce ownership: users may only delete their own sessions
    if (session.user_id !== userId) {
        throw new Error("FORBIDDEN");
    }

    // Delete only after existance and ownership are confirmed
    await sessionRepository.deleteSessionById(sessionId);
};

module.exports = {
    createSession,
    getSessions,
    getSessionById,
    deleteSession,
};