import dbConnect from '../../../lib/dbConnect';
import Checkout from '../../../models/Checkout';
import Product from '../../../models/Product';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { customerName, shippingAddress, items } = req.body;

    if (!shippingAddress || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Alamat & items wajib diisi',
      });
    }

    // Validasi produk & hitung ulang harga di server (jangan trust price dari client!)
    const productIds = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== items.length) {
      return res.status(400).json({
        success: false,
        error: 'Ada produk yang tidak ditemukan',
      });
    }

    // Bikin items yang udah validated
    const validatedItems = items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.productId);
      return {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: item.qty,
        subtotal: product.price * item.qty,
      };
    });

    // Hitung total
    const subtotal = validatedItems.reduce((sum, i) => sum + i.subtotal, 0);
    const tax = Math.round(subtotal * 0.1);
    const shipping = 5000;
    const total = subtotal + tax + shipping;

    const checkout = await Checkout.create({
      customerName: customerName || 'Guest',
      shippingAddress,
      items: validatedItems,
      subtotal,
      tax,
      shipping,
      total,
      status: 'pending',
    });

    return res.status(201).json({ success: true, data: checkout });
  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}