import mongoose from 'mongoose';

const CheckoutItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    qty: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true },
  },
  { _id: false }
);

const CheckoutSchema = new mongoose.Schema(
  {
    customerName: { type: String, default: 'Guest' },
    shippingAddress: {
      type: String,
      required: [true, 'Alamat pengiriman wajib diisi'],
    },
    items: {
      type: [CheckoutItemSchema],
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    shipping: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'processing', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Checkout || mongoose.model('Checkout', CheckoutSchema);