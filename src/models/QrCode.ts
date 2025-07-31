import mongoose, { Schema, Document } from "mongoose";

export interface IQrCode extends Document {
  refNo: string[];
  batchNo: string;
  createdAt: Date;
}

const QrCodeSchema = new Schema<IQrCode>({
  refNo: { type: [String], required: true },
  batchNo: { type: String, required: true , unique: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.QrCode || mongoose.model<IQrCode>("QrCode", QrCodeSchema);
