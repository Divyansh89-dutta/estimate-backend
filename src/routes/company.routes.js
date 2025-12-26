import express from "express";
import upload from "../middlewares/upload.middleware.js";
import { createCompany } from "../controllers/company.controller.js";

const router = express.Router();
router.post("/", upload.single("logo"), createCompany);
export default router;
