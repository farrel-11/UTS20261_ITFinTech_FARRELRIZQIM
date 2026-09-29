import dbConnect from '../../../lib/dbConnect';
import Payment from '../../../models/Payment';
import Checkout from '../../../models/Checkout';

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  switch (req.method) {
    case 'GET': {
      try {
        const payment = await Payment.findById(id).populate('checkoutId');
        if (!payment) {
          return res.status(404).json({ success: false, error: 'Payment not found' });
        }
        return res.status(200).json({ success: true, data: payment });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
    }

    case 'PATCH': {
      // Ini yang bakal dipake sama webhook Xendit nanti buat update ke LUNAS
      try {
        const { status, externalPaymentId } = req.body;

        const payment = await Payment.findById(id);
        if (!payment) {
          return res.status(404).json({ success: false, error: 'Payment not found' });
        }

        payment.status = status || payment.status;
        if (externalPaymentId) payment.externalPaymentId = externalPaymentId;
        if (status === 'paid') payment.paidAt = new Date();

        await payment.save();

        // Update juga status di Checkout
        if (status === 'paid') {
          await Checkout.findByIdAndUpdate(payment.checkoutId, { status: 'paid' });
        }

        return res.status(200).json({ success: true, data: payment });
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }
    }

    default:
      return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}