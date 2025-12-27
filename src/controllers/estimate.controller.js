import Estimate from "../models/Estimate.js";
import { generatePDF } from "../services/pdf.service.js";
import Notification from "../models/Notification.js";
import { sendMail } from "../services/mail.service.js";
// import { generateWhatsAppLink } from "../utils/whatsappLink.js";

/**
 * CREATE Estimate
 * POST /api/estimate
 */
export const createEstimate = async (req, res) => {
  try {
    const { estimateNo, customerName, items } = req.body;

    if (!estimateNo || !customerName || !items || !items.length) {
      return res.status(400).json({ message: "Invalid data" });
    }

    let subTotal = 0;

    items.forEach((item) => {
      item.qty = Number(item.qty) || 0;
      item.price = Number(item.price) || 0;
      item.total = item.qty * item.price;
      item.itemName = item.itemName || "Item";
      subTotal += item.total;
    });

    const estimate = await Estimate.create({
      estimateNo, // ✅ USER INPUT (64)
      customerName,
      items,
      subTotal: +subTotal.toFixed(2),
      grandTotal: +subTotal.toFixed(2),
      createdBy: req.user.id,
    });

    const notification = await Notification.create({
      user: req.user.id,
      message: `Estimate ${estimate.estimateNo} created`,
    });

    const io = req.app.get("io");
    io?.to(req.user.id).emit("notification", notification);

    await sendMail(
      req.user.email,
      "Estimate Created",
      `Your estimate ${estimate.estimateNo} has been created successfully.`
    );

    res.status(201).json(estimate);
  } catch (error) {
    console.error("Create estimate error:", error);
    res.status(500).json({ message: "Failed to create estimate" });
  }
};


/**
 * DOWNLOAD PDF
 */
// export const downloadPDF = async (req, res) => {
//   try {
//     const estimateId = req.params.id;
//     const estimate = await Estimate.findById(estimateId);

//     if (!estimate) {
//       return res.status(404).json({ message: "Estimate not found" });
//     }

//     const pdfBuffer = await generatePDF(estimate);

//     const filename = `estimate-${estimate.estimateNo || estimateId}.pdf`;

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="${filename}"`
//     );
//     res.setHeader("Content-Length", pdfBuffer.length);

//     return res.status(200).send(pdfBuffer);
//   } catch (err) {
//     console.error("downloadPDF error:", err);
//     return res.status(500).json({ message: "Failed to generate PDF" });
//   }
// };


import Estimate from "../models/Estimate.js";
import { generatePDF } from "../services/pdf.service.js";

/**
 * DOWNLOAD PDF
 * GET /api/estimate/:id/pdf
 */
export const downloadPDF = async (req, res) => {
  try {
    const estimate = await Estimate.findById(req.params.id);

    if (!estimate) {
      return res.status(400).send("Invalid estimate ID");
    }

    const pdfBuffer = await generatePDF(estimate);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="estimate-${estimate.estimateNo}.pdf"`
    );
    res.setHeader("Content-Length", pdfBuffer.length);

    return res.send(pdfBuffer);
  } catch (error) {
    console.error("Download PDF error:", error);
    return res.status(500).json({ message: "PDF generation failed" });
  }
};


/**
 * UPDATE Estimate
 */
export const updateEstimate = async (req, res) => {
  try {
    const estimate = await Estimate.findById(req.params.id);

    if (!estimate) {
      return res.status(404).json({ message: "Estimate not found" });
    }

    if (estimate.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (req.body.items && Array.isArray(req.body.items)) {
      let subTotal = 0;

      req.body.items.forEach((item) => {
        item.qty = Number(item.qty) || 0;
        item.price = Number(item.price) || 0;
        item.total = item.qty * item.price;
        subTotal += item.total;
      });

      estimate.items = req.body.items;
      estimate.subTotal = +subTotal.toFixed(2);
      estimate.grandTotal = +subTotal.toFixed(2);
    }

    if (req.body.customerName) {
      estimate.customerName = req.body.customerName;
    }

    const updatedEstimate = await estimate.save();

    const notification = await Notification.create({
      user: req.user.id,
      message: `Estimate ${estimate.estimateNo} updated`,
    });

    const io = req.app.get("io");
    io?.to(req.user.id).emit("notification", notification);

    res.json(updatedEstimate);
  } catch (error) {
    console.error("Update estimate error:", error.message);
    res.status(500).json({ message: "Failed to update estimate" });
  }
};

/**
 * DELETE Estimate
 */
export const deleteEstimate = async (req, res) => {
  try {
    const estimate = await Estimate.findById(req.params.id);

    if (!estimate) {
      return res.status(404).json({ message: "Estimate not found" });
    }

    if (estimate.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await estimate.deleteOne();

    res.json({ message: "Estimate deleted successfully" });
  } catch (error) {
    console.error("Delete estimate error:", error.message);
    res.status(500).json({ message: "Failed to delete estimate" });
  }
};

/**
 * LIST Estimates
 */
export const getEstimates = async (req, res) => {
  try {
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Estimate.find({ createdBy: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Estimate.countDocuments({ createdBy: userId }),
    ]);

    res.json({
      data,
      totalPages: Math.ceil(total / limit),
      page,
    });
  } catch (error) {
    console.error("GET ESTIMATES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch estimates" });
  }
};

export const getEstimateById = async (req, res) => {
  try {
    const estimate = await Estimate.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!estimate) {
      return res.status(404).json({ message: "Estimate not found" });
    }

    res.json(estimate);
  } catch (error) {
    console.error("Get estimate error:", error);
    res.status(500).json({ message: "Failed to fetch estimate" });
  }
};
