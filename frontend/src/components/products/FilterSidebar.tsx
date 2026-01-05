import { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  const allCategories = categoriesData?.data || [];
  const speechGoals = speechGoalsData?.data || [];

  // Filter only top-level categories (parent_id is null)
  const categories = allCategories.filter(cat => cat.parent_id === null);

  const isLoading = categoriesLoading || speechGoalsLoading;

  const handleCategoryChange = (categoryId: number | undefined) => {
    onFiltersChange({ ...filters, category_id: categoryId, page: 1 });
  };

  const toggleCategoryExpand = (categoryId: number) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
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
    <div className="card-talkie p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-warmgray-200">
        <h2 className="font-[var(--font-family-fun)] text-lg font-bold text-warmgray-900">Filters</h2>
        {isMobile && (
          <button
            onClick={onClose}
            className="text-warmgray-500 hover:text-warmgray-700 p-1.5 rounded-lg hover:bg-warmgray-100 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Clear All Button */}
      <button
        onClick={handleClearAll}
        className="w-full mb-6 text-sm font-semibold text-teal bg-teal-light/30 rounded-xl py-2.5 hover:bg-teal-light/50 border-2 border-teal transition-all"
      >
        Clear All Filters
      </button>

      {/* Quick Toggles */}
      <div className="space-y-2 mb-6 pb-6 border-b border-warmgray-200">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={!!filters.in_stock}
            onChange={handleInStockToggle}
            className="w-4 h-4 text-teal border-warmgray-300 rounded focus:ring-teal"
          />
          <span className="text-sm text-warmgray-700 group-hover:text-teal transition-colors font-medium">
            In Stock Only
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={!!filters.featured}
            onChange={handleFeaturedToggle}
            className="w-4 h-4 text-teal border-warmgray-300 rounded focus:ring-teal"
          />
          <span className="text-sm text-warmgray-700 group-hover:text-teal transition-colors font-medium">
            Featured Products
          </span>
        </label>
      </div>

      {/* Categories */}
      <div className="mb-6 pb-6 border-b border-warmgray-200">
        <h3 className="text-sm font-semibold text-warmgray-900 mb-3">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="category"
              checked={!filters.category_id}
              onChange={() => handleCategoryChange(undefined)}
              className="w-4 h-4 text-teal border-warmgray-300 focus:ring-teal"
            />
            <span className="text-sm text-warmgray-700 group-hover:text-teal transition-colors font-medium">
              All Categories
            </span>
          </label>

          {categories.map((category) => {
            const hasSubcategories = category.subcategories && category.subcategories.length > 0;
            const isExpanded = expandedCategories.includes(category.id);

            return (
              <div key={category.id}>
                {/* Parent Category */}
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer group flex-1">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category_id === category.id}
                      onChange={() => handleCategoryChange(category.id)}
                      className="w-4 h-4 text-teal border-warmgray-300 focus:ring-teal"
                    />
                    <span className="text-sm text-warmgray-700 group-hover:text-teal transition-colors font-medium">
                      {category.name}
                    </span>
                  </label>

                  {hasSubcategories && (
                    <button
                      onClick={() => toggleCategoryExpand(category.id)}
                      className="p-1 hover:bg-warmgray-100 rounded transition-colors"
                      aria-label={isExpanded ? 'Collapse subcategories' : 'Expand subcategories'}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-warmgray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-warmgray-500" />
                      )}
                    </button>
                  )}
                </div>

                {/* Subcategories */}
                {hasSubcategories && isExpanded && (
                  <div className="ml-6 mt-2 space-y-2 border-l-2 border-warmgray-200 pl-3">
                    {category.subcategories?.map((subcat) => (
                      <label
                        key={subcat.id}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="category"
                          checked={filters.category_id === subcat.id}
                          onChange={() => handleCategoryChange(subcat.id)}
                          className="w-4 h-4 text-teal border-warmgray-300 focus:ring-teal"
                        />
                        <span className="text-sm text-warmgray-600 group-hover:text-teal transition-colors">
                          {subcat.name}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Age Range */}
      <div className="mb-6 pb-6 border-b border-warmgray-200">
        <AgeRangeSelector
          selectedAge={filters.age}
          onAgeChange={handleAgeChange}
        />
      </div>

      {/* Price Range */}
      <div className="mb-6 pb-6 border-b border-warmgray-200">
        <PriceFilter
          minPrice={filters.min_price}
          maxPrice={filters.max_price}
          onPriceChange={handlePriceChange}
        />
      </div>

      {/* Speech Goals */}
      <div>
        <h3 className="text-sm font-semibold text-warmgray-900 mb-3">Speech Goals</h3>
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
                className="w-4 h-4 text-teal border-warmgray-300 rounded focus:ring-teal"
              />
              <span className="text-sm text-warmgray-700 group-hover:text-teal transition-colors font-medium">
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
