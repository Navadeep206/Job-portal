import express from "express";

import {
  applyJob,
  getMyApplications,
  getJobApplicants,
  getRecruiterApplicants,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

/* Candidate */
router.post(
  "/apply",
  protect,
  authorizeRoles("user"),
  upload.single("resume"), // Expect 'resume' field
  applyJob
);

router.get(
  "/my",
  protect,
  authorizeRoles("user"),
  getMyApplications
);

/* Recruiter/Admin */
router.get(
  "/job-applicants",
  protect,
  authorizeRoles("recruiter", "admin"),
  getRecruiterApplicants
);

router.get(
  "/job/:jobId",
  protect,
  authorizeRoles("recruiter", "admin"),
  getJobApplicants
);

router.put(
  "/:id/status",
  protect,
  authorizeRoles("recruiter", "admin"),
  updateApplicationStatus
);

export default router;
