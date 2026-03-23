import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import authService from '../../services/authService';
import { validateEmail } from '../../utils/validation';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsLoading(true);

    try {
      await authService.requestPasswordReset(email);
      setIsSuccess(true);
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to send reset email. Please try again.');
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
            <h2 className="text-2xl font-bold text-warmgray-900 mb-3">Check your email</h2>
            <p className="text-warmgray-600 mb-2">
              We've sent reset instructions to
            </p>
            <p className="font-semibold text-teal mb-6">{email}</p>
            <p className="text-sm text-warmgray-500 mb-8">
              Didn't receive it? Check your spam folder. The link expires in 6 hours.
            </p>
            <Link
              to="/login"
              className="btn-primary-talkie inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
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
          <h2 className="text-3xl font-semibold mb-6">Forgot your password?</h2>
          <p className="text-lg text-white/80 leading-relaxed max-w-md">
            No worries! Enter your email address and we'll send you instructions to reset your password.
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
            <h2 className="text-3xl font-bold text-warmgray-900 mb-2">Reset password</h2>
            <p className="text-warmgray-600">Enter your email and we'll send you a reset link</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-warmgray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-warmgray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    error
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-warmgray-300 focus:border-teal focus:ring-teal/20'
                  }`}
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary-talkie w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                'Send Reset Instructions'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-teal hover:text-teal-dark transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
