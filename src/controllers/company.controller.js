import Company from "../models/Company.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const createCompany = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Logo file is required" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "companies",
    });

    const company = await Company.create({
      ...req.body,
      logo: result.secure_url,
    });

    // remove local file after upload
    fs.unlinkSync(req.file.path);

    res.status(201).json(company);
  } catch (error) {
    console.error("Create company error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
