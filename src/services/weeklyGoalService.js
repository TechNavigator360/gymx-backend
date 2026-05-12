const weeklyGoalRepository = require("../repositories/weeklyGoalRepository");

// Returns the weekly goal that belongs to the authenticated user.
const getWeeklyGoalByUserId = async (userId) => {
    return weeklyGoalRepository.findWeeklyGoalByUserId(userId);
};

// Creates a new weekly goal for the authenticated user.
const createWeeklyGoal = async (userId, targetSessions) => {

    // Weekly goals must be positive whole numbers between 1 and 7.
    if (
        !Number.isInteger(targetSessions) || 
        targetSessions < 1 ||
        targetSessions > 7
    ) {
        throw new Error("Target sessions must be an integer between 1 and 7");
    }

    // A user may only have one weekly goal.
    const existingGoal = await weeklyGoalRepository.findWeeklyGoalByUserId(userId); 

    if (existingGoal) {
        throw new Error("Weekly goal already exists");
    }

    return weeklyGoalRepository.createWeeklyGoal(
        userId,
        targetSessions,
    );
};

// Updates the authenticated user's existing weekly goal.
const updateWeeklyGoal = async (userId, targetSessions) => {

    // Weekly goals must be positive whole numbers between 1 and 7.
    if (
        !Number.isInteger(targetSessions) || 
        targetSessions < 1 ||
        targetSessions > 7
    ) {
        throw new Error("Target sessions must be an integer between 1 and 7");
    }
    
    // Weekly goal must exist before it can be updated.
    const existingGoal = await weeklyGoalRepository.findWeeklyGoalByUserId(userId);

    if (!existingGoal) {
        throw new Error("Weekly goal not found");
    }

    return weeklyGoalRepository.updateWeeklyGoal(
        userId,
        targetSessions,
    );
};

module.exports = {
    getWeeklyGoalByUserId,
    createWeeklyGoal,
    updateWeeklyGoal,
};