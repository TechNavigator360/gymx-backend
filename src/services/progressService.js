const sessionRepository = require("../repositories/sessionRepository");
const weeklyGoalRepository = require("../repositories/weeklyGoalRepository");
const { getCurrentWeekRange, formatDateOnly } = require("../utils/dateUtils");

// Calculates the authenticated user's progress for the current week.
const getCurrentWeekProgress = async (userId) => {
    const { startDate, endDate } = getCurrentWeekRange();

    const weeklyGoal = await weeklyGoalRepository.findWeeklyGoalByUserId(userId);

    if (!weeklyGoal) {
        throw new Error("WEEKLY_GOAL_NOT_FOUND");
    }

    const sessions = await sessionRepository.findSessionsByUserId(
        userId,
        startDate,
        endDate,
    );

    const completedSessions = sessions.length;
    const weeklyGoalTarget = weeklyGoal.target_sessions;
    const remainingSessions = Math.max(weeklyGoalTarget - completedSessions, 0);
    const formattedWeekStart = formatDateOnly(startDate);
    const formattedWeekEnd = formatDateOnly(endDate);

    return {
        completedSessions,
        weeklyGoal: weeklyGoalTarget,
        remainingSessions, 
        weekStart: formattedWeekStart,
        weekEnd: formattedWeekEnd,
    };
};

module.exports = {
    getCurrentWeekProgress,
}