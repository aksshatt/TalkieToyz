import { useState } from 'react';
import { IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

interface PriceFilterProps {
  onPriceChange: (min: number | undefined, max: number | undefined) => void;
  minPrice?: number;
  maxPrice?: number;
}

const PriceFilter = ({ onPriceChange, minPrice = 0, maxPrice = 200 }: PriceFilterProps) => {
  const [min, setMin] = useState<string>(minPrice.toString());
  const [max, setMax] = useState<string>(maxPrice.toString());

  const handleApply = () => {
    const minVal = min ? parseFloat(min) : undefined;
    const maxVal = max ? parseFloat(max) : undefined;

    if (minVal !== undefined && maxVal !== undefined && minVal > maxVal) {
      toast.error('Minimum price cannot be greater than maximum price');
      return;
    }

    onPriceChange(minVal, maxVal);
  };

  const handleReset = () => {
    setMin('');
    setMax('');
    onPriceChange(undefined, undefined);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-warmgray-700 mb-2">
        <IndianRupee className="h-4 w-4 text-teal" />
        <span>Price Range</span>
      </div>

      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <label className="block text-xs text-warmgray-500 mb-1">Min</label>
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            placeholder="0"
            min="0"
            className="w-full px-3 py-2 border-2 border-warmgray-200 rounded-xl focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/10 text-sm"
          />
        </div>

        <span className="text-warmgray-400 mt-5">–</span>

        <div className="flex-1">
          <label className="block text-xs text-warmgray-500 mb-1">Max</label>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            placeholder="200"
            min="0"
            className="w-full px-3 py-2 border-2 border-warmgray-200 rounded-xl focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/10 text-sm"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleApply}
          className="flex-1 bg-teal-gradient text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity text-sm font-semibold shadow-soft"
        >
          Apply
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 border-2 border-warmgray-200 rounded-xl hover:bg-warmgray-50 transition-colors text-sm font-semibold text-warmgray-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default PriceFilter;
