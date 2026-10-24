const userModel = require("../models/user.model.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
const { sendRegistrationEmail } = require("../services/email.service.js");
const jwt = require("jsonwebtoken");

// Register user
module.exports.registerUser = asyncHandler(async (req, res) => {
    const { email, name, password } = req.body;

    const isExists = await userModel.findOne({
        email,
    });
    if (isExists) {
        return res.status(422).json({
            message: "user already exists",
            status: "failed",
        });
    }

    const user = await userModel.create({
        email,
        name,
        password,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "3d",
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3d → milliseconds
    });

    res.status(201).json({
        message: "user registerd successfully",
        user,
        token,
    });

    await sendRegistrationEmail(user.email, user.name);
});

// Login user
module.exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");
    const isMatchPassword = await user.comparePassword(password);

    if (!user || !isMatchPassword) {
        return res.status(401).json({
            message: "invalid credentials",
        });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "3d",
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
        message: "logged in successfully",
        user,
        token,
    });
});
