const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository");

const SALT_ROUNDS = 10;

// The service layer contains business and security logic.
// The controller should only handle HTTP, while the service decides
// what is allowed and how registration should be processed.
const registerUser = async (email, password) => {
    if (!email || !password) {
        const error = new Error("Email and password are required");
        error.statusCode = 400;
        throw error;
    };

    const existingUser = await userRepository.findUserByEmail(email);

    if (existingUser) {
        const error = new Error("Email is already in use");
        error.statusCode = 400;
        throw error;
    };

    // Passwords must never be stored as plain text.
    // bcrypt turns the password into a secure hash before saving it.
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const createdUser = await userRepository.createUser(email, passwordHash);

    // Only return safe user data.
    // Never return the password hash to the client.
    return createdUser;
};

module.exports = {
    registerUser,
};