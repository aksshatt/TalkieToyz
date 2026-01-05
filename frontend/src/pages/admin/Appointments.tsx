import { useState, useEffect } from 'react';
import { Calendar, Filter, Mail, Phone, MessageCircle } from 'lucide-react';
import { appointmentService } from '../../services/appointmentService';
import toast from 'react-hot-toast';
import type { Appointment } from '../../types/appointment';

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [languageFilter, setLanguageFilter] = useState<string>('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, [statusFilter, languageFilter]);

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await appointmentService.getAppointments({
        status: statusFilter || undefined,
        language: languageFilter || undefined,
      });
      if (response.success) {
        setAppointments(response.data);
      }
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId: number, newStatus: string) => {
    try {
      const response = await appointmentService.updateAppointment(appointmentId, { status: newStatus as any });
      if (response.success) {
        toast.success('Appointment status updated successfully');
        loadAppointments();
        if (selectedAppointment?.id === appointmentId) {
          setSelectedAppointment(response.data);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-sunshine text-warmgray-900';
      case 'confirmed':
        return 'bg-teal text-white';
      case 'completed':
        return 'bg-warmgray-500 text-white';
      case 'cancelled':
        return 'bg-coral text-white';
      default:
        return 'bg-warmgray-300 text-warmgray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-warmgray-800">Appointments</h1>
          <p className="text-warmgray-600 mt-1">Manage appointment requests for online therapy</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-soft-lg p-4">
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-warmgray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-warmgray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="px-4 py-2 border border-warmgray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal"
          >
            <option value="">All Languages</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Marathi">Marathi</option>
            <option value="Odia">Odia</option>
            <option value="Konkani">Konkani</option>
            <option value="Gujarati">Gujarati</option>
          </select>
        </div>
      </div>

      {/* Appointments List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto"></div>
          <p className="mt-4 text-warmgray-600">Loading appointments...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-soft-lg p-12 text-center">
          <Calendar className="h-16 w-16 text-warmgray-300 mx-auto mb-4" />
          <p className="text-warmgray-600">No appointments found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-soft-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-warmgray-50 border-b border-warmgray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-warmgray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-warmgray-700 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-warmgray-700 uppercase tracking-wider">
                  Language
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-warmgray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-warmgray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-warmgray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmgray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-warmgray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-warmgray-900">{appointment.name}</div>
                    {appointment.user_name && (
                      <div className="text-xs text-warmgray-500">User: {appointment.user_name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center gap-2 text-warmgray-600">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${appointment.email}`} className="hover:text-teal">
                          {appointment.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-warmgray-600">
                        <Phone className="h-4 w-4" />
                        <a href={`tel:${appointment.phone}`} className="hover:text-teal">
                          {appointment.phone}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-warmgray-900">{appointment.preferred_language}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={appointment.status}
                      onChange={(e) => handleStatusUpdate(appointment.id, e.target.value)}
                      className={`px-3 py-1 rounded-pill text-xs font-semibold ${getStatusColor(appointment.status)} border-0 cursor-pointer`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-warmgray-600">
                    {formatDate(appointment.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setShowDetailModal(true);
                      }}
                      className="text-teal hover:text-teal-dark font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedAppointment && (
        <div className="fixed inset-0 bg-warmgray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-soft-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-warmgray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-[var(--font-family-fun)] font-bold text-2xl text-warmgray-900">
                  Appointment Details
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-warmgray-500 hover:text-warmgray-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-warmgray-700 mb-1">Name</label>
                <p className="text-warmgray-900">{selectedAppointment.name}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-warmgray-700 mb-1">Email</label>
                <a href={`mailto:${selectedAppointment.email}`} className="text-teal hover:underline">
                  {selectedAppointment.email}
                </a>
              </div>

              <div>
                <label className="block text-sm font-semibold text-warmgray-700 mb-1">Phone</label>
                <a href={`tel:${selectedAppointment.phone}`} className="text-teal hover:underline">
                  {selectedAppointment.phone}
                </a>
              </div>

              <div>
                <label className="block text-sm font-semibold text-warmgray-700 mb-1">Preferred Language</label>
                <p className="text-warmgray-900">{selectedAppointment.preferred_language}</p>
              </div>

              {selectedAppointment.message && (
                <div>
                  <label className="block text-sm font-semibold text-warmgray-700 mb-1">Message</label>
                  <div className="bg-warmgray-50 rounded-xl p-4">
                    <p className="text-warmgray-900 whitespace-pre-wrap">{selectedAppointment.message}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-warmgray-700 mb-1">Status</label>
                <select
                  value={selectedAppointment.status}
                  onChange={(e) => handleStatusUpdate(selectedAppointment.id, e.target.value)}
                  className={`px-4 py-2 rounded-pill text-sm font-semibold ${getStatusColor(selectedAppointment.status)} border-0 cursor-pointer`}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-warmgray-700 mb-1">Submitted On</label>
                <p className="text-warmgray-900">{formatDate(selectedAppointment.created_at)}</p>
              </div>

              {selectedAppointment.user_name && (
                <div>
                  <label className="block text-sm font-semibold text-warmgray-700 mb-1">User Account</label>
                  <p className="text-warmgray-900">{selectedAppointment.user_name}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-warmgray-200">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full btn-primary px-6 py-3"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
