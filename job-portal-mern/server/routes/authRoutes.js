import express from "express";
import { registerUser, loginUser, forgotPassword, resetPassword } from "../controllers/authController.js";
const router = express.Router();


// Register User Route
router.post("/register", registerUser);

// Login User Route
router.post("/login", loginUser);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.put("/reset-password/:resetToken", resetPassword);

export default router;

