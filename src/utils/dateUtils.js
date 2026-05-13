// Returns the start and end date of the currrent week.
// Week starts on Monday and ends on Sunday.
const getCurrentWeekRange = () => {
    const now = new Date();

    const currentDay = now.getDay();
    const daysSinceMonday = currentDay === 0 ? 6 : currentDay -1;

    const startDate = new Date(now);
    startDate.setDate(now.getDate() - daysSinceMonday);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    return {
        startDate,
        endDate,
    };
};

module.exports = {
    getCurrentWeekRange,
}