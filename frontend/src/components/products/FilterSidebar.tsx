import { X } from 'lucide-react';
import { useCategories, useSpeechGoals } from '../../hooks/useProducts';
import PriceFilter from './PriceFilter';
import AgeRangeSelector from './AgeRangeSelector';
import { FilterSidebarSkeleton } from '../common/LoadingSkeleton';
import type { ProductFilters } from '../../types/product';

interface FilterSidebarProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

const FilterSidebar = ({
  filters,
  onFiltersChange,
  onClose,
  isMobile = false
}: FilterSidebarProps) => {
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: speechGoalsData, isLoading: speechGoalsLoading } = useSpeechGoals();

  const categories = categoriesData?.data || [];
  const speechGoals = speechGoalsData?.data || [];

  const isLoading = categoriesLoading || speechGoalsLoading;

  const handleCategoryChange = (categoryId: number | undefined) => {
    onFiltersChange({ ...filters, category_id: categoryId, page: 1 });
  };

  const handleAgeChange = (age: number | undefined) => {
    onFiltersChange({ ...filters, age, page: 1 });
  };

  const handlePriceChange = (min: number | undefined, max: number | undefined) => {
    onFiltersChange({ ...filters, min_price: min, max_price: max, page: 1 });
  };

  const handleSpeechGoalToggle = (goalId: number) => {
    const currentGoals = filters.speech_goal_ids
      ? filters.speech_goal_ids.split(',').map(Number)
      : [];

    const newGoals = currentGoals.includes(goalId)
      ? currentGoals.filter(id => id !== goalId)
      : [...currentGoals, goalId];

    onFiltersChange({
      ...filters,
      speech_goal_ids: newGoals.length > 0 ? newGoals.join(',') : undefined,
      page: 1
    });
  };

  const handleInStockToggle = () => {
    onFiltersChange({
      ...filters,
      in_stock: filters.in_stock ? undefined : true,
      page: 1
    });
  };

  const handleFeaturedToggle = () => {
    onFiltersChange({
      ...filters,
      featured: filters.featured ? undefined : true,
      page: 1
    });
  };

  const handleClearAll = () => {
    onFiltersChange({
      page: 1,
      per_page: filters.per_page
    });
  };

  if (isLoading) {
    return <FilterSidebarSkeleton />;
  }

  const selectedSpeechGoals = filters.speech_goal_ids
    ? filters.speech_goal_ids.split(',').map(Number)
    : [];

  return (
    <div className="bg-white rounded-3xl shadow-playful p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🔍</span>
          <h2 className="text-2xl font-[var(--font-family-fun)] font-bold text-gray-900">Filters</h2>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-all"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Clear All Button */}
      <button
        onClick={handleClearAll}
        className="w-full mb-6 text-sm font-bold text-white bg-gradient-to-r from-red-400 to-pink-400 rounded-full py-3 hover:from-red-500 hover:to-pink-500 shadow-md hover:shadow-lg transition-all transform hover:scale-105"
      >
        🔄 Clear All Filters
      </button>

      {/* Quick Toggles */}
      <div className="space-y-2 mb-6 pb-6 border-b border-gray-200">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={!!filters.in_stock}
            onChange={handleInStockToggle}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
            In Stock Only
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={!!filters.featured}
            onChange={handleFeaturedToggle}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
            Featured Products
          </span>
        </label>
      </div>

      {/* Categories */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="category"
              checked={!filters.category_id}
              onChange={() => handleCategoryChange(undefined)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
              All Categories
            </span>
          </label>

          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="category"
                checked={filters.category_id === category.id}
                onChange={() => handleCategoryChange(category.id)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                {category.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Age Range */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <AgeRangeSelector
          selectedAge={filters.age}
          onAgeChange={handleAgeChange}
        />
      </div>

      {/* Price Range */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <PriceFilter
          minPrice={filters.min_price}
          maxPrice={filters.max_price}
          onPriceChange={handlePriceChange}
        />
      </div>

      {/* Speech Goals */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Speech Goals</h3>
        <div className="space-y-2">
          {speechGoals.map((goal) => (
            <label
              key={goal.id}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedSpeechGoals.includes(goal.id)}
                onChange={() => handleSpeechGoalToggle(goal.id)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                {goal.name}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
