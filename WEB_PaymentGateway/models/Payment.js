import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
  {
    // Link ke Checkout
    checkoutId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Checkout',
      required: true,
    },

    // Metode pembayaran
    method: {
      type: String,
      required: true,
      enum: ['qris', 'gopay', 'ovo', 'dana', 'card', 'va'],
    },

    // Detail pembayaran
    amount: { type: Number, required: true },

    // Status pembayaran (paling penting!)
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'expired'],
      default: 'pending',
    },

    // Reference dari payment gateway (nanti Xendit)
    externalReference: { type: String },
    externalPaymentId: { type: String },

    // Timestamp saat lunas
    paidAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);