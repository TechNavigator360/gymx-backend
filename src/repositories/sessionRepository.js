const prisma = require("../config/prisma");

// Repository layer for training session db access. 
// Only this layer talks directly to Prisma.
const createSession = async (sessionData) => {

    
    return await prisma.trainingSession.create({
        data: {
            user_id: sessionData.userId,
            date: new Date(sessionData.date),
        },
    });    
};

const findSessionById = async (sessionId) => {
    return await prisma.trainingSession.findUnique({
        where: {
            id: sessionId,
        },
    });
};

const findSessionsByUserId = async (userId) => {
    return await prisma.trainingSession.findMany({
        where: {
            user_id: userId,
        },
        orderBy: {
            date: "desc",
        },
    });
};

const deleteSessionById = async (sessionId) => {
    return await prisma.trainingSession.delete({
        where: {
            id: sessionId,
        },
    });
};

module.exports = {
    createSession,
    findSessionById,
    findSessionsByUserId,
    deleteSessionById,
};