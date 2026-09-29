import { useEffect } from 'react';

export default function Toast({ message, type = 'error', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  const styles = {
    error: 'bg-red-500 border-red-600',
    success: 'bg-green-500 border-green-600',
    info: 'bg-orange-500 border-orange-600',
  };
  const icons = { error: '⚠️', success: '✅', info: 'ℹ️' };

  return (
    <div className="fixed top-4 left-4 right-4 max-w-md mx-auto z-[60] animate-slideDown">
      <div className={`${styles[type]} text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border`}>
        <span className="text-xl">{icons[type]}</span>
        <p className="text-sm font-medium flex-1">{message}</p>
        <button 
          onClick={onClose} 
          className="text-white/80 hover:text-white text-lg leading-none"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}