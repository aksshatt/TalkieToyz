import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ProgressLog } from '../../types/progress';

interface ProgressChartProps {
  logs: ProgressLog[];
  metricKey?: string;
}

const ProgressChart = ({ logs, metricKey = 'progress_score' }: ProgressChartProps) => {
  const chartData = logs
    .map(log => ({
      date: new Date(log.log_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: log.metrics?.[metricKey] || 0,
      name: log.child_name,
    }))
    .reverse();

  return (
    <div className="card-talkie p-6">
      <h3 className="font-[var(--font-family-fun)] font-bold text-xl text-warmgray-900 mb-6">
        Progress Over Time
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="date" stroke="#6B7280" />
          <YAxis stroke="#6B7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #10B981',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ fill: '#10B981', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
