import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validateName,
} from '../../utils/validation';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'customer' as 'customer' | 'therapist',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string>('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    const confirmError = validatePasswordConfirmation(
      formData.password,
      formData.password_confirmation
    );
    if (confirmError) newErrors.password_confirmation = confirmError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await signup(formData);
      navigate('/', { replace: true });
    } catch (error: any) {
      console.error('Signup error:', error);

      if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        setServerError(error.response.data.errors.join(', '));
      } else {
        setServerError('Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-[var(--font-family-fun)] font-bold text-warmgray-800 mb-2">
            Join TalkieToys!
          </h1>
          <p className="text-warmgray-600">Start your speech learning adventure</p>
        </div>

        {/* Signup Form */}
        <div className="card-talkie shadow-soft-xl">
          {serverError && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-2xl p-4">
              <p className="text-coral text-sm font-medium">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-warmgray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                  errors.name
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-warmgray-200 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-200`}
                placeholder="Your full name"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-coral font-medium">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-warmgray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                  errors.email
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-warmgray-200 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-200`}
                placeholder="your.email@example.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-coral font-medium">{errors.email}</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-bold text-warmgray-700 mb-3">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'customer' }))}
                  className={`py-4 px-4 rounded-xl border-2 font-medium transition-all ${
                    formData.role === 'customer'
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                      : 'border-warmgray-200 text-warmgray-600 hover:border-blue-300'
                  }`}
                  disabled={isLoading}
                >
                  <div className="text-3xl mb-2">👨‍👩‍👧‍👦</div>
                  <div className="text-sm">Parent</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'therapist' }))}
                  className={`py-4 px-4 rounded-xl border-2 font-medium transition-all ${
                    formData.role === 'therapist'
                      ? 'border-teal-500 bg-purple-50 text-purple-700 shadow-md'
                      : 'border-warmgray-200 text-warmgray-600 hover:border-teal-300'
                  }`}
                  disabled={isLoading}
                >
                  <div className="text-3xl mb-2">👨‍⚕️</div>
                  <div className="text-sm">Therapist</div>
                </button>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-warmgray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                  errors.password
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-warmgray-200 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-200`}
                placeholder="At least 6 characters"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="mt-2 text-sm text-coral font-medium">{errors.password}</p>
              )}
            </div>

            {/* Password Confirmation Field */}
            <div>
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-bold text-warmgray-700 mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                  errors.password_confirmation
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-warmgray-200 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-200`}
                placeholder="Re-enter your password"
                disabled={isLoading}
              />
              {errors.password_confirmation && (
                <p className="mt-2 text-sm text-coral font-medium">
                  {errors.password_confirmation}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-gradient text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-warmgray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
