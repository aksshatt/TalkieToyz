import { Baby } from 'lucide-react';

interface AgeRangeSelectorProps {
  selectedAge?: number;
  onAgeChange: (age: number | undefined) => void;
}

const ageRanges = [
  { label: 'All Ages', value: undefined },
  { label: '0-2 years', value: 1 },
  { label: '3-5 years', value: 4 },
  { label: '6-8 years', value: 7 },
  { label: '9-12 years', value: 10 },
  { label: '13+ years', value: 13 },
];

const AgeRangeSelector = ({ selectedAge, onAgeChange }: AgeRangeSelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
        <Baby className="h-4 w-4" />
        <span>Age Range</span>
      </div>

      <div className="space-y-2">
        {ageRanges.map((range) => (
          <label
            key={range.label}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <input
              type="radio"
              name="age-range"
              checked={selectedAge === range.value}
              onChange={() => onAgeChange(range.value)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
              {range.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default AgeRangeSelector;
