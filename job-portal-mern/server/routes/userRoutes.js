import express from "express";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

router.put("/profile", protect, async (req, res) => {
  const user = await import("../models/User.js").then(m => m.default.findById(req.user._id));

  if (user) {
    user.name = req.body.name || user.name;
    // user.email = req.body.email || user.email; // Email usually not updatable
    if (req.body.password) {
      user.password = req.body.password;
    }

    // Add other fields if schema supports them (e.g. location, title)
    // For now just name and password

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: req.headers.authorization.split(" ")[1] // Return same token? Or generate new one? client usually handles token.
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export default router;
