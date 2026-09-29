import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../data/products';

export default function Checkout() {
  const router = useRouter();
  const { cart, updateQty, removeItem, subtotal, tax, total } = useCart();

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ←
          </button>
          <h1 className="text-lg font-bold text-gray-800">Checkout</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 pb-40">
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-3">🛒</div>
            <p className="text-gray-500 mb-4">Keranjang kamu masih kosong</p>
            <Link
              href="/"
              className="inline-block bg-orange-600 text-white px-6 py-2 rounded-full font-semibold"
            >
              Pilih Menu
            </Link>
          </div>
        ) : (
          <>
            {/* Cart items */}
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3"
                >
                  <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center text-3xl">
                    {item.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-800 truncate">
                      {item.name}
                    </h4>
                    <p className="text-orange-600 font-bold text-sm mt-0.5">
                      {formatRupiah(item.price)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 font-bold"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="w-7 h-7 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-600 font-bold"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-xs text-red-500 hover:text-red-700"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl p-4 mt-4 shadow-sm">
              <div className="flex justify-between text-sm text-gray-600 py-1">
                <span>Subtotal</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 py-1">
                <span>Tax (10%)</span>
                <span>{formatRupiah(tax)}</span>
              </div>
              <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold text-gray-800">
                <span>Total</span>
                <span className="text-orange-600">{formatRupiah(total - 5000)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">*belum termasuk ongkir</p>
            </div>
          </>
        )}
      </main>

      {/* Continue button */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-md mx-auto">
            <Link
              href="/payment"
              className="block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-full text-center shadow-lg"
            >
              Continue to Payment →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}