import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nama produk wajib diisi'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Ayam', 'Ricebox', 'Snacks', 'Minuman'],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String, // untuk sekarang berupa emoji, nanti bisa diganti URL
      default: '🍗',
    },
    stock: {
      type: Number,
      default: 100,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // otomatis nambahin createdAt & updatedAt
  }
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);