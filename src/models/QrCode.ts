import mongoose from "mongoose";

const QrCodeSchema = new mongoose.Schema({
  refNo: [
    {
      value: { type: String, required: true },
      status: { type: String, enum: ["REVOKED", "ACTIVE", "USED"], required: true },
    },
  ],
  batchNo: { type: String, required: true, unique: true },
  status: { type: String, enum: ["REVOKED", "ACTIVE"], required: true },
  createdAt: { type: Date, default: Date.now },
},{timestamps: true});

const QrCode = mongoose.models.QrCode || mongoose.model("QrCode", QrCodeSchema);

export default QrCode;