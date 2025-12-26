import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { uploadCompanyLogo } from "../controllers/upload.controller.js";

const router = express.Router();

// POST /api/upload/company-logo
router.post("/company-logo", protect, uploadCompanyLogo);

export default router;
