import dbConnect from '../../../lib/dbConnect';
import Checkout from '../../../models/Checkout';

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  switch (req.method) {
    case 'GET': {
      try {
        const checkout = await Checkout.findById(id).populate('paymentId');
        if (!checkout) {
          return res.status(404).json({ success: false, error: 'Checkout not found' });
        }
        return res.status(200).json({ success: true, data: checkout });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
    }

    case 'PATCH': {
      try {
        const updated = await Checkout.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) {
          return res.status(404).json({ success: false, error: 'Checkout not found' });
        }
        return res.status(200).json({ success: true, data: updated });
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }
    }

    default:
      return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}