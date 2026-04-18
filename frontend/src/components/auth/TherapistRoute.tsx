import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface TherapistRouteProps {
  children: React.ReactNode;
}

const TherapistRoute: React.FC<TherapistRouteProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warmgray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal mx-auto mb-4"></div>
          <p className="text-warmgray-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'therapist') return <Navigate to="/" replace />;

  if (user.approval_status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-light/20 to-sky-light/20 p-6">
        <div className="bg-white rounded-3xl shadow-soft-xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-sunshine/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-sunshine" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-[var(--font-family-fun)] font-bold text-warmgray-900 mb-3">
            Approval Pending
          </h2>
          <p className="text-warmgray-500 leading-relaxed mb-6">
            Your therapist account is awaiting admin approval. You'll receive an email once approved. This usually takes 1–2 business days.
          </p>
          <div className="bg-teal-light/20 rounded-2xl p-4 text-left space-y-2">
            <p className="text-sm font-semibold text-teal">What happens next?</p>
            <ul className="space-y-1.5">
              {['Admin reviews your registration', 'You receive an approval email', 'Log back in to access your dashboard'].map((s, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-warmgray-600">
                  <span className="w-5 h-5 rounded-full bg-teal text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (user.approval_status === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warmgray-50 p-6">
        <div className="bg-white rounded-3xl shadow-soft-xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-coral-light/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-[var(--font-family-fun)] font-bold text-warmgray-900 mb-3">
            Application Not Approved
          </h2>
          <p className="text-warmgray-500 leading-relaxed">
            Unfortunately your therapist application was not approved. Please contact support for more information.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default TherapistRoute;
