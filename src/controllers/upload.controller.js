import { v2 as cloudinary } from "cloudinary";
import Company from "../models/Company.js";

export const uploadCompanyLogo = async (req, res) => {
  try {
    const { logo } = req.body; // base64 string

    if (!logo) {
      return res.status(400).json({ message: "No logo provided" });
    }

    const result = await cloudinary.uploader.upload(logo, {
      folder: "estimate_app/companies",
    });

    // optionally save directly to company
    const company = await Company.findOne();
    if (company) {
      company.logo = result.secure_url;
      await company.save();
    }

    res.json({
      message: "Logo uploaded successfully",
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Company logo upload error:", error);
    res.status(500).json({ message: "Failed to upload logo" });
  }
};
