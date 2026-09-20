import express from "express";
import {
  getMyProfile,
  loginUser,
  logoutUser,
  registerUser
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMyProfile);
router.post("/logout", protect, logoutUser);

export default router;
