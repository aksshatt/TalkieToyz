import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import SEO from '../common/SEO';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  HelpCircle,
  FileText,
  Calendar,
  BookOpen,
  Star,
  Newspaper,
  MessageSquare,
  BarChart2,
  ClipboardList,
  LogOut,
  Menu,
  X,
  Shield,
  Heart,
  HelpingHand,
  Ticket,
  Stethoscope,
  UserCheck,
  Eye,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
    { name: 'Appointments', href: '/admin/appointments', icon: Calendar },
    { name: 'Services', href: '/admin/services', icon: HelpingHand },
    { name: 'Assessments', href: '/admin/assessments', icon: ClipboardList },
    { name: 'Blog', href: '/admin/blog', icon: Newspaper },
    { name: 'Resources', href: '/admin/resources', icon: BookOpen },
    { name: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
    { name: 'Contact', href: '/admin/contact', icon: MessageSquare },
    { name: 'Content', href: '/admin/content', icon: FileText },
    { name: 'Success Stories', href: '/admin/success-stories', icon: Heart },
    { name: 'Product Q&A', href: '/admin/product-questions', icon: HelpingHand },
    { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
    { name: 'Audit Log', href: '/admin/audit-log', icon: Shield },
  ];

  const therapistNavigation = [
    { name: 'Therapist Approvals', href: '/admin/therapist-approvals', icon: UserCheck },
    { name: 'Therapist Management', href: '/admin/therapist-management', icon: Stethoscope },
    { name: 'Conversations', href: '/admin/conversations', icon: Eye },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-warmgray-50">
      <SEO title="Admin" noindex />
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white border-r-2 border-warmgray-200 w-64`}
      >
        <div className="h-full flex flex-col overflow-hidden">
          {/* Logo */}
          <div className="p-3 border-b-2 border-warmgray-100">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="TalkieToyz"
                className="h-18 sm:h-20 w-auto transition-all"
              />
            </Link>
            <p className="text-sm text-warmgray-500 mt-1 font-medium">
              Admin Dashboard
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 min-h-0 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                    active
                      ? 'bg-teal-gradient text-white shadow-soft'
                      : 'text-warmgray-700 hover:bg-warmgray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Therapist Section */}
            <div className="pt-2">
              <p className="text-xs font-bold text-warmgray-400 uppercase tracking-wider px-4 pb-2 pt-2">Therapist</p>
              {therapistNavigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                      active
                        ? 'bg-teal-gradient text-white shadow-soft'
                        : 'text-warmgray-700 hover:bg-warmgray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t-2 border-warmgray-100">
            <div className="mb-3 px-4">
              <p className="text-sm font-bold text-warmgray-800">{user?.name}</p>
              <p className="text-xs text-warmgray-500 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-coral hover:bg-coral-light/30 transition-all"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-all`}>
        {/* Top Bar */}
        <header className="bg-white border-b-2 border-warmgray-200 sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-warmgray-100 transition-colors"
            >
              {isSidebarOpen ? (
                <X className="h-6 w-6 text-warmgray-700" />
              ) : (
                <Menu className="h-6 w-6 text-warmgray-700" />
              )}
            </button>

            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-sm font-semibold text-teal hover:text-teal-dark transition-colors"
              >
                View Store
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
