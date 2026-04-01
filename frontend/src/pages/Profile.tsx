import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import { validateName, validatePhone } from '../utils/validation';
import Layout from '../components/layout/Layout';
import { User, Mail, Phone, FileText, ShoppingBag, LogOut, Edit2, Save, X, Shield, Heart, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({ name: user?.name || '', phone: user?.phone || '', bio: user?.bio || '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user) setFormData({ name: user.name || '', phone: user.phone || '', bio: user.bio || '' });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;
    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(''); setSuccessMessage('');
    if (!isEditing || !validateForm()) return;
    setIsLoading(true);
    try {
      const response = await authService.updateProfile(formData);
      updateUser(response.data.user);
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      if (error.response?.data?.message) setServerError(error.response.data.message);
      else if (error.response?.data?.errors) setServerError(error.response.data.errors.join(', '));
      else setServerError('Failed to update profile. Please try again.');
    } finally { setIsLoading(false); }
  };

  const handleCancel = () => {
    setFormData({ name: user?.name || '', phone: user?.phone || '', bio: user?.bio || '' });
    setErrors({}); setServerError(''); setIsEditing(false);
  };

  const handleLogout = async () => { await logout(); navigate('/login'); };

  if (!user) return null;

  const initials = user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  const quickLinks = [
    { to: '/orders', icon: ShoppingBag, label: 'My Orders', color: 'text-teal', bg: 'bg-teal-light/20 hover:bg-teal-light/40' },
    { to: '/wishlist', icon: Heart, label: 'Wishlist', color: 'text-coral', bg: 'bg-coral-light/20 hover:bg-coral-light/40' },
    { to: '/assessments', icon: ClipboardList, label: 'Assessments', color: 'text-sky', bg: 'bg-sky-light/20 hover:bg-sky-light/40' },
    ...(user.role === 'admin' ? [{ to: '/admin', icon: Shield, label: 'Admin Panel', color: 'text-purple-600', bg: 'bg-purple-50 hover:bg-purple-100' }] : []),
  ];

  return (
    <Layout>
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-dark via-teal to-sky py-16 px-4">
        <motion.div className="absolute w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none"
          animate={{ x: [0, 28, 0], y: [0, -18, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '-15%', left: '-5%' }} />
        <motion.div className="absolute w-56 h-56 rounded-full bg-sunshine/15 blur-3xl pointer-events-none"
          animate={{ x: [0, -16, 0], y: [0, 22, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ bottom: '-15%', right: '5%' }} />

        <div className="relative z-10 max-w-4xl mx-auto flex items-center gap-6">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-sunshine to-coral flex items-center justify-center text-white font-bold text-2xl shadow-soft-xl flex-shrink-0">
            {initials}
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <h1 className="text-3xl md:text-4xl font-[var(--font-family-fun)] font-bold text-white">{user.name}</h1>
            <p className="text-white/75 mt-1">{user.email}</p>
            {user.role !== 'customer' && (
              <span className="inline-block mt-2 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full capitalize">{user.role}</span>
            )}
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 48C240 16 480 0 720 0C960 0 1200 16 1440 48H0Z" fill="#fdf8f0" />
          </svg>
        </div>
      </div>

      <div className="bg-cream-light min-h-screen py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Sidebar */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="lg:col-span-1 space-y-4">
              {/* Quick Links */}
              <div className="bg-white rounded-2xl shadow-soft p-5">
                <p className="text-xs font-bold text-warmgray-400 uppercase tracking-wider mb-3">Quick Links</p>
                <div className="space-y-1">
                  {quickLinks.map(({ to, icon: Icon, label, color, bg }) => (
                    <Link key={to} to={to}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl ${bg} transition-colors`}>
                      <Icon className={`h-5 w-5 ${color}`} />
                      <span className="font-semibold text-warmgray-700 text-sm">{label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Member Since */}
              <div className="bg-white rounded-2xl shadow-soft p-5 text-center">
                <p className="text-xs text-warmgray-400 mb-1">Member since</p>
                <p className="font-bold text-warmgray-700">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'N/A'}
                </p>
              </div>

              {/* Logout */}
              <motion.button onClick={handleLogout} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-2xl shadow-soft text-coral hover:bg-coral-light/20 transition-colors font-semibold border-2 border-coral/20">
                <LogOut className="h-5 w-5" />
                Logout
              </motion.button>
            </motion.div>

            {/* Profile Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
              className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                <div className="bg-gradient-to-r from-teal-light/30 to-sky-light/20 px-6 py-4 border-b border-warmgray-100 flex items-center justify-between">
                  <h3 className="font-[var(--font-family-fun)] font-bold text-lg text-warmgray-900">Profile Information</h3>
                  <AnimatePresence>
                    {!isEditing && (
                      <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-teal hover:bg-teal hover:text-white transition-colors font-semibold shadow-soft text-sm">
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                <div className="p-6">
                  <AnimatePresence>
                    {successMessage && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="mb-5 bg-teal-light/30 border-l-4 border-teal p-4 rounded-xl">
                        <p className="text-teal-dark font-semibold text-sm">{successMessage}</p>
                      </motion.div>
                    )}
                    {serverError && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="mb-5 bg-coral-light/30 border-l-4 border-coral p-4 rounded-xl">
                        <p className="text-coral-dark font-semibold text-sm">{serverError}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email (read-only) */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-warmgray-700 mb-1.5">
                        <Mail className="h-4 w-4 text-teal" /> Email Address
                      </label>
                      <div className="px-4 py-3 bg-warmgray-50 rounded-xl border border-warmgray-200 text-warmgray-500 text-sm">{user.email}</div>
                      <p className="mt-1 text-xs text-warmgray-400">Email cannot be changed</p>
                    </div>

                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-warmgray-700 mb-1.5">
                        <User className="h-4 w-4 text-teal" /> Full Name
                      </label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                        disabled={!isEditing || isLoading}
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-4 text-sm ${
                          errors.name ? 'border-coral focus:border-coral focus:ring-coral/10' : 'border-warmgray-200 focus:border-teal focus:ring-teal/10'
                        } ${!isEditing ? 'bg-warmgray-50 text-warmgray-600' : 'bg-white focus:bg-white'} disabled:cursor-not-allowed`}
                      />
                      {errors.name && <p className="mt-1 text-xs text-coral-dark font-medium">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="flex items-center gap-2 text-sm font-semibold text-warmgray-700 mb-1.5">
                        <Phone className="h-4 w-4 text-teal" /> Phone Number
                      </label>
                      <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange}
                        disabled={!isEditing || isLoading} placeholder="Optional"
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-4 text-sm ${
                          errors.phone ? 'border-coral focus:border-coral focus:ring-coral/10' : 'border-warmgray-200 focus:border-teal focus:ring-teal/10'
                        } ${!isEditing ? 'bg-warmgray-50 text-warmgray-600' : 'bg-white focus:bg-white'} disabled:cursor-not-allowed`}
                      />
                      {errors.phone && <p className="mt-1 text-xs text-coral-dark font-medium">{errors.phone}</p>}
                    </div>

                    {/* Bio */}
                    <div>
                      <label htmlFor="bio" className="flex items-center gap-2 text-sm font-semibold text-warmgray-700 mb-1.5">
                        <FileText className="h-4 w-4 text-teal" /> Bio
                      </label>
                      <textarea id="bio" name="bio" rows={4} value={formData.bio} onChange={handleChange}
                        disabled={!isEditing || isLoading} placeholder="Tell us about yourself (optional)"
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-4 resize-none text-sm border-warmgray-200 focus:border-teal focus:ring-teal/10 ${
                          !isEditing ? 'bg-warmgray-50 text-warmgray-600' : 'bg-white focus:bg-white'
                        } disabled:cursor-not-allowed`}
                      />
                    </div>

                    <AnimatePresence>
                      {isEditing && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                          className="flex gap-3 pt-2 overflow-hidden">
                          <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                            className="flex-1 bg-gradient-to-r from-teal to-teal-dark text-white font-bold py-3 rounded-xl shadow-soft hover:shadow-soft-md transition-shadow flex items-center justify-center gap-2 disabled:opacity-60 text-sm">
                            <Save className="h-4 w-4" />
                            {isLoading ? 'Saving...' : 'Save Changes'}
                          </motion.button>
                          <button type="button" onClick={handleCancel} disabled={isLoading}
                            className="flex-1 px-4 py-3 border-2 border-warmgray-200 text-warmgray-700 rounded-xl hover:bg-warmgray-50 transition-colors font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                            <X className="h-4 w-4" /> Cancel
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
