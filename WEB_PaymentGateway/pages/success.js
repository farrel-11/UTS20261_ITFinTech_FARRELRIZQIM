import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../data/products';

export default function Success() {
  const router = useRouter();
  const { orderId, total } = router.query;
  const { clearCart } = useCart();

  // Clear cart setelah sukses
  useEffect(() => {
    if (orderId) clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center text-5xl mb-4">
          ✅
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Pembayaran Berhasil!
        </h1>
        <p className="text-gray-500 text-sm mb-5">
          Terima kasih sudah pesan di BoneChick 🍗
        </p>

        <div className="bg-orange-50 rounded-xl p-4 text-left space-y-2 mb-5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Order ID</span>
            <span className="font-mono font-semibold text-gray-800">
              {orderId || '—'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Dibayar</span>
            <span className="font-bold text-orange-600">
              {total ? formatRupiah(Number(total)) : '—'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <span className="font-semibold text-green-600">LUNAS</span>
          </div>
        </div>

        <div className="space-y-2">
          <Link
            href="/"
            className="block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-full"
          >
            Pesan Lagi 🍗
          </Link>
          <p className="text-xs text-gray-400 mt-2">
            Pesanan kamu akan segera diproses & diantar
          </p>
        </div>
      </div>
    </div>
  );
}