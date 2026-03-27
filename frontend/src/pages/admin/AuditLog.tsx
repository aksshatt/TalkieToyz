import { useState, useEffect } from 'react';
import { Shield, Search, Filter } from 'lucide-react';
import axios from '../../config/axios';
import toast from 'react-hot-toast';

interface ActivityLog {
  id: number;
  action: string;
  resource_type: string;
  resource_id: number;
  details: Record<string, any>;
  user_id: number;
  user_name: string;
  created_at: string;
}

const AuditLog = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    loadLogs();
  }, [page, actionFilter]);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), per_page: '25' });
      if (actionFilter) params.append('action', actionFilter);
      if (search) params.append('q', search);
      const response = await axios.get(`/admin/activity_logs?${params}`);
      if (response.data.success) {
        setLogs(response.data.data);
        setMeta(response.data.meta);
      }
    } catch {
      toast.error('Failed to load audit log');
    } finally {
      setIsLoading(false);
    }
  };

  const actionColor = (action: string) => {
    switch (action) {
      case 'create': return 'bg-green-100 text-green-700';
      case 'update': return 'bg-blue-100 text-blue-700';
      case 'delete': return 'bg-red-100 text-red-700';
      default: return 'bg-warmgray-100 text-warmgray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-7 w-7 text-teal" />
        <div>
          <h1 className="text-3xl font-bold text-warmgray-800">Audit Log</h1>
          <p className="text-warmgray-600 text-sm">Track all admin actions in the system</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card-talkie p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warmgray-400" />
          <input
            type="text"
            placeholder="Search resource type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadLogs()}
            className="w-full pl-9 pr-4 py-2 border-2 border-warmgray-200 rounded-lg text-sm focus:border-teal focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-warmgray-500" />
          <select
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 border-2 border-warmgray-200 rounded-lg text-sm focus:border-teal focus:outline-none"
          >
            <option value="">All Actions</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto"></div>
        </div>
      ) : logs.length === 0 ? (
        <div className="card-talkie p-12 text-center text-warmgray-500">No activity logs found.</div>
      ) : (
        <div className="card-talkie overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-warmgray-50 border-b-2 border-warmgray-200">
                <th className="text-left px-4 py-3 font-semibold text-warmgray-700">Action</th>
                <th className="text-left px-4 py-3 font-semibold text-warmgray-700">Resource</th>
                <th className="text-left px-4 py-3 font-semibold text-warmgray-700">Details</th>
                <th className="text-left px-4 py-3 font-semibold text-warmgray-700">Admin</th>
                <th className="text-left px-4 py-3 font-semibold text-warmgray-700">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmgray-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-warmgray-50">
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${actionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-warmgray-800">{log.resource_type}</div>
                    <div className="text-xs text-warmgray-400">ID: {log.resource_id}</div>
                  </td>
                  <td className="px-4 py-3 text-warmgray-600 max-w-[200px] truncate text-xs">
                    {JSON.stringify(log.details)}
                  </td>
                  <td className="px-4 py-3 text-warmgray-600">{log.user_name || `User #${log.user_id}`}</td>
                  <td className="px-4 py-3 text-warmgray-500 text-xs whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {meta && meta.total_pages > 1 && (
            <div className="px-4 py-3 border-t border-warmgray-100 flex items-center justify-between">
              <p className="text-sm text-warmgray-500">Page {page} of {meta.total_pages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-3 py-1 text-sm border border-warmgray-200 rounded-lg disabled:opacity-40 hover:bg-warmgray-50">
                  Previous
                </button>
                <button onClick={() => setPage(p => Math.min(meta.total_pages, p + 1))} disabled={page === meta.total_pages}
                  className="px-3 py-1 text-sm border border-warmgray-200 rounded-lg disabled:opacity-40 hover:bg-warmgray-50">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuditLog;
