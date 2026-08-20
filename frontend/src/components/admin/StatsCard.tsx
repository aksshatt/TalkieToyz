import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  iconColor = 'text-teal',
}) => {
  return (
    <div className="card-talkie bg-white dark:bg-surface-dark-raised">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-warmgray-600 dark:text-warmgray-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-[var(--font-family-fun)] font-bold text-warmgray-800">
            {value}
          </p>
          {trend && (
            <p
              className={`text-sm font-medium mt-2 ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}% from last month
            </p>
          )}
        </div>
        <div className={`p-4 rounded-xl bg-teal-light/30`}>
          <Icon className={`h-8 w-8 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
