import express from "express";

import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { getMyJobs } from "../controllers/jobController.js";


const router = express.Router();

/* Public */
router.get("/", getJobs);
router.get(
  "/my",
  protect,
  authorizeRoles("recruiter", "admin"),
  getMyJobs
);

router.get("/:id", getJobById);

/* Recruiter/Admin */
router.post(
  "/",
  protect,
  authorizeRoles("recruiter", "admin"),
  createJob
);

router.put(
  "/:id",
  protect,
  authorizeRoles("recruiter", "admin"),
  updateJob
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("recruiter", "admin"),
  deleteJob
);

export default router;
