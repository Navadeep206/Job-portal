import express from "express";
const router = express.Router();
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { getAllUsers, deleteUser, getStats, jobAnalytics } from "../controllers/adminController.js";

router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.delete("/users/:id", protect, authorizeRoles("admin"), deleteUser);
router.get(
  "/stats",
  protect,
  authorizeRoles("admin"),
  getStats
);
router.get(
  "/analytics/jobs",
  protect,
  authorizeRoles("admin"),
  jobAnalytics
);

export default router;