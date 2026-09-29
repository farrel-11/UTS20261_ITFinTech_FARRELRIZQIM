import dbConnect from '../../lib/dbConnect';
import Product from '../../models/Product';
import Checkout from '../../models/Checkout';
import Payment from '../../models/Payment';

export default async function handler(req, res) {
  try {
    await dbConnect();
    
    // Coba count dokumen di tiap collection
    const productCount = await Product.countDocuments();
    const checkoutCount = await Checkout.countDocuments();
    const paymentCount = await Payment.countDocuments();
    
    res.status(200).json({
      success: true,
      message: 'All models loaded successfully! 🎉',
      collections: {
        products: productCount,
        checkouts: checkoutCount,
        payments: paymentCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}