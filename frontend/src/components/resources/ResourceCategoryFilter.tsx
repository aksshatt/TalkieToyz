import type { ResourceCategory } from '../../types/blog';

interface ResourceCategoryFilterProps {
  categories: ResourceCategory[];
  selectedId?: number;
  onSelect: (id?: number) => void;
}

const ResourceCategoryFilter = ({ categories, selectedId, onSelect }: ResourceCategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => onSelect(undefined)}
        className={`px-4 py-2 rounded-pill font-semibold transition-all ${
          selectedId === undefined
            ? 'bg-teal-gradient text-white shadow-soft'
            : 'bg-warmgray-100 text-warmgray-700 hover:bg-warmgray-200'
        }`}
      >
        All Categories
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`px-4 py-2 rounded-pill font-semibold transition-all ${
            selectedId === category.id
              ? 'bg-teal-gradient text-white shadow-soft'
              : 'bg-warmgray-100 text-warmgray-700 hover:bg-warmgray-200'
          }`}
          style={{
            backgroundColor: selectedId === category.id && category.color ? category.color : undefined,
          }}
        >
          {category.icon && <span className="mr-2">{category.icon}</span>}
          {category.name}
          <span className="ml-2 text-xs opacity-75">({category.resources_count})</span>
        </button>
      ))}
    </div>
  );
};

export default ResourceCategoryFilter;
