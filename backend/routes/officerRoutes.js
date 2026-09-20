import express from "express";
import {
  addOfficerRemark,
  getAssignedComplaints,
  getOfficerComplaintDetails,
  updateOfficerComplaintStatus
} from "../controllers/officerController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("officer"));

router.get("/complaints", getAssignedComplaints);
router.get("/complaints/:id", getOfficerComplaintDetails);
router.put("/complaints/:id/status", updateOfficerComplaintStatus);
router.put("/complaints/:id/remark", addOfficerRemark);

export default router;
