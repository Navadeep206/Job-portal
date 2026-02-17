import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import uploadImage from "../middlewares/imageUpload.js";
import { v2 as cloudinary } from 'cloudinary';


import { toggleSavedJob, getSavedJobs } from "../controllers/userController.js";

// ... existing code ...

const router = express.Router();

router.put("/saved-jobs", protect, toggleSavedJob);
router.get("/saved-jobs", protect, getSavedJobs);

// ... existing profile routes ...
router.get("/profile", protect, (req, res) => {

  res.json(req.user);
});

router.put("/profile", protect, uploadImage.single("avatar"), async (req, res) => {
  const user = await import("../models/User.js").then(m => m.default.findById(req.user._id));

  if (user) {
    user.name = req.body.name || user.name;

    if (req.body.password) {
      user.password = req.body.password;
    }

    if (req.file) {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const logFile = path.resolve('upload_debug.txt');
        const log = (msg) => fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);

        log(`Processing file: ${req.file.path}`);

        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "avatars",
          width: 150,
          crop: "scale"
        });

        log(`Cloudinary success: ${result.secure_url}`);
        user.avatar = result.secure_url;
      } catch (error) {
        console.error("Image upload failed", error);
        try {
          const fs = await import('fs');
          const path = await import('path');
          const logFile = path.resolve('upload_debug.txt');
          fs.appendFileSync(logFile, `[${new Date().toISOString()}] ERROR: ${error.message}\n${JSON.stringify(error, null, 2)}\n`);
        } catch (e) { console.error("Logging failed", e); }
      }
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      token: req.headers.authorization.split(" ")[1]
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export default router;
