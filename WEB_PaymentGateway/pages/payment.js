import { useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../data/products';
import Toast from '../components/Toast';

const PAYMENT_METHODS = [
  { id: 'qris', label: 'QRIS', icon: '📱', desc: 'Semua aplikasi bank & e-wallet' },
  { id: 'gopay', label: 'GoPay', icon: '💚', desc: 'E-wallet Gojek' },
  { id: 'ovo', label: 'OVO', icon: '💜', desc: 'E-wallet OVO' },
  { id: 'dana', label: 'DANA', icon: '💙', desc: 'E-wallet DANA' },
  { id: 'card', label: 'Debit / Credit Card', icon: '💳', desc: 'BCA, Mandiri, BNI, BRI' },
  { id: 'va', label: 'Virtual Account', icon: '🏦', desc: 'Transfer via mobile banking' },
];

export default function Payment() {
  const router = useRouter();
  const { cart, subtotal, shipping, tax, total, totalItems } = useCart();
  const [method, setMethod] = useState('qris');
  const [address, setAddress] = useState('');
  const [toast, setToast] = useState(null);
  const [showSheet, setShowSheet] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Card form fields
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });

  // Random VA number (di-generate sekali)
  const [vaNumber] = useState(() =>
    '8808 ' +
    Math.floor(1000 + Math.random() * 9000) + ' ' +
    Math.floor(1000 + Math.random() * 9000) + ' ' +
    Math.floor(1000 + Math.random() * 9000)
  );

  const selected = PAYMENT_METHODS.find((m) => m.id === method);

  const handleConfirm = () => {
    if (!address.trim()) {
      setToast({ message: 'Isi alamat pengiriman dulu ya!', type: 'error' });
      return;
    }
    if (cart.length === 0) {
      setToast({ message: 'Keranjang kamu masih kosong', type: 'error' });
      return;
    }
    setShowSheet(true);
  };

  const handleFinishPayment = async () => {
  if (method === 'card') {
    if (!card.number || !card.name || !card.expiry || !card.cvv) {
      setToast({ message: 'Lengkapi data kartu dulu', type: 'error' });
      return;
    }
    if (card.number.replace(/\s/g, '').length < 12) {
      setToast({ message: 'Nomor kartu tidak valid', type: 'error' });
      return;
    }
  }

  setProcessing(true);

  try {
    // Step 1: POST create checkout
    const checkoutRes = await fetch('/api/checkouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Guest', // nanti bisa dari form
        shippingAddress: address,
        items: cart.map((item) => ({
          productId: item.id,
          qty: item.qty,
        })),
      }),
    });
    const checkoutJson = await checkoutRes.json();
    if (!checkoutJson.success) {
      throw new Error(checkoutJson.error || 'Gagal bikin checkout');
    }
    const checkoutId = checkoutJson.data._id;

    // Step 2: POST create payment
    const paymentRes = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        checkoutId,
        method,
      }),
    });
    const paymentJson = await paymentRes.json();
    if (!paymentJson.success) {
      throw new Error(paymentJson.error || 'Gagal bikin payment');
    }
    const paymentId = paymentJson.data._id;

    // Step 3 (SIMULASI): PATCH mark as paid
    // NOTE: Nanti di nomor 4 (webhook Xendit), langkah ini dihapus
    // karena status akan di-update otomatis oleh webhook
    await fetch(`/api/payments/${paymentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'paid' }),
    });

    // Redirect ke success dengan paymentId (bukan orderId lagi)
    router.push(`/success?paymentId=${paymentId}`);
  } catch (error) {
    console.error('Payment error:', error);
    setToast({ 
      message: `Error: ${error.message}`, 
      type: 'error' 
    });
    setProcessing(false);
  }
};

  const copyVA = () => {
    navigator.clipboard.writeText(vaNumber.replace(/\s/g, ''));
    setCopied(true);
    setToast({ message: 'Nomor VA disalin!', type: 'success' });
    setTimeout(() => setCopied(false), 2000);
  };

  const isEwalletOrQris = ['qris', 'gopay', 'ovo', 'dana'].includes(method);

  return (
    <div className="min-h-screen bg-orange-50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ←
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-800">Secure Checkout</h1>
            <p className="text-xs text-gray-500">🔒 Pembayaran aman & terenkripsi</p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 pb-40 space-y-4">
        {/* Shipping Address */}
        <section className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-2">Shipping Address</h3>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            placeholder="Alamat lengkap pengiriman..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 resize-none"
          />
        </section>

        {/* Payment Method */}
        <section className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Payment Method</h3>
          <div className="space-y-2">
            {PAYMENT_METHODS.map((opt) => (
              <label
                key={opt.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                  method === opt.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  value={opt.id}
                  checked={method === opt.id}
                  onChange={(e) => setMethod(e.target.value)}
                  className="accent-orange-600"
                />
                <span className="text-2xl">{opt.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800">{opt.label}</div>
                  <div className="text-xs text-gray-500">{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Order Summary */}
        <section className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
          <div className="flex justify-between text-sm text-gray-600 py-1">
            <span>Item(s) — {totalItems}x</span>
            <span>{formatRupiah(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 py-1">
            <span>Tax (10%)</span>
            <span>{formatRupiah(tax)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 py-1">
            <span>Shipping</span>
            <span>{formatRupiah(shipping)}</span>
          </div>
          <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold text-gray-800">
            <span>Total</span>
            <span className="text-orange-600 text-lg">{formatRupiah(total)}</span>
          </div>
        </section>
      </main>

      {/* Confirm & Pay */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleConfirm}
            disabled={cart.length === 0}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-full shadow-lg transition"
          >
            Confirm & Pay {formatRupiah(total)}
          </button>
        </div>
      </div>

      {/* Payment Bottom Sheet */}
      {showSheet && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 animate-fadeIn"
            onClick={() => !processing && setShowSheet(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-white rounded-t-3xl shadow-2xl animate-slideUp max-h-[85vh] overflow-y-auto">
            <div className="p-5 pb-8">
              {/* Handle bar */}
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />

              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{selected.icon}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{selected.label}</h3>
                  <p className="text-xs text-gray-500">
                    Total:{' '}
                    <span className="font-bold text-orange-600">
                      {formatRupiah(total)}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => !processing && setShowSheet(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
                >
                  ✕
                </button>
              </div>

              {/* QRIS / E-wallet */}
              {isEwalletOrQris && (
                <div className="text-center py-2">
                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-3 inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=BONECHICK-${method.toUpperCase()}-${total}-${Date.now()}`}
                      alt="QRIS BoneChick"
                      className="w-52 h-52"
                    />
                  </div>
                  <p className="text-sm text-gray-700 mt-3 font-medium">
                    Scan QR ini dari aplikasi {selected.label} kamu
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    ⏱️ Berlaku 5 menit
                  </p>
                </div>
              )}

              {/* Card form */}
              {method === 'card' && (
                <div className="space-y-3 py-2">
                  <div>
                    <label className="text-xs font-semibold text-gray-600">Nomor Kartu</label>
                    <input
                      type="text"
                      value={card.number}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 16);
                        const formatted = val.replace(/(.{4})/g, '$1 ').trim();
                        setCard({ ...card, number: formatted });
                      }}
                      placeholder="1234 5678 9012 3456"
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600">Nama di Kartu</label>
                    <input
                      type="text"
                      value={card.name}
                      onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })}
                      placeholder="FARREL R MUHAMMAD"
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 uppercase"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-600">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={card.expiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                          if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
                          setCard({ ...card, expiry: val });
                        }}
                        placeholder="12/28"
                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600">CVV</label>
                      <input
                        type="password"
                        value={card.cvv}
                        onChange={(e) =>
                          setCard({ ...card, cvv: e.target.value.replace(/[^0-9]/g, '').slice(0, 3) })
                        }
                        placeholder="123"
                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 text-center">🔒 Data kartu terenkripsi</p>
                </div>
              )}

              {/* Virtual Account */}
              {method === 'va' && (
                <div className="py-2 space-y-3">
                  <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                    <p className="text-xs text-gray-500 mb-1">Virtual Account BCA</p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-mono text-base sm:text-lg font-bold text-gray-800">
                        {vaNumber}
                      </p>
                      <button
                        onClick={copyVA}
                        className="text-xs bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-full font-semibold"
                      >
                        {copied ? '✓ Tersalin' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 space-y-1.5">
                    <p className="font-semibold text-gray-700 mb-1">Cara Bayar:</p>
                    <p>1. Buka aplikasi mobile banking kamu</p>
                    <p>2. Pilih menu Transfer → Virtual Account</p>
                    <p>3. Masukkan nomor VA di atas</p>
                    <p>4. Konfirmasi jumlah: <strong className="text-orange-600">{formatRupiah(total)}</strong></p>
                  </div>
                </div>
              )}

              {/* Action button */}
              <button
                onClick={handleFinishPayment}
                disabled={processing}
                className="w-full mt-5 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-full transition"
              >
                {processing
                  ? 'Memproses pembayaran...'
                  : method === 'card'
                    ? `Bayar ${formatRupiah(total)}`
                    : method === 'va'
                      ? 'Konfirmasi Pembayaran'
                      : 'Sudah Bayar ✓'}
              </button>
              <p className="text-xs text-gray-400 text-center mt-2">
                
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}