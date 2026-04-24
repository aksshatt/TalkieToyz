import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail, validatePassword } from '../../utils/validation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, BookOpen, Sparkles, Brain, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const floatingIcons = [
  { Icon: BookOpen, top: '12%', left: '12%', delay: 0, size: 'w-7 h-7' },
  { Icon: Star, top: '65%', left: '8%', delay: 1.2, size: 'w-5 h-5' },
  { Icon: Sparkles, top: '28%', right: '12%', delay: 0.6, size: 'w-6 h-6' },
  { Icon: Brain, top: '72%', right: '14%', delay: 1.8, size: 'w-7 h-7' },
  { Icon: Heart, top: '45%', left: '22%', delay: 0.9, size: 'w-5 h-5' },
  { Icon: Star, top: '18%', right: '28%', delay: 2.1, size: 'w-4 h-4' },
];

const formVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, staggerChildren: 0.09 } },
} as const;

const fieldVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
} as const;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await login(formData);
      const userStr = localStorage.getItem('user');
      let user: { role?: string } | null = null;
      try {
        user = userStr ? JSON.parse(userStr) : null;
      } catch {
        user = null;
        localStorage.removeItem('user');
      }
      let redirectPath = '/';
      if (user?.role === 'admin') redirectPath = '/admin';
      else if (user?.role === 'therapist') redirectPath = '/therapist';
      else if (location.state?.from?.pathname) redirectPath = location.state.from.pathname;
      navigate(redirectPath, { replace: true });
    } catch (error: any) {
      if (error.response?.data?.message) setServerError(error.response.data.message);
      else if (error.response?.data?.errors) setServerError(error.response.data.errors.join(', '));
      else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout'))
        setServerError('Server is starting up, please wait a moment and try again.');
      else if (!error.response)
        setServerError('Cannot connect to server. Please check your connection and try again.');
      else setServerError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-teal-dark via-teal to-sky-dark">

        {/* Animated blobs */}
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-white/10 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '5%', left: '5%' }}
        />
        <motion.div
          className="absolute w-72 h-72 rounded-full bg-coral/25 blur-3xl"
          animate={{ x: [0, -25, 10, 0], y: [0, 30, -10, 0], scale: [1, 0.88, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ bottom: '10%', right: '5%' }}
        />
        <motion.div
          className="absolute w-56 h-56 rounded-full bg-sunshine/20 blur-2xl"
          animate={{ x: [0, 18, -12, 0], y: [0, -22, 14, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{ top: '42%', right: '18%' }}
        />
        <motion.div
          className="absolute w-40 h-40 rounded-full bg-teal-light/30 blur-2xl"
          animate={{ x: [0, -15, 0], y: [0, 18, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          style={{ bottom: '35%', left: '18%' }}
        />

        {/* Floating toy icons */}
        {floatingIcons.map(({ Icon, top, left, right, delay, size }, i) => (
          <motion.div
            key={i}
            className={`absolute text-white/20 ${size}`}
            style={{ top, left, right } as React.CSSProperties}
            animate={{ y: [0, -14, 0], rotate: [0, 6, -6, 0] }}
            transition={{ duration: 4 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay }}
          >
            <Icon className="w-full h-full" />
          </motion.div>
        ))}

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-8"
          >
            <h1 className="text-5xl font-[var(--font-family-fun)] font-bold mb-4 drop-shadow-lg">TalkieToys</h1>
            <motion.div
              className="h-1 bg-white/60 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </motion.div>

          <motion.h2
            className="text-3xl font-semibold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Welcome back
          </motion.h2>
          <motion.p
            className="text-lg text-white/80 leading-relaxed max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Sign in to access your personalized learning dashboard, track progress, and continue your speech development journey.
          </motion.p>

          <motion.div
            className="mt-12 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[
              'Professional speech therapy tools',
              'Track developmental progress',
              'Curated learning resources',
            ].map((text, i) => (
              <motion.div
                key={i}
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.12, duration: 0.4 }}
              >
                <div className="w-9 h-9 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white/90 font-medium">{text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gradient-to-br from-cream-light via-white to-teal-light/15 relative overflow-hidden">

        {/* Subtle bg dots */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-30"
            style={{
              width: 8 + i * 4,
              height: 8 + i * 4,
              background: ['#4DD0E1', '#FF85C0', '#FFD54F', '#4FC3F7', '#4DD0E1'][i],
              top: `${15 + i * 17}%`,
              right: `${3 + i * 2}%`,
            }}
            animate={{ y: [0, -10, 0], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
          />
        ))}

        <motion.div
          className="w-full max-w-md"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Mobile Logo */}
          <motion.div variants={fieldVariant} className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-[var(--font-family-fun)] font-bold text-teal">TalkieToys</h1>
          </motion.div>

          {/* Form Card */}
          <motion.div
            variants={fieldVariant}
            className="bg-white/80 backdrop-blur-md rounded-3xl shadow-soft-xl border border-white/60 p-8"
          >
            <div className="mb-7">
              <h2 className="text-3xl font-[var(--font-family-fun)] font-bold text-warmgray-900 mb-1">Sign in</h2>
              <p className="text-warmgray-500 text-sm">Enter your credentials to access your account</p>
            </div>

            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 bg-red-50 border-l-4 border-red-400 p-4 rounded-xl"
              >
                <p className="text-sm text-red-700">{serverError}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <motion.div variants={fieldVariant}>
                <label htmlFor="email" className="block text-sm font-semibold text-warmgray-700 mb-1.5">
                  Email address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-warmgray-400 group-focus-within:text-teal transition-colors" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 bg-warmgray-50 focus:bg-white ${
                      errors.email
                        ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                        : 'border-warmgray-200 focus:border-teal focus:ring-4 focus:ring-teal/10'
                    }`}
                    placeholder="you@example.com"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
              </motion.div>

              {/* Password */}
              <motion.div variants={fieldVariant}>
                <label htmlFor="password" className="block text-sm font-semibold text-warmgray-700 mb-1.5">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-warmgray-400 group-focus-within:text-teal transition-colors" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 bg-warmgray-50 focus:bg-white ${
                      errors.password
                        ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                        : 'border-warmgray-200 focus:border-teal focus:ring-4 focus:ring-teal/10'
                    }`}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword
                      ? <EyeOff className="h-5 w-5 text-warmgray-400 hover:text-teal transition-colors" />
                      : <Eye className="h-5 w-5 text-warmgray-400 hover:text-teal transition-colors" />
                    }
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
              </motion.div>

              {/* Remember & Forgot */}
              <motion.div variants={fieldVariant} className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="h-4 w-4 text-teal focus:ring-teal border-warmgray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-warmgray-600">
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-teal hover:text-coral transition-colors"
                >
                  Forgot password?
                </Link>
              </motion.div>

              {/* Submit */}
              <motion.div variants={fieldVariant}>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.97 }}
                  className="w-full bg-gradient-to-r from-teal to-teal-dark text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed shadow-soft-lg hover:shadow-soft-xl"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-warmgray-200" />
              <span className="text-xs text-warmgray-400 font-medium">New to TalkieToys?</span>
              <div className="flex-1 h-px bg-warmgray-200" />
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/signup"
                className="flex items-center justify-center w-full py-3 px-4 border-2 border-teal/30 text-teal font-semibold rounded-xl hover:bg-teal/5 hover:border-teal transition-all duration-200"
              >
                Create an account
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
