import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import { validateName, validatePhone } from '../utils/validation';
import Layout from '../components/layout/Layout';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Debug: log isEditing state changes
  useEffect(() => {
    console.log('Profile: isEditing state changed to:', isEditing);
  }, [isEditing]);

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
    console.log('handleSubmit called! isEditing:', isEditing);
    setServerError('');
    setSuccessMessage('');

    if (!isEditing) {
      console.log('Form submitted but not in edit mode, ignoring');
      return;
    }

    if (!validateForm()) {
      console.log('Validation failed');
      return;
    }

    console.log('Submitting profile update...');
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'from-red-400 to-pink-500';
      case 'therapist':
        return 'from-purple-400 to-blue-500';
      case 'customer':
      default:
        return 'from-blue-400 to-green-500';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return 'A';
      case 'therapist':
        return 'T';
      case 'customer':
      default:
        return 'C';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl border-4 border-purple-200 overflow-hidden">
          {/* Profile Header */}
          <div className={`bg-gradient-to-r ${getRoleColor(user.role)} p-8 text-white text-center`}>
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg mb-4">
              <span className="text-5xl font-bold text-gray-700">{getRoleIcon(user.role)}</span>
            </div>
            <h2 className="text-3xl font-bold mb-1">{user.name}</h2>
            <p className="text-white/90 font-medium capitalize">{user.role}</p>
          </div>

          {/* Messages */}
          <div className="p-8">
            {successMessage && (
              <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-2xl p-4">
                <p className="text-green-600 text-sm font-medium">{successMessage}</p>
              </div>
            )}

            {serverError && (
              <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-2xl p-4">
                <p className="text-red-600 text-sm font-medium">{serverError}</p>
              </div>
            )}

            {/* Profile Information */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 text-gray-600">
                  {user.email}
                </div>
                <p className="mt-2 text-sm text-gray-500">Email cannot be changed</p>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing || isLoading}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                    errors.name
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-200 focus:border-purple-500'
                  } ${
                    !isEditing ? 'bg-gray-50' : ''
                  } focus:outline-none focus:ring-2 focus:ring-purple-200 disabled:cursor-not-allowed`}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.name}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing || isLoading}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                    errors.phone
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-200 focus:border-purple-500'
                  } ${
                    !isEditing ? 'bg-gray-50' : ''
                  } focus:outline-none focus:ring-2 focus:ring-purple-200 disabled:cursor-not-allowed`}
                  placeholder="Optional"
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.phone}</p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-bold text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing || isLoading}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                    !isEditing ? 'bg-gray-50' : ''
                  } border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 disabled:cursor-not-allowed resize-none`}
                  placeholder="Tell us about yourself (optional)"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => {
                      console.log('Edit Profile clicked, setting isEditing to true');
                      setIsEditing(true);
                    }}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubmit(e);
                      }}
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </form>

            {/* Logout Button */}
            <div className="mt-8 pt-8 border-t-2 border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                Logout
              </button>
            </div>

            {/* Account Info */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                Member since{' '}
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default Profile;
