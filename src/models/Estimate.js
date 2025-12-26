// src/models/Estimate.js
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  itemName: String,
  hsn: String,
  qty: Number,
  unit: String,
  price: Number,
  total: Number,
});

const estimateSchema = new mongoose.Schema(
  {
    estimateNo: String,
    customerName: String,
    items: [itemSchema],
    subTotal: Number,
    // cgst: Number,
    // sgst: Number,
    grandTotal: Number,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Estimate", estimateSchema);
