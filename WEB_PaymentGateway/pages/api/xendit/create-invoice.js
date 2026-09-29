import dbConnect from '../../../lib/dbConnect';
import Payment from '../../../models/Payment';

// Mapping method BoneChick → method Xendit
const methodMap = {
  qris: ['QRIS'],
  gopay: ['GOPAY'],
  ovo: ['OVO'],
  dana: ['DANA'],
  card: ['CREDIT_CARD'],
  va: ['BCA', 'BNI', 'BRI', 'MANDIRI', 'PERMATA'],
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const { paymentId } = req.body;
    if (!paymentId) {
      return res.status(400).json({ success: false, error: 'paymentId required' });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    const auth = Buffer.from(`${process.env.XENDIT_SECRET_KEY}:`).toString('base64');
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${req.headers.host}`;

    // Filter payment methods sesuai pilihan user, fallback ke semua kalau method ga match
    const allowedMethods = methodMap[payment.method] || [
      'QRIS', 'GOPAY', 'OVO', 'DANA', 'CREDIT_CARD', 'BCA', 'BNI',
    ];

    const xenditRes = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        external_id: payment.externalReference,
        amount: payment.amount,
        description: `BoneChick Order #${payment._id.toString().slice(-8).toUpperCase()}`,
        success_redirect_url: `${baseUrl}/success?paymentId=${payment._id}`,
        failure_redirect_url: `${baseUrl}/payment`,
        currency: 'IDR',
        invoice_duration: 3600,
        payment_methods: allowedMethods,
      }),
    });

    const invoice = await xenditRes.json();
    if (!xenditRes.ok) {
      console.error('Xendit error:', invoice);
      return res.status(500).json({
        success: false,
        error: invoice.message || 'Xendit invoice creation failed',
      });
    }

    payment.externalPaymentId = invoice.id;
    await payment.save();

    return res.status(200).json({
      success: true,
      invoiceUrl: invoice.invoice_url,
      invoiceId: invoice.id,
    });
  } catch (error) {
    console.error('create-invoice error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}