import dbConnect from '../../../lib/dbConnect';
import Payment from '../../../models/Payment';
import Checkout from '../../../models/Checkout';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Verify Xendit webhook token
  const token = req.headers['x-callback-token'];
  if (token !== process.env.XENDIT_WEBHOOK_TOKEN) {
    console.warn('Invalid webhook token:', token);
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  await dbConnect();

  try {
    const { external_id, status, id: invoiceId } = req.body;
    console.log('Xendit webhook received:', { external_id, status, invoiceId });

    const payment = await Payment.findOne({ externalReference: external_id });
    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    // Map Xendit status → our status
    let newStatus = 'pending';
    if (status === 'PAID' || status === 'SETTLED') newStatus = 'paid';
    else if (status === 'EXPIRED') newStatus = 'expired';
    else if (status === 'FAILED') newStatus = 'failed';

    payment.status = newStatus;
    payment.externalPaymentId = invoiceId;
    if (newStatus === 'paid') payment.paidAt = new Date();
    await payment.save();

    // Auto-update checkout status juga
    if (newStatus === 'paid') {
      await Checkout.findByIdAndUpdate(payment.checkoutId, { status: 'paid' });
    }

    return res.status(200).json({ success: true, status: newStatus });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}