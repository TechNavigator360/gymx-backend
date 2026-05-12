const weeklyGoalService = require("../services/weeklyGoalService");

// Returns the authenticated user's current weekly goal.
const getWeeklyGoal = async (req, res) => {
    const userId = req.user.id;

    const weeklyGoal = await weeklyGoalService.getWeeklyGoalByUserId(userId);

    if (!weeklyGoal) {
        return res.status(404).json({
            message: "Weekly goal not found",
        });
    }

    res.status(200).json(weeklyGoal);
};

// Creates a new weekly goal for the authenticated user.
const createWeeklyGoal = async (req, res) => {
    try {
        const userId = req.user.id;
        const { target_sessions } = req.body || {}; 

        const weeklyGoal = await weeklyGoalService.createWeeklyGoal(
            userId,
            target_sessions
        );

        res.status(201).json(weeklyGoal);
    } catch (error) {
        if (error.message === "Target sessions must be an integer between 1 and 7" || 
            error.message === "Weekly goal already exists") {
            return res.status(400).json({ message: error.message });
        }

        res.status(500).json({ message: "Internal server error" });
    }       
};

// Updates the authenticated user's existing weekly goal.
const updateWeeklyGoal = async (req, res) => {
    try {
        const userId = req.user.id;
        const { target_sessions } = req.body || {};

        const weeklyGoal = await weeklyGoalService.updateWeeklyGoal(
            userId, 
            target_sessions
        );

        res.status(200).json(weeklyGoal);
    } catch (error) {

        if (error.message === "Target sessions must be an integer between 1 and 7") {
            return res.status(400).json({ message: error.message });
        }

        if (error.message === "Weekly goal not found") {
            return res.status(404).json({ message: error.message });
        }

        res.status(500).json({ message: "Internal server error" });
    }      
};

module.exports = {
    getWeeklyGoal,
    createWeeklyGoal,
    updateWeeklyGoal,
}