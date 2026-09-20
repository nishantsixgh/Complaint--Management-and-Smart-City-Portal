import express from "express";
import {
  createComplaint,
  getComplaintById,
  getMyComplaints,
  trackComplaintById
} from "../controllers/complaintController.js";
import { getComplaintFeedback, submitFeedback } from "../controllers/feedbackController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadComplaintImage } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/track/:trackingId", trackComplaintById);
router.post("/", protect, uploadComplaintImage, createComplaint);
router.get("/my", protect, getMyComplaints);
router.post("/:id/feedback", protect, submitFeedback);
router.get("/:id/feedback", protect, getComplaintFeedback);
router.get("/:id", protect, getComplaintById);

export default router;
