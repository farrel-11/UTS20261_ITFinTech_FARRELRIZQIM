import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../data/products';

export default function Success() {
  const router = useRouter();
  const { paymentId } = router.query;
  const { clearCart } = useCart();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!paymentId) return;

    async function fetchPayment() {
      try {
        const res = await fetch(`/api/payments/${paymentId}`);
        const json = await res.json();
        if (json.success) {
          setPayment(json.data);
          // Clear cart kalau payment sukses
          if (json.data.status === 'paid') {
            clearCart();
          }
        } else {
          setError(json.error || 'Failed to load payment');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 mt-3">Verifikasi pembayaran...</p>
        </div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center text-4xl mb-3">
            ⚠️
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-1">Terjadi Kesalahan</h1>
          <p className="text-gray-500 text-sm mb-4">{error || 'Payment tidak ditemukan'}</p>
          <Link
            href="/"
            className="inline-block bg-orange-600 text-white px-6 py-2 rounded-full font-semibold"
          >
            Kembali ke Menu
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = payment.status === 'paid';

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 text-center">
        <div
          className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-5xl mb-4 ${
            isPaid ? 'bg-green-100' : 'bg-yellow-100'
          }`}
        >
          {isPaid ? '✅' : '⏳'}
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          {isPaid ? 'Pembayaran Berhasil!' : 'Menunggu Pembayaran'}
        </h1>
        <p className="text-gray-500 text-sm mb-5">
          {isPaid
            ? 'Terima kasih sudah pesan di BoneChick 🍗'
            : 'Silakan selesaikan pembayaran'}
        </p>

        <div className="bg-orange-50 rounded-xl p-4 text-left space-y-2 mb-5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Order ID</span>
            <span className="font-mono font-semibold text-gray-800 text-xs">
              {payment._id.slice(-10).toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Metode</span>
            <span className="font-semibold text-gray-800 uppercase">
              {payment.method}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Dibayar</span>
            <span className="font-bold text-orange-600">
              {formatRupiah(payment.amount)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <span
              className={`font-semibold ${
                isPaid ? 'text-green-600' : 'text-yellow-600'
              }`}
            >
              {isPaid ? 'LUNAS' : 'PENDING'}
            </span>
          </div>
          {payment.paidAt && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Waktu Lunas</span>
              <span className="text-gray-700 text-xs">
                {new Date(payment.paidAt).toLocaleString('id-ID')}
              </span>
            </div>
          )}
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