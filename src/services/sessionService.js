const sessionRepository = require("../repositories/sessionRepository");
const { getCurrentWeekRange } = require("../utils/dateUtils");
const { AppError } = require("../utils/appError");
const { ERROR_CODES } = require("../utils/errorCodes");

// Service layer for training session business logic.
// This layer will later handle validation, ownership rules and session-related logic.

const createSession = async (userId, sessionData) => {

    // Date is required.
    if (!sessionData.date) {
        throw new AppError(ERROR_CODES.VALIDATION.INVALID_DATE);
    }

    // Validate date format.
    const parseDate = new Date(sessionData.date);

    if (isNaN(parseDate.getTime())) {
        throw new AppError(ERROR_CODES.VALIDATION.INVALID_DATE);
    }

    const newSession = {
        userId,
        date: parseDate,
    };

    return await sessionRepository.createSession(newSession);
};

const getSessions = async (userId, week) => {
    const weekFilter = week?.trim().toLowerCase();

    if (weekFilter && weekFilter !== "current") {
        throw new AppError(ERROR_CODES.VALIDATION.INVALID_WEEK_FILTER);
    }
    
    let startDate = null;
    let endDate = null;

    if (weekFilter === "current") {
        const currentWeekRange = getCurrentWeekRange();

        startDate = currentWeekRange.startDate;
        endDate = currentWeekRange.endDate;
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
        throw new AppError(ERROR_CODES.RESOURCE.SESSION_NOT_FOUND);
    }

    // Users may only access their own training sessions
    if (session.user_id !== userId) {
        throw new AppError(ERROR_CODES.AUTHORIZATION.FORBIDDEN);
    }

    return session;
}

const deleteSession = async (sessionId, userId) => {
    // Check if the training session exists
    const session = await sessionRepository.findSessionById(sessionId);

    if (!session) {
        throw new AppError(ERROR_CODES.RESOURCE.SESSION_NOT_FOUND);
    }

    // Enforce ownership: users may only delete their own sessions
    if (session.user_id !== userId) {
        throw new AppError(ERROR_CODES.AUTHORIZATION.FORBIDDEN);
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