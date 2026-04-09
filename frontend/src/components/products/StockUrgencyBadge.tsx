import React, { useEffect, useState } from 'react';
import { AlertTriangle, Zap } from 'lucide-react';

interface StockUrgencyBadgeProps {
  stockQuantity: number;
  lowStockThreshold?: number;
  showAnimation?: boolean;
}

const StockUrgencyBadge: React.FC<StockUrgencyBadgeProps> = ({
  stockQuantity,
  lowStockThreshold = 5,
  showAnimation = true,
}) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!showAnimation || stockQuantity > lowStockThreshold) return;
    const interval = setInterval(() => setPulse(p => !p), 1500);
    return () => clearInterval(interval);
  }, [stockQuantity, lowStockThreshold, showAnimation]);

  if (stockQuantity <= 0) {
    return (
      <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full">
        <AlertTriangle className="w-3.5 h-3.5" />
        Out of stock
      </span>
    );
  }

  if (stockQuantity <= lowStockThreshold) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-500 ${
          pulse
            ? 'bg-red-600 text-white scale-105'
            : 'bg-red-100 text-red-700'
        }`}
      >
        <Zap className="w-3.5 h-3.5" />
        Only {stockQuantity} left — selling fast!
      </span>
    );
  }

  return null;
};

export default StockUrgencyBadge;
