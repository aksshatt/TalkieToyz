import React, { useEffect } from 'react';
import {
  getAllStateNames,
  getCitiesForState,
} from '../../data/indianStatesAndCities';

interface StateCitySelectorProps {
  stateValue: string;
  cityValue: string;
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
  stateError?: string;
  cityError?: string;
  stateTouched?: boolean;
  cityTouched?: boolean;
  disabled?: boolean;
}

const StateCitySelector: React.FC<StateCitySelectorProps> = ({
  stateValue,
  cityValue,
  onStateChange,
  onCityChange,
  stateError,
  cityError,
  stateTouched,
  cityTouched,
  disabled = false,
}) => {
  const states = getAllStateNames();
  const cities = stateValue ? getCitiesForState(stateValue) : [];

  // Reset city when state changes
  useEffect(() => {
    if (stateValue && cityValue) {
      const availableCities = getCitiesForState(stateValue);
      if (!availableCities.includes(cityValue)) {
        onCityChange('');
      }
    }
  }, [stateValue, cityValue, onCityChange]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStateChange(e.target.value);
    onCityChange(''); // Reset city when state changes
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCityChange(e.target.value);
  };

  return (
    <>
      {/* State Dropdown */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          State *
        </label>
        <select
          value={stateValue}
          onChange={handleStateChange}
          disabled={disabled}
          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
            stateTouched && stateError
              ? 'border-red-300 focus:border-red-500'
              : 'border-gray-200 focus:border-purple-500'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        {stateTouched && stateError && (
          <p className="text-red-600 text-sm mt-1">{stateError}</p>
        )}
      </div>

      {/* City Dropdown */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          City *
        </label>
        <select
          value={cityValue}
          onChange={handleCityChange}
          disabled={disabled || !stateValue}
          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
            cityTouched && cityError
              ? 'border-red-300 focus:border-red-500'
              : 'border-gray-200 focus:border-purple-500'
          } ${
            disabled || !stateValue ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
          }`}
        >
          <option value="">
            {stateValue ? 'Select City' : 'Select State First'}
          </option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        {cityTouched && cityError && (
          <p className="text-red-600 text-sm mt-1">{cityError}</p>
        )}
      </div>
    </>
  );
};

export default StateCitySelector;
