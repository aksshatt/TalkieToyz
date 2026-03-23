import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import authService from '../../services/authService';
import { validatePassword, validatePasswordConfirmation } from '../../utils/validation';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [formData, setFormData] = useState({ password: '', password_confirmation: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
    const confirmError = validatePasswordConfirmation(formData.password, formData.password_confirmation);
    if (confirmError) newErrors.password_confirmation = confirmError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!token) {
      setServerError('Invalid or missing reset token. Please request a new reset link.');
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await authService.confirmPasswordReset(token, formData.password, formData.password_confirmation);
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (error: any) {
      if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        setServerError(error.response.data.errors.join(', '));
      } else {
        setServerError('Failed to reset password. The link may have expired.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-warmgray-50">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-soft border border-warmgray-200 p-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-light rounded-full mb-6">
              <CheckCircle className="h-8 w-8 text-teal" />
            </div>
            <h2 className="text-2xl font-bold text-warmgray-900 mb-3">Password reset!</h2>
            <p className="text-warmgray-600 mb-8">
              Your password has been successfully updated. Redirecting to login...
            </p>
            <Link to="/login" className="btn-primary-talkie inline-block">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal via-teal-dark to-warmgray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal/90 via-teal-dark/80 to-warmgray-900/90"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-light/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-4">TalkieToys</h1>
            <div className="w-20 h-1 bg-white/50 rounded-full"></div>
          </div>
          <h2 className="text-3xl font-semibold mb-6">Create a new password</h2>
          <p className="text-lg text-white/80 leading-relaxed max-w-md">
            Choose a strong password to keep your TalkieToys account secure.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-bold text-teal">TalkieToys</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-warmgray-900 mb-2">New password</h2>
            <p className="text-warmgray-600">Choose a strong password for your account</p>
          </div>

          {!token && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-sm text-red-700">
                Invalid reset link.{' '}
                <Link to="/forgot-password" className="underline font-medium">
                  Request a new one
                </Link>
              </p>
            </div>
          )}

          {serverError && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-warmgray-700 mb-2">
                New password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-warmgray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-warmgray-300 focus:border-teal focus:ring-teal/20'
                  }`}
                  placeholder="At least 6 characters"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-warmgray-400 hover:text-warmgray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-warmgray-700 mb-2">
                Confirm new password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-warmgray-400" />
                </div>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.password_confirmation
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-warmgray-300 focus:border-teal focus:ring-teal/20'
                  }`}
                  placeholder="Re-enter your new password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-warmgray-400 hover:text-warmgray-600"
                >
                  {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="mt-2 text-sm text-red-600">{errors.password_confirmation}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !token}
              className="btn-primary-talkie w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/login" className="text-sm font-medium text-teal hover:text-teal-dark transition-colors">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
