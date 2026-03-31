import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, Sparkles, BookOpen, Star, Heart } from 'lucide-react';
import authService from '../../services/authService';
import { validateEmail } from '../../utils/validation';
import { motion, AnimatePresence } from 'framer-motion';

const floatingIcons = [
  { Icon: BookOpen, top: '12%', left: '10%', delay: 0, size: 'w-7 h-7' },
  { Icon: Star, top: '62%', left: '8%', delay: 1.3, size: 'w-5 h-5' },
  { Icon: Sparkles, top: '28%', right: '12%', delay: 0.6, size: 'w-6 h-6' },
  { Icon: Heart, top: '74%', right: '14%', delay: 1.8, size: 'w-6 h-6' },
  { Icon: Star, top: '44%', left: '22%', delay: 1.0, size: 'w-4 h-4' },
];

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const emailError = validateEmail(email);
    if (emailError) { setError(emailError); return; }
    setIsLoading(true);
    try {
      await authService.requestPasswordReset(email);
      setIsSuccess(true);
    } catch (error: any) {
      if (error.response?.data?.message) setError(error.response.data.message);
      else setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-sky-dark via-sky to-teal">

        {/* Animated blobs */}
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-white/10 blur-3xl"
          animate={{ x: [0, 38, 0], y: [0, -25, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '5%', left: '5%' }}
        />
        <motion.div
          className="absolute w-72 h-72 rounded-full bg-sunshine/20 blur-3xl"
          animate={{ x: [0, -20, 8, 0], y: [0, 32, -10, 0], scale: [1, 0.88, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ bottom: '10%', right: '5%' }}
        />
        <motion.div
          className="absolute w-48 h-48 rounded-full bg-coral/20 blur-2xl"
          animate={{ x: [0, 14, -10, 0], y: [0, -20, 12, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{ top: '42%', right: '20%' }}
        />

        {/* Floating icons */}
        {floatingIcons.map(({ Icon, top, left, right, delay, size }, i) => (
          <motion.div
            key={i}
            className={`absolute text-white/20 ${size}`}
            style={{ top, left, right } as React.CSSProperties}
            animate={{ y: [0, -13, 0], rotate: [0, 6, -6, 0] }}
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
            Forgot your password? 🔑
          </motion.h2>
          <motion.p
            className="text-lg text-white/80 leading-relaxed max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            No worries! Enter your email address and we'll send you instructions to reset your password quickly and securely.
          </motion.p>

          <motion.div
            className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-white/90 font-semibold mb-3">🔒 Your account is safe</p>
            <ul className="space-y-2 text-sm text-white/75">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white/60" />Reset link sent to your email</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white/60" />Link expires in 6 hours</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white/60" />Secure, encrypted process</li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gradient-to-br from-cream-light via-white to-sky-light/20 relative overflow-hidden">

        {/* Subtle bg dots */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-25"
            style={{
              width: 8 + i * 4,
              height: 8 + i * 4,
              background: ['#4FC3F7', '#4DD0E1', '#FFD54F', '#FF85C0', '#4FC3F7'][i],
              top: `${14 + i * 17}%`,
              right: `${3 + i * 2}%`,
            }}
            animate={{ y: [0, -10, 0], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
          />
        ))}

        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-[var(--font-family-fun)] font-bold text-sky">TalkieToys</h1>
          </div>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              /* ── Success State ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.45, type: 'spring', stiffness: 200, damping: 20 }}
                className="bg-white/80 backdrop-blur-md rounded-3xl shadow-soft-xl border border-white/60 p-10 text-center"
              >
                {/* Animated checkmark */}
                <motion.div
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 relative"
                  style={{ background: 'linear-gradient(135deg, #B2EBF2, #4DD0E1)' }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
                >
                  <CheckCircle className="h-10 w-10 text-white" />
                  {/* Ripple rings */}
                  {[1, 2].map((ring) => (
                    <motion.div
                      key={ring}
                      className="absolute inset-0 rounded-full border-2 border-teal/40"
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ scale: 1.6 + ring * 0.4, opacity: 0 }}
                      transition={{ duration: 1.4, delay: ring * 0.3, repeat: Infinity }}
                    />
                  ))}
                </motion.div>

                {/* Floating confetti dots */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      background: ['#4DD0E1', '#FF85C0', '#FFD54F', '#4FC3F7', '#FF85C0', '#4DD0E1'][i],
                      left: `${15 + i * 13}%`,
                      top: '10%',
                    }}
                    initial={{ y: 0, opacity: 1, scale: 1 }}
                    animate={{ y: [0, -40, 20, -20, 0], opacity: [1, 1, 0.6, 0.3, 0], scale: [1, 1.2, 0.8, 0.5, 0] }}
                    transition={{ duration: 1.8, delay: i * 0.1 }}
                  />
                ))}

                <motion.h2
                  className="text-2xl font-[var(--font-family-fun)] font-bold text-warmgray-900 mb-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Check your email! 📬
                </motion.h2>
                <motion.p
                  className="text-warmgray-500 mb-2 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  We've sent reset instructions to
                </motion.p>
                <motion.p
                  className="font-bold text-teal mb-5 text-base"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {email}
                </motion.p>
                <motion.p
                  className="text-xs text-warmgray-400 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Didn't receive it? Check your spam folder. The link expires in 6 hours.
                </motion.p>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-teal to-teal-dark text-white font-bold px-8 py-3 rounded-xl shadow-soft-lg hover:shadow-soft-xl transition-shadow"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              /* ── Form State ── */
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.45 }}
                className="bg-white/80 backdrop-blur-md rounded-3xl shadow-soft-xl border border-white/60 p-8"
              >
                <div className="mb-7">
                  <h2 className="text-3xl font-[var(--font-family-fun)] font-bold text-warmgray-900 mb-1">Reset password</h2>
                  <p className="text-warmgray-500 text-sm">Enter your email and we'll send you a reset link</p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5 bg-red-50 border-l-4 border-red-400 p-4 rounded-xl"
                  >
                    <p className="text-sm text-red-700">{error}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label htmlFor="email" className="block text-sm font-semibold text-warmgray-700 mb-1.5">
                      Email address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-warmgray-400 group-focus-within:text-sky transition-colors" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 bg-warmgray-50 focus:bg-white ${
                          error
                            ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                            : 'border-warmgray-200 focus:border-sky focus:ring-4 focus:ring-sky/10'
                        }`}
                        placeholder="you@example.com"
                        disabled={isLoading}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: isLoading ? 1 : 1.02 }}
                      whileTap={{ scale: isLoading ? 1 : 0.97 }}
                      className="w-full bg-gradient-to-r from-sky to-sky-dark text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-soft-lg hover:shadow-soft-xl"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                          Sending...
                        </>
                      ) : (
                        'Send Reset Instructions'
                      )}
                    </motion.button>
                  </motion.div>
                </form>

                <motion.div
                  className="mt-7 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-sky hover:text-teal transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
