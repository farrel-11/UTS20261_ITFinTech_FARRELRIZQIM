import dbConnect from '../../lib/dbConnect';
import Product from '../../models/Product';
import { products as localProducts } from '../../data/products';

export default async function handler(req, res) {
  // Cuma boleh POST (biar ga ke-trigger asal buka URL)
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    await dbConnect();

    // Cek dulu berapa produk yang udah ada
    const existingCount = await Product.countDocuments();
    
    if (existingCount > 0) {
      return res.status(200).json({
        success: false,
        message: `Database sudah punya ${existingCount} produk. Hapus dulu kalau mau reseed.`,
        hint: 'Tambah ?force=true di URL untuk force reseed (hapus semua & seed ulang)',
      });
    }

    // Convert local data ke format MongoDB (buang field 'id' yang integer)
    const productsToInsert = localProducts.map((p) => ({
      name: p.name,
      category: p.category,
      price: p.price,
      description: p.description,
      image: p.image,
      stock: 100,
      isAvailable: true,
    }));

    // Insert ke MongoDB
    const inserted = await Product.insertMany(productsToInsert);

    res.status(201).json({
      success: true,
      message: `${inserted.length} produk BoneChick berhasil di-seed! 🍗`,
      count: inserted.length,
      products: inserted.map(p => ({ 
        id: p._id, 
        name: p.name, 
        category: p.category, 
        price: p.price 
      })),
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}