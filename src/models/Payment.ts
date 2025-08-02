import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({ 
    //user form data
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    upiId: { type: String, required: true },
    refId: { type: String, required: true, unique: true },
    status: { type: String, enum: ["PENDING", "COMPLETED", "REJECTED", "FAILED"], required: true },
    //admin part
    amount: { type: Number},
    transactionId: { type: String , unique: true },
    paymentMethod: { type: String },
    createdAt: { type: Date, default: Date.now },
    paymentDate: { type: Date },
    updatedAt: { type: Date, default: Date.now }
},{timestamps: true});

const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;