// // import express from "express";
// // import { createEstimate, downloadPDF } from "../controllers/estimate.controller.js";
// // import { protect } from "../middlewares/auth.middleware.js";

// // const router = express.Router();
// // router.post("/", protect, createEstimate);
// // router.get("/:id/pdf", protect, downloadPDF);
// // export default router;
// import express from "express";
// import {
//   createEstimate,
//   deleteEstimate,
//   downloadPDF,
//   getEstimates,
//   // shareEstimateWhatsApp,
//   updateEstimate,
//   getEstimateById
// } from "../controllers/estimate.controller.js";
// import { protect } from "../middlewares/auth.middleware.js";

// const router = express.Router();

// // Create estimate (protected)
// router.post("/", protect, createEstimate);

// // Download PDF (protected)
// router.get("/:id/pdf", protect, downloadPDF);

// // router.get("/:id/whatsapp", protect, shareEstimateWhatsApp);
// // UPDATE & DELETE
// router.put("/:id", protect, updateEstimate);
// router.delete("/:id", protect, deleteEstimate);
// router.get("/", protect, getEstimates);
// router.get("/:id", protect, getEstimateById);
// export default router;
import express from "express";
import {
  createEstimate,
  deleteEstimate,
  downloadPDF,
  getEstimates,
  updateEstimate,
  getEstimateById,
} from "../controllers/estimate.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createEstimate);
router.get("/:id/pdf", protect, downloadPDF);
router.put("/:id", protect, updateEstimate);
router.delete("/:id", protect, deleteEstimate);
router.get("/", protect, getEstimates);
router.get("/:id", protect, getEstimateById);

export default router;
