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
  /** hex color for the icon chip + shelf-label tag */
  accent?: string;
  /** real historical values only — omit rather than fabricate a trend line */
  sparkline?: number[];
}

const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  if (data.length < 2) return null;
  const w = 100;
  const h = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-7 mt-3" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  iconColor = 'text-teal',
  accent = '#26C6DA',
  sparkline,
}) => {
  return (
    <div className="relative card-talkie bg-white dark:bg-surface-dark-raised mt-2">
      <span className="bin-label" style={{ backgroundColor: accent }}>
        {title}
      </span>
      <div className="flex items-center justify-between pt-1">
        <div className="flex-1 min-w-0">
          <p className="data-numeral text-3xl font-bold text-warmgray-900 dark:text-warmgray-100">
            {value}
          </p>
          {trend && (
            <p
              className={`data-numeral text-sm font-medium mt-2 ${
                trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}% from last month
            </p>
          )}
          {sparkline && <Sparkline data={sparkline} color={accent} />}
        </div>
        <div className="p-4 rounded-xl bg-teal-light/30 dark:bg-white/5 flex-shrink-0 ml-3">
          <Icon className={`h-8 w-8 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
