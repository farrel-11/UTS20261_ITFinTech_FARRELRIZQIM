import dbConnect from '../../../lib/dbConnect';
import Payment from '../../../models/Payment';
import Checkout from '../../../models/Checkout';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { checkoutId, method } = req.body;

    if (!checkoutId || !method) {
      return res.status(400).json({
        success: false,
        error: 'checkoutId dan method wajib diisi',
      });
    }

    // Ambil checkout buat dapetin amount
    const checkout = await Checkout.findById(checkoutId);
    if (!checkout) {
      return res.status(404).json({ success: false, error: 'Checkout not found' });
    }

    // Bikin payment record dengan status pending
    const payment = await Payment.create({
      checkoutId: checkout._id,
      method,
      amount: checkout.total,
      status: 'pending',
      externalReference: `BC-${Date.now()}`,
    });

    // Link payment ke checkout
    checkout.paymentId = payment._id;
    await checkout.save();

    return res.status(201).json({ success: true, data: payment });
  } catch (error) {
    console.error('Payment error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}