import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import uploadImage from "../middlewares/imageUpload.js";
import { v2 as cloudinary } from 'cloudinary';


import { toggleSavedJob, getSavedJobs } from "../controllers/userController.js";

// ... existing code ...

const router = express.Router();

router.put("/saved-jobs", protect, toggleSavedJob);
router.get("/saved-jobs", protect, getSavedJobs);

// Alert Routes
import { createAlert, getMyAlerts, deleteAlert } from "../controllers/alertController.js";
router.post("/alerts", protect, createAlert);
router.get("/alerts", protect, getMyAlerts);
router.delete("/alerts/:id", protect, deleteAlert);

// ... existing profile routes ...
router.get("/profile", protect, (req, res) => {

  res.json(req.user);
});

// Use fields for multiple file uploads
router.put("/profile", protect, uploadImage.fields([{ name: 'avatar', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), async (req, res) => {
  const user = await import("../models/User.js").then(m => m.default.findById(req.user._id));

  if (user) {
    user.name = req.body.name || user.name;
    user.title = req.body.title || user.title;
    user.bio = req.body.bio || user.bio;
    user.location = req.body.location || user.location;

    // Parse skills if sent as string (from FormData)
    if (req.body.skills) {
      try {
        user.skills = JSON.parse(req.body.skills);
      } catch (e) {
        user.skills = req.body.skills.split(',').map(skill => skill.trim());
      }
    }

    // Parse experience if sent as string
    if (req.body.experience) {
      try {
        user.experience = JSON.parse(req.body.experience);
      } catch (e) {
        console.error("Failed to parse experience JSON", e);
      }
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const files = req.files || {};
    const fs = await import('fs');
    const path = await import('path');

    // Helper to upload file
    const uploadToCloudinary = async (filePath, folder, resourceType = "image") => {
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: folder,
          resource_type: resourceType,
          // user_filename: true, // optional: keep original filename
        });
        return result.secure_url;
      } catch (error) {
        console.error(`Upload failed for ${filePath}:`, error);
        throw error;
      }
    };

    // Handle Avatar
    if (files.avatar && files.avatar[0]) {
      user.avatar = await uploadToCloudinary(files.avatar[0].path, "avatars");
    }

    // Handle Resume
    if (files.resume && files.resume[0]) {
      // Use "auto" or "raw" for PDF
      user.resume = await uploadToCloudinary(files.resume[0].path, "resumes", "auto");
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      title: updatedUser.title,
      bio: updatedUser.bio,
      location: updatedUser.location,
      skills: updatedUser.skills,
      resume: updatedUser.resume,
      experience: updatedUser.experience,
      token: req.headers.authorization.split(" ")[1]
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export default router;
