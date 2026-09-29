// Data menu BoneChick — nanti bisa diganti fetch dari MongoDB
export const CATEGORIES = ['All', 'Ayam', 'Ricebox', 'Snacks', 'Minuman'];

export const products = [
  // ===== AYAM (5) =====
  {
    id: 1,
    name: 'BoneChick Original',
    category: 'Ayam',
    price: 20000,
    description: 'Ayam krispi boneless original, gurih & renyah.',
    image: '🍗',
  },
  {
    id: 2,
    name: 'BoneChick Pedas',
    category: 'Ayam',
    price: 22000,
    description: 'Sensasi pedas nagih dengan bumbu spesial.',
    image: '🌶️',
  },
  {
    id: 3,
    name: 'BoneChick Cheese',
    category: 'Ayam',
    price: 25000,
    description: 'Ayam krispi disiram saus keju melimpah.',
    image: '🧀',
  },
  {
    id: 4,
    name: 'BoneChick BBQ',
    category: 'Ayam',
    price: 24000,
    description: 'Manis smoky khas saus BBQ import.',
    image: '🍖',
  },
  {
    id: 5,
    name: 'BoneChick Blackpepper',
    category: 'Ayam',
    price: 25000,
    description: 'Lada hitam pekat, aroma menggoda.',
    image: '🖤',
  },

  // ===== RICEBOX (4) =====
  {
    id: 6,
    name: 'Ricebox Original',
    category: 'Ricebox',
    price: 28000,
    description: 'Nasi + ayam krispi + sambal & lalapan.',
    image: '🍱',
  },
  {
    id: 7,
    name: 'Ricebox Sambal Matah',
    category: 'Ricebox',
    price: 32000,
    description: 'Ricebox dengan sambal matah khas Bali.',
    image: '🌿',
  },
  {
    id: 8,
    name: 'Ricebox Blackpepper',
    category: 'Ricebox',
    price: 33000,
    description: 'Nasi + ayam saus lada hitam & telur mata sapi.',
    image: '🍳',
  },
  {
    id: 9,
    name: 'Ricebox Cheese Lava',
    category: 'Ricebox',
    price: 35000,
    description: 'Ricebox dengan keju leleh melimpah.',
    image: '🧈',
  },

  // ===== SNACKS (3) =====
  {
    id: 10,
    name: 'Kentang Goreng',
    category: 'Snacks',
    price: 15000,
    description: 'French fries garing, cocok temen ngobrol.',
    image: '🍟',
  },
  {
    id: 11,
    name: 'Chicken Bites',
    category: 'Snacks',
    price: 18000,
    description: 'Potongan ayam krispi mini, 8 pcs.',
    image: '🍗',
  },
  {
    id: 12,
    name: 'Mozzarella Stick',
    category: 'Snacks',
    price: 20000,
    description: 'Keju mozzarella meleleh, 5 pcs.',
    image: '🧀',
  },

  // ===== MINUMAN (4) =====
  {
    id: 13,
    name: 'Es Teh Manis',
    category: 'Minuman',
    price: 8000,
    description: 'Teh manis dingin, segar banget.',
    image: '🥤',
  },
  {
    id: 14,
    name: 'Es Jeruk',
    category: 'Minuman',
    price: 10000,
    description: 'Jeruk peras asli, dingin & seger.',
    image: '🍊',
  },
  {
    id: 15,
    name: 'Es Kopi Susu',
    category: 'Minuman',
    price: 15000,
    description: 'Kopi susu gula aren, favorit anak kuliahan.',
    image: '☕',
  },
];

export const formatRupiah = (n) =>
  'Rp ' + n.toLocaleString('id-ID');