import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validateName,
} from '../../utils/validation';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, UserCheck, Stethoscope, Sparkles, BookOpen, Star, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const floatingIcons = [
  { Icon: BookOpen, top: '10%', left: '10%', delay: 0, size: 'w-7 h-7' },
  { Icon: Star, top: '60%', left: '6%', delay: 1.4, size: 'w-5 h-5' },
  { Icon: Sparkles, top: '25%', right: '10%', delay: 0.7, size: 'w-6 h-6' },
  { Icon: Heart, top: '70%', right: '12%', delay: 1.9, size: 'w-6 h-6' },
  { Icon: Star, top: '42%', left: '20%', delay: 1.0, size: 'w-4 h-4' },
  { Icon: UserCheck, top: '15%', right: '25%', delay: 2.2, size: 'w-5 h-5' },
];

const formVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, staggerChildren: 0.08 } },
} as const;

const fieldVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
} as const;

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
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
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const result = await signup(formData);
      if ((result as any)?.pending_approval) {
        setPendingApproval(true);
      } else {
        navigate('/', { replace: true });
      }
    } catch (error: any) {
      if (error.response?.data?.message) setServerError(error.response.data.message);
      else if (error.response?.data?.errors) setServerError(error.response.data.errors.join(', '));
      else setServerError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingApproval) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-light/20 via-white to-coral-light/20 p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-soft-xl p-10 max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-sunshine/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-sunshine-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
          <h2 className="text-2xl font-[var(--font-family-fun)] font-bold text-warmgray-900 mb-3">
            Application Submitted!
          </h2>
          <p className="text-warmgray-500 leading-relaxed mb-6">
            Your therapist account has been created and is pending admin approval. You'll receive an email once approved — usually within 1–2 business days.
          </p>
          <div className="bg-teal-light/10 rounded-2xl p-4 text-left space-y-3 mb-6">
            {[
              { step: '1', text: 'Admin reviews your registration' },
              { step: '2', text: 'You receive an approval email' },
              { step: '3', text: 'Log in to access your therapist dashboard' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-teal text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{step}</span>
                <p className="text-sm text-warmgray-700">{text}</p>
              </div>
            ))}
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <button onClick={() => navigate('/login')}
              className="w-full bg-teal-gradient text-white font-bold py-3 rounded-xl shadow-soft">
              Go to Login
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-coral-dark via-coral to-sunshine-dark">

        {/* Animated blobs */}
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-white/10 blur-3xl"
          animate={{ x: [0, 35, 0], y: [0, -28, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '5%', left: '5%' }}
        />
        <motion.div
          className="absolute w-72 h-72 rounded-full bg-teal/25 blur-3xl"
          animate={{ x: [0, -22, 10, 0], y: [0, 28, -12, 0], scale: [1, 0.9, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ bottom: '8%', right: '5%' }}
        />
        <motion.div
          className="absolute w-52 h-52 rounded-full bg-sunshine/25 blur-2xl"
          animate={{ x: [0, 16, -10, 0], y: [0, -20, 12, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{ top: '40%', right: '20%' }}
        />

        {/* Floating icons */}
        {floatingIcons.map(({ Icon, top, left, right, delay, size }, i) => (
          <motion.div
            key={i}
            className={`absolute text-white/20 ${size}`}
            style={{ top, left, right } as React.CSSProperties}
            animate={{ y: [0, -13, 0], rotate: [0, 7, -7, 0] }}
            transition={{ duration: 4 + i * 0.8, repeat: Infinity, ease: 'easeInOut', delay }}
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
            className="text-3xl font-semibold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Start your journey
          </motion.h2>
          <motion.p
            className="text-lg text-white/80 leading-relaxed max-w-md mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Join thousands of parents and therapists using TalkieToys to support speech and language development.
          </motion.p>

          <div className="space-y-4">
            {[
              {
                title: 'For Parents',
                emoji: '👨‍👩‍👧',
                items: ['Child-Friendly Learning Tools', 'Supports Speech & Language Development', 'Age-Appropriate Resources (1–8 yrs)'],
              },
              {
                title: 'For Therapists',
                emoji: '🩺',
                items: ['Evidence-Based Materials', 'Time-Saving Ready-to-Use Kits', 'Autism & Speech Friendly'],
              },
            ].map((card, ci) => (
              <motion.div
                key={ci}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + ci * 0.15, duration: 0.45 }}
              >
                <h3 className="font-bold text-base mb-2 flex items-center gap-2">
                  <span>{card.emoji}</span> {card.title}
                </h3>
                <ul className="space-y-1">
                  {card.items.map((item, ii) => (
                    <li key={ii} className="flex items-center gap-2 text-sm text-white/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 bg-gradient-to-br from-cream-light via-white to-coral-light/20 relative overflow-hidden">

        {/* Subtle bg dots */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-25"
            style={{
              width: 8 + i * 4,
              height: 8 + i * 4,
              background: ['#FF85C0', '#FFD54F', '#4DD0E1', '#FF85C0', '#4FC3F7'][i],
              top: `${12 + i * 18}%`,
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
          <motion.div variants={fieldVariant} className="lg:hidden mb-6 text-center">
            <h1 className="text-3xl font-[var(--font-family-fun)] font-bold text-coral">TalkieToys</h1>
          </motion.div>

          {/* Form Card */}
          <motion.div
            variants={fieldVariant}
            className="bg-white/80 backdrop-blur-md rounded-3xl shadow-soft-xl border border-white/60 p-8"
          >
            <div className="mb-6">
              <h2 className="text-3xl font-[var(--font-family-fun)] font-bold text-warmgray-900 mb-1">Create account</h2>
              <p className="text-warmgray-500 text-sm">Get started with your free account today</p>
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Account Type */}
              <motion.div variants={fieldVariant}>
                <label className="block text-sm font-semibold text-warmgray-700 mb-2">Account type</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { role: 'customer' as const, Icon: UserCheck, label: 'Parent', emoji: '👨‍👩‍👧' },
                    { role: 'therapist' as const, Icon: Stethoscope, label: 'Therapist', emoji: '🩺' },
                  ].map(({ role, Icon, label, emoji }) => (
                    <motion.button
                      key={role}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, role }))}
                      disabled={isLoading}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative p-4 border-2 rounded-2xl transition-all ${
                        formData.role === role
                          ? 'border-coral bg-coral/5 shadow-soft-md'
                          : 'border-warmgray-200 hover:border-coral/40 bg-warmgray-50'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl">{emoji}</span>
                        <Icon className={`h-5 w-5 ${formData.role === role ? 'text-coral' : 'text-warmgray-400'}`} />
                        <span className={`text-sm font-semibold ${formData.role === role ? 'text-coral' : 'text-warmgray-600'}`}>
                          {label}
                        </span>
                      </div>
                      {formData.role === role && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 w-5 h-5 bg-coral rounded-full flex items-center justify-center"
                        >
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Name */}
              <motion.div variants={fieldVariant}>
                <label htmlFor="name" className="block text-sm font-semibold text-warmgray-700 mb-1.5">Full name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-warmgray-400 group-focus-within:text-coral transition-colors" />
                  </div>
                  <input
                    type="text" id="name" name="name"
                    value={formData.name} onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 bg-warmgray-50 focus:bg-white ${
                      errors.name ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                        : 'border-warmgray-200 focus:border-coral focus:ring-4 focus:ring-coral/10'
                    }`}
                    placeholder="John Doe" disabled={isLoading}
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </motion.div>

              {/* Email */}
              <motion.div variants={fieldVariant}>
                <label htmlFor="email" className="block text-sm font-semibold text-warmgray-700 mb-1.5">Email address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-warmgray-400 group-focus-within:text-coral transition-colors" />
                  </div>
                  <input
                    type="email" id="email" name="email"
                    value={formData.email} onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 bg-warmgray-50 focus:bg-white ${
                      errors.email ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                        : 'border-warmgray-200 focus:border-coral focus:ring-4 focus:ring-coral/10'
                    }`}
                    placeholder="you@example.com" disabled={isLoading}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </motion.div>

              {/* Password */}
              <motion.div variants={fieldVariant}>
                <label htmlFor="password" className="block text-sm font-semibold text-warmgray-700 mb-1.5">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-warmgray-400 group-focus-within:text-coral transition-colors" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password" name="password"
                    value={formData.password} onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 bg-warmgray-50 focus:bg-white ${
                      errors.password ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                        : 'border-warmgray-200 focus:border-coral focus:ring-4 focus:ring-coral/10'
                    }`}
                    placeholder="At least 6 characters" disabled={isLoading}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    {showPassword ? <EyeOff className="h-5 w-5 text-warmgray-400 hover:text-coral transition-colors" />
                      : <Eye className="h-5 w-5 text-warmgray-400 hover:text-coral transition-colors" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
              </motion.div>

              {/* Confirm Password */}
              <motion.div variants={fieldVariant}>
                <label htmlFor="password_confirmation" className="block text-sm font-semibold text-warmgray-700 mb-1.5">Confirm password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-warmgray-400 group-focus-within:text-coral transition-colors" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="password_confirmation" name="password_confirmation"
                    value={formData.password_confirmation} onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 bg-warmgray-50 focus:bg-white ${
                      errors.password_confirmation ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                        : 'border-warmgray-200 focus:border-coral focus:ring-4 focus:ring-coral/10'
                    }`}
                    placeholder="Re-enter your password" disabled={isLoading}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    {showConfirmPassword ? <EyeOff className="h-5 w-5 text-warmgray-400 hover:text-coral transition-colors" />
                      : <Eye className="h-5 w-5 text-warmgray-400 hover:text-coral transition-colors" />}
                  </button>
                </div>
                {errors.password_confirmation && <p className="mt-1 text-xs text-red-600">{errors.password_confirmation}</p>}
              </motion.div>

              {/* Terms */}
              <motion.div variants={fieldVariant} className="flex items-start">
                <input id="terms" name="terms" type="checkbox" required
                  className="h-4 w-4 text-coral focus:ring-coral border-warmgray-300 rounded mt-0.5"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-warmgray-500">
                  I agree to the{' '}
                  <Link to="/terms" className="text-coral hover:text-coral-dark font-semibold">Terms</Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-coral hover:text-coral-dark font-semibold">Privacy Policy</Link>
                </label>
              </motion.div>

              {/* Submit */}
              <motion.div variants={fieldVariant}>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.97 }}
                  className="w-full bg-gradient-to-r from-coral to-coral-dark text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed shadow-soft-lg hover:shadow-soft-xl"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    <>Create account <ArrowRight className="ml-2 h-5 w-5" /></>
                  )}
                </motion.button>
              </motion.div>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-warmgray-200" />
              <span className="text-xs text-warmgray-400 font-medium">Already have an account?</span>
              <div className="flex-1 h-px bg-warmgray-200" />
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/login"
                className="flex items-center justify-center w-full py-3 px-4 border-2 border-warmgray-200 text-warmgray-600 font-semibold rounded-xl hover:bg-warmgray-50 hover:border-warmgray-300 transition-all duration-200"
              >
                Sign in instead
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
