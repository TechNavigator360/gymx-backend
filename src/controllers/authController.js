const authService = require("../services/authService");

// Controller function for handling user registration requests
const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await authService.registerUser(email, password);

        return res.status(201).json({
            message: "User registered successfully",
            user,
        });
    } catch (error) {
        return res.status(error.statusCode || 501).json({
            message: error.message || "Something went wrong",
        });
    }
};

module.exports = {
    register,
};