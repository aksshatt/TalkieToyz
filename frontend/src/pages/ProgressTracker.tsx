import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp } from 'lucide-react';
import ProgressLogCard from '../components/progress/ProgressLogCard';
import ProgressChart from '../components/progress/ProgressChart';
import { progressService } from '../services/progressService';
import type { ProgressLog, ProgressSummary } from '../types/progress';

const ProgressTracker = () => {
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [childName, setChildName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const response = await progressService.getProgressLogs();
      setLogs(response.data);
      if (response.data.length > 0) {
        const firstChildName = response.data[0].child_name;
        setChildName(firstChildName);
        loadSummary(firstChildName);
      }
    } catch (err) {
      console.error('Failed to load logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async (name: string) => {
    try {
      const response = await progressService.getProgressSummary(name);
      setSummary(response.data);
    } catch (err) {
      console.error('Failed to load summary:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this log?')) {
      try {
        await progressService.deleteProgressLog(id);
        loadLogs();
      } catch (err) {
        console.error('Failed to delete log:', err);
      }
    }
  };

  const handleExportPDF = async () => {
    if (childName) {
      try {
        const blob = await progressService.exportPDF(childName);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `progress_report_${childName}.pdf`;
        a.click();
      } catch (err) {
        console.error('Failed to export PDF:', err);
      }
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-cream-light py-12">
        <div className="container-talkie">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="heading-talkie mb-2">Progress Tracker</h1>
              <p className="text-warmgray-600">Track your child's speech development journey</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleExportPDF} className="btn-secondary-talkie">
                Export PDF
              </button>
              <Link to="/progress/log/new" className="btn-primary-talkie flex items-center gap-2">
                <Plus className="h-5 w-5" />
                New Log
              </Link>
            </div>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto"></div>
            </div>
          ) : (
            <>
              {logs.length > 0 && (
                <div className="mb-8">
                  <ProgressChart logs={logs} />
                </div>
              )}
              {summary && (
                <div className="card-talkie p-6 mb-8">
                  <h2 className="font-[var(--font-family-fun)] font-bold text-2xl mb-4 flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-teal" />
                    Summary for {childName}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-teal-light/30 rounded-lg">
                      <div className="text-3xl font-bold text-teal mb-1">{summary.total_logs}</div>
                      <div className="text-sm text-warmgray-600">Total Logs</div>
                    </div>
                    {Object.entries(summary.categories).slice(0, 3).map(([category, data]) => (
                      <div key={category} className="text-center p-4 bg-warmgray-100 rounded-lg">
                        <div className="text-2xl font-bold text-warmgray-900 mb-1">{data.count}</div>
                        <div className="text-xs text-warmgray-600">{category.replace(/_/g, ' ')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {logs.map((log) => (
                  <ProgressLogCard key={log.id} log={log} onDelete={handleDelete} />
                ))}
              </div>
              {logs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-warmgray-600 mb-4">No progress logs yet. Start tracking your child's development!</p>
                  <Link to="/progress/log/new" className="btn-primary-talkie inline-flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create First Log
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProgressTracker;
