import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: String,
  address: String,
  // gstin: String,
  phone: String,
  email: String,
  logo: String,
});

export default mongoose.model("Company", companySchema);
