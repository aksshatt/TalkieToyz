import { useState } from 'react';
import { DollarSign } from 'lucide-react';

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
      alert('Minimum price cannot be greater than maximum price');
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
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
        <DollarSign className="h-4 w-4" />
        <span>Price Range</span>
      </div>

      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <label className="block text-xs text-gray-600 mb-1">Min</label>
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            placeholder="0"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          />
        </div>

        <span className="text-gray-400 mt-5">-</span>

        <div className="flex-1">
          <label className="block text-xs text-gray-600 mb-1">Max</label>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            placeholder="200"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleApply}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Apply
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default PriceFilter;
