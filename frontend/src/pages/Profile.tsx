import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import { validateName, validatePhone } from '../utils/validation';
import Layout from '../components/layout/Layout';
import { User, Mail, Phone, FileText, ShoppingBag, LogOut, Edit2, Save, X, Shield } from 'lucide-react';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Update form data when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    if (!isEditing) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.updateProfile(formData);
      updateUser(response.data.user);
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Profile update error:', error);

      if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        setServerError(error.response.data.errors.join(', '));
      } else {
        setServerError('Failed to update profile. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
    });
    setErrors({});
    setServerError('');
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-pill bg-coral-gradient text-white text-xs font-semibold">
            <Shield className="h-3 w-3" />
            Admin
          </span>
        );
      case 'therapist':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-pill bg-teal-gradient text-white text-xs font-semibold">
            <User className="h-3 w-3" />
            Therapist
          </span>
        );
      default:
        return null;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-cream-light py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="heading-talkie mb-2">My Account</h1>
            <p className="text-warmgray-600">Manage your profile and account settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Summary Card */}
            <div className="lg:col-span-1">
              <div className="card-talkie p-6 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-gradient rounded-full mb-4">
                  <User className="h-10 w-10 text-white" />
                </div>
                <h2 className="font-[var(--font-family-fun)] font-bold text-xl text-warmgray-900 mb-2">
                  {user.name}
                </h2>
                <p className="text-sm text-warmgray-600 mb-4">{user.email}</p>
                {getRoleBadge(user.role)}

                <div className="mt-6 pt-6 border-t border-warmgray-200 space-y-3">
                  <Link
                    to="/orders"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-warmgray-700 hover:bg-warmgray-50 transition-colors"
                  >
                    <ShoppingBag className="h-5 w-5 text-teal" />
                    <span className="font-medium">My Orders</span>
                  </Link>

                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-warmgray-700 hover:bg-warmgray-50 transition-colors"
                    >
                      <Shield className="h-5 w-5 text-coral" />
                      <span className="font-medium">Admin Panel</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-coral hover:bg-coral-light/20 transition-colors font-medium"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-warmgray-200">
                  <p className="text-xs text-warmgray-500">
                    Member since {user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Details Card */}
            <div className="lg:col-span-2">
              <div className="card-talkie overflow-hidden">
                <div className="bg-gradient-to-r from-teal-light/40 to-coral-light/30 px-6 py-4 border-b border-warmgray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-[var(--font-family-fun)] font-bold text-xl text-warmgray-900">
                      Profile Information
                    </h3>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-teal hover:bg-teal hover:text-white transition-colors font-medium shadow-soft"
                      >
                        <Edit2 className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {/* Messages */}
                  {successMessage && (
                    <div className="mb-6 bg-teal-light/30 border-l-4 border-teal p-4 rounded-lg">
                      <p className="text-teal-dark font-medium">{successMessage}</p>
                    </div>
                  )}

                  {serverError && (
                    <div className="mb-6 bg-coral-light/30 border-l-4 border-coral p-4 rounded-lg">
                      <p className="text-coral-dark font-medium">{serverError}</p>
                    </div>
                  )}

                  {/* Profile Information */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email (Read-only) */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-warmgray-700 mb-2">
                        <Mail className="h-4 w-4 text-teal" />
                        Email Address
                      </label>
                      <div className="px-4 py-3 bg-warmgray-50 rounded-xl border border-warmgray-200 text-warmgray-600">
                        {user.email}
                      </div>
                      <p className="mt-1 text-xs text-warmgray-500">Email cannot be changed</p>
                    </div>

                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-warmgray-700 mb-2">
                        <User className="h-4 w-4 text-teal" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing || isLoading}
                        className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                          errors.name
                            ? 'border-coral focus:border-coral focus:ring-coral'
                            : 'border-warmgray-300 focus:border-teal focus:ring-teal'
                        } ${
                          !isEditing ? 'bg-warmgray-50 text-warmgray-600' : 'bg-white'
                        } focus:outline-none focus:ring-2 disabled:cursor-not-allowed`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-coral-dark font-medium">{errors.name}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="flex items-center gap-2 text-sm font-semibold text-warmgray-700 mb-2">
                        <Phone className="h-4 w-4 text-teal" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing || isLoading}
                        className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                          errors.phone
                            ? 'border-coral focus:border-coral focus:ring-coral'
                            : 'border-warmgray-300 focus:border-teal focus:ring-teal'
                        } ${
                          !isEditing ? 'bg-warmgray-50 text-warmgray-600' : 'bg-white'
                        } focus:outline-none focus:ring-2 disabled:cursor-not-allowed`}
                        placeholder="Optional"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-coral-dark font-medium">{errors.phone}</p>
                      )}
                    </div>

                    {/* Bio */}
                    <div>
                      <label htmlFor="bio" className="flex items-center gap-2 text-sm font-semibold text-warmgray-700 mb-2">
                        <FileText className="h-4 w-4 text-teal" />
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={formData.bio}
                        onChange={handleChange}
                        disabled={!isEditing || isLoading}
                        className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                          !isEditing ? 'bg-warmgray-50 text-warmgray-600' : 'bg-white'
                        } border-warmgray-300 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal disabled:cursor-not-allowed resize-none`}
                        placeholder="Tell us about yourself (optional)"
                      />
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Save className="h-4 w-4" />
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          disabled={isLoading}
                          className="flex-1 px-6 py-3 border border-warmgray-300 text-warmgray-700 rounded-xl hover:bg-warmgray-50 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
