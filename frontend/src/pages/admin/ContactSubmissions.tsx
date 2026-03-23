import { useState, useEffect } from 'react';
import { Eye, X } from 'lucide-react';
import api from '../../config/axios';
import toast from 'react-hot-toast';

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  admin_notes: string;
  responded_at: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-600',
};

const ContactSubmissions = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [status, setStatus] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    loadSubmissions();
  }, [filterStatus]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const params = filterStatus ? `?status=${filterStatus}` : '';
      const res = await api.get(`/admin/contact_submissions${params}`);
      setSubmissions(res.data.data);
    } catch {
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const openSubmission = (submission: ContactSubmission) => {
    setSelected(submission);
    setAdminNotes(submission.admin_notes || '');
    setStatus(submission.status);
  };

  const handleUpdate = async () => {
    if (!selected) return;
    try {
      await api.patch(`/admin/contact_submissions/${selected.id}`, {
        contact_submission: { status, admin_notes: adminNotes },
      });
      toast.success('Updated successfully');
      setSelected(null);
      loadSubmissions();
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="heading-talkie">Contact Submissions</h1>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal text-sm"
        >
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto"></div>
        </div>
      ) : (
        <div className="card-talkie overflow-hidden">
          <table className="w-full">
            <thead className="bg-warmgray-100">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Subject</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Date</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-warmgray-500">No submissions found</td>
                </tr>
              ) : (
                submissions.map((s) => (
                  <tr key={s.id} className="border-t border-warmgray-200 hover:bg-warmgray-50">
                    <td className="p-4 font-medium">{s.name}</td>
                    <td className="p-4 text-sm text-warmgray-600">{s.email}</td>
                    <td className="p-4 text-sm">{s.subject}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[s.status] || 'bg-gray-100 text-gray-600'}`}>
                        {s.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-warmgray-500">
                      {new Date(s.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => openSubmission(s)} className="p-2 hover:bg-warmgray-100 rounded">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-warmgray-900">Submission Details</h2>
              <button onClick={() => setSelected(null)} className="p-1 hover:bg-warmgray-100 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <div><span className="font-semibold">Name:</span> {selected.name}</div>
              <div><span className="font-semibold">Email:</span> {selected.email}</div>
              {selected.phone && <div><span className="font-semibold">Phone:</span> {selected.phone}</div>}
              <div><span className="font-semibold">Subject:</span> {selected.subject}</div>
              <div>
                <span className="font-semibold">Message:</span>
                <p className="mt-1 text-warmgray-700 bg-warmgray-50 p-3 rounded-lg">{selected.message}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-warmgray-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal text-sm"
              >
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-warmgray-700 mb-1">Admin Notes</label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full px-3 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal text-sm"
                placeholder="Add internal notes..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setSelected(null)} className="btn-secondary-talkie flex-1">Cancel</button>
              <button onClick={handleUpdate} className="btn-primary-talkie flex-1">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactSubmissions;
