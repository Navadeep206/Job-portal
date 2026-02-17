import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import mongoose from 'mongoose';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

export const registerUser = async (req, res, next) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    res.status(400);
    return next(new Error("Please fill all the fields"));
  }
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      return next(new Error("User already exists"));
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      return next(new Error("Invalid user data"));
    }
  } catch (error) {
    next(error);
  }
};


export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    return next(new Error("Please fill all the fields"));
  }
  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      return next(new Error("Invalid email or password"));
    }

  } catch (error) {
    next(error);
  }
}

/* Forgot Password */
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    return next(new Error("Please provide an email"));
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      return next(new Error("User not found"));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    // Use frontend URL here. If backend and frontend are on different ports/domains, use FRONTEND_URL env or hardcode for now.
    // Assuming localhost:5173 for frontend.
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please go to this link to reset your password:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        message,
      });

      res.status(200).json({ success: true, data: "Email sent" });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new Error("Email could not be sent"));
    }

  } catch (error) {
    next(error);
  }
};

/* Reset Password */
export const resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      return next(new Error("Invalid Reset Token"));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      message: "Password Updated Success",
      token: generateToken(user._id),
    });

  } catch (error) {
    next(error);
  }
};