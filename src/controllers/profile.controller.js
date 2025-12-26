// import User from "../models/User.js";
// import bcrypt from "bcryptjs";

// /**
//  * GET PROFILE
//  * GET /api/profile
//  */
// export const getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(user);
//   } catch (error) {
//     console.error("Get profile error:", error);
//     res.status(500).json({ message: "Failed to fetch profile" });
//   }
// };

// /**
//  * UPDATE PROFILE
//  * PUT /api/profile
//  */
// export const updateProfile = async (req, res) => {
//   try {
//     const { name, email, avatar } = req.body;

//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Update allowed fields only
//     if (name) user.name = name;
//     if (email) user.email = email;
//     if (avatar) user.avatar = avatar;

//     await user.save();

//     res.json({
//       message: "Profile updated successfully",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         avatar: user.avatar,
//       },
//     });
//   } catch (error) {
//     console.error("Update profile error:", error);
//     res.status(500).json({ message: "Failed to update profile" });
//   }
// };

// /**
//  * CHANGE PASSWORD
//  * PUT /api/profile/password
//  */
// export const changePassword = async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;

//     if (!currentPassword || !newPassword) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const user = await User.findById(req.user.id);

//     const isMatch = await bcrypt.compare(
//       currentPassword,
//       user.password
//     );

//     if (!isMatch) {
//       return res.status(400).json({ message: "Current password incorrect" });
//     }

//     user.password = await bcrypt.hash(newPassword, 10);
//     await user.save();

//     res.json({ message: "Password updated successfully" });
//   } catch (error) {
//     console.error("Change password error:", error);
//     res.status(500).json({ message: "Failed to change password" });
//   }
// };

// src/controllers/profile.controller.js
import Company from "../models/Company.js";
import bcrypt from "bcryptjs"; // still used for password if you keep it

/**
 * GET PROFILE (Company)
 * GET /api/profile
 */
export const getProfile = async (req, res) => {
  try {
    // For now, assume single company for the user.
    // If you link company to user, filter by createdBy or user.companyId.
    const company = await Company.findOne(); 

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(company);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/**
 * UPDATE PROFILE (Company)
 * PUT /api/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, address, phone, email, logo } = req.body;

    const company = await Company.findOne(); // or findById/filer by user

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (name !== undefined) company.name = name;
    if (address !== undefined) company.address = address;
    // if (gstin !== undefined) company.gstin = gstin;
    if (phone !== undefined) company.phone = phone;
    if (email !== undefined) company.email = email;
    if (logo !== undefined) company.logo = logo;

    await company.save();

    res.json({
      message: "Company profile updated successfully",
      company,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

/**
 * CHANGE PASSWORD
 * PUT /api/profile/password
 *
 * If you still want to change User password, leave this as-is,
 * otherwise you can remove it.
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // If you still use User for auth:
    // import User and update password there.
    // If not needed, you can delete this endpoint.
    res.status(400).json({ message: "Password change not implemented for company" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Failed to change password" });
  }
};
