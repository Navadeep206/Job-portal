import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
const router = express.Router();


// Register User Route
router.post("/register", registerUser);

// Login User Route
router.post("/login", loginUser);

export default router;

