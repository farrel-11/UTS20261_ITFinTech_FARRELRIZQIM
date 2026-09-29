import { useState } from 'react';
import Link from 'next/link';
import { products, CATEGORIES, formatRupiah } from '../data/products';
import { useCart } from '../context/CartContext';

export default function Home() {
  const { addToCart, totalItems } = useCart();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍗</span>
            <h1 className="text-xl font-bold text-orange-600">BoneChick</h1>
          </div>
          <Link href="/checkout" className="relative">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-100">
              🛒
            </div>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto px-4 pb-3">
          <input
            type="text"
            placeholder="🔍 Cari menu favoritmu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-full border border-gray-200 bg-gray-50 focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Category tabs */}
        <div className="max-w-md mx-auto px-4 pb-3 flex gap-2 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                activeCategory === cat
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Hero banner */}
      <div className="max-w-md mx-auto px-4 pt-4">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg">
          <h2 className="text-lg font-bold">Ayam Krispi Boneless Terenak! 🔥</h2>
          <p className="text-sm text-orange-50 mt-1">
            Harga mahasiswa, rasa juara.
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <main className="max-w-md mx-auto px-4 py-4 pb-24">
        <h3 className="text-sm font-semibold text-gray-500 mb-3">
          {filtered.length} menu tersedia
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col"
            >
              <div className="h-24 bg-orange-100 flex items-center justify-center text-5xl">
                {p.image}
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <h4 className="font-semibold text-sm text-gray-800">
                  {p.name}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                  {p.description}
                </p>
                <div className="mt-auto pt-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-orange-600">
                    {formatRupiah(p.price)}
                  </span>
                  <button
                    onClick={() => addToCart(p)}
                    className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-10">
            Menu nggak ketemu 😅
          </p>
        )}
      </main>

      {/* Floating cart button (mobile) */}
      {totalItems > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
          <Link
            href="/checkout"
            className="block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-full shadow-lg text-center"
          >
            Lihat Keranjang ({totalItems}) →
          </Link>
        </div>
      )}
    </div>
  );
}
