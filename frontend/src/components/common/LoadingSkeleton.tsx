export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl shadow-playful overflow-hidden animate-pulse">
      <div className="bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 h-48 w-full" />
      <div className="p-5">
        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-3/4 mb-3" />
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-full mb-4" />
        <div className="flex items-center gap-2 mb-3">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-24" />
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-24" />
          <div className="h-12 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const ProductDetailSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Image Gallery Skeleton */}
        <div>
          <div className="bg-gray-200 h-96 rounded-lg mb-4" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-20 rounded" />
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-6" />

          <div className="border-t border-b border-gray-200 py-4 mb-6">
            <div className="h-12 bg-gray-200 rounded w-32 mb-4" />
            <div className="h-12 bg-gray-200 rounded w-full" />
          </div>

          <div className="h-12 bg-gray-200 rounded w-full" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex space-x-4 border-b border-gray-200 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded w-24" />
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full" />
          ))}
        </div>
      </div>
    </div>
  );
};

export const FilterSidebarSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-6" />

      {[...Array(4)].map((_, i) => (
        <div key={i} className="mb-6">
          <div className="h-5 bg-gray-200 rounded w-1/2 mb-3" />
          <div className="space-y-2">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="h-4 bg-gray-200 rounded w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

interface LoadingSkeletonProps {
  count?: number;
  height?: number;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 3,
  height = 100,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="bg-gradient-to-r from-warmgray-200 via-warmgray-100 to-warmgray-200 rounded-2xl animate-pulse"
          style={{ height: `${height}px` }}
        />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
