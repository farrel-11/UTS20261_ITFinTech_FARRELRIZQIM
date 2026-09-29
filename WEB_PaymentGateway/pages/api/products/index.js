import dbConnect from '../../../lib/dbConnect';
import Product from '../../../models/Product';

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'GET': {
      try {
        const { category } = req.query;
        const filter = category && category !== 'All' ? { category } : {};
        const products = await Product.find(filter).sort({ category: 1, price: 1 });
        return res.status(200).json({ success: true, data: products });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
    }

    case 'POST': {
      try {
        const product = await Product.create(req.body);
        return res.status(201).json({ success: true, data: product });
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }
    }

    default:
      return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}