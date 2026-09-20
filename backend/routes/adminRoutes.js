import express from "express";
import {
  assignComplaintToOfficer,
  blockUnblockUser,
  createUserByAdmin,
  deleteComplaint,
  getAllComplaints,
  getAllUsers,
  getCategoryAnalytics,
  getDashboardStats,
  getMonthlyAnalytics,
  getStatusAnalytics,
  updateComplaintStatus
} from "../controllers/adminController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/stats", getDashboardStats);
router.get("/analytics/category", getCategoryAnalytics);
router.get("/analytics/status", getStatusAnalytics);
router.get("/analytics/monthly", getMonthlyAnalytics);
router.get("/complaints", getAllComplaints);
router.put("/complaints/:id/status", updateComplaintStatus);
router.put("/complaints/:id/assign", assignComplaintToOfficer);
router.delete("/complaints/:id", deleteComplaint);
router.post("/users", createUserByAdmin);
router.get("/users", getAllUsers);
router.put("/users/:id/block", blockUnblockUser);

export default router;
