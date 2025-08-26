import mongoose from "mongoose";

const sepayPaymentSchema = new mongoose.Schema(
  {
    paymentCode: { 
      type: String, 
      unique: true, 
      required: true,
      index: true 
    },
    status: { 
      type: String, 
      enum: ["pending", "paid", "failed", "expired"], 
      default: "pending" 
    },
    amount: { 
      type: Number, 
      required: true 
    },
    userId: { 
      type: String,
      required: true,
      index: true
    },
    transactionId: {
      type: String,
      default: null
    },
    paidAt: {
      type: Date,
      default: null
    },
    expiresAt: {
      type: Date,
      default: function() {
        return new Date(Date.now() + 15 * 60 * 1000); // 15 phút
      }
    },
    sepayData: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    callbackData: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  { 
    timestamps: true,
    indexes: [
      { paymentCode: 1 },
      { userId: 1 },
      { status: 1 },
      { createdAt: 1 }
    ]
  }
);

// Middleware để tự động cập nhật trạng thái expired
sepayPaymentSchema.pre('find', function() {
  // Cập nhật các payment đã hết hạn
  this.model.updateMany(
    { 
      status: "pending", 
      expiresAt: { $lt: new Date() } 
    },
    { status: "expired" }
  );
});

export default mongoose.models.SepayPayment || mongoose.model("SepayPayment", sepayPaymentSchema);
