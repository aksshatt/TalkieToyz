import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

const SearchBar = ({
  onSearch,
  placeholder = 'Search products...',
  debounceMs = 500
}: SearchBarProps) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, onSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-purple-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 border-3 border-purple-300 rounded-full focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none transition-all font-medium text-gray-700 placeholder-gray-400 bg-white shadow-md hover:shadow-lg"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-all hover:scale-110 active:scale-95"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
