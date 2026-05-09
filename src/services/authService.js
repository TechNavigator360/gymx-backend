const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository");
const jwt = require("jsonwebtoken");

const SALT_ROUNDS = 10;

// The service layer contains business and security logic.
// The controller should only handle HTTP, while the service decides
// what is allowed and how registration should be processed.
const registerUser = async (email, password) => {
    if (!email || !password) {
        const error = new Error("Email and password are required");
        error.statusCode = 400;
        throw error;
    }

    const existingUser = await userRepository.findUserByEmail(email);

    if (existingUser) {
        const error = new Error("Email is already in use");
        error.statusCode = 400;
        throw error;
    }

    // Passwords must never be stored as plain text.
    // bcrypt turns the password into a secure hash before saving it.
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const createdUser = await userRepository.createUser(email, passwordHash);

    // Only return safe user data.
    // Never return the password hash to the client.
    return createdUser;

};

// Handles login and authentication logic.
// The service validates credentials and generates a JWT token.
const loginUser = async (email, password) => {
    if (!email || !password) {
        const error = new Error("Email and password are required");
        error.statusCode = 400;
        throw error; 
    }

    const user = await userRepository.findUserWithPasswordByEmail(email);

    // Do not reveal whether the email or password was incorrect.
    // This prevenst leaking authentication details to attackers.
    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const passwordMatch = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordMatch) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    // JWT contains the authenticated user identity.
    // The token can later be used to access protected endpoints. 
    const token = jwt.sign(
        {
            userId: user.id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h",
        }
    );

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
        },
    };
};

module.exports = {
    registerUser,
    loginUser,
};