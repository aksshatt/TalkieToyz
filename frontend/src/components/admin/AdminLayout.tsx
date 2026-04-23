import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronDown,
  Shield,
  Heart,
  HelpingHand,
  Ticket,
  Stethoscope,
  UserCheck,
  Eye,
  Menu as MenuIcon,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

type NavItem = { name: string; href: string; icon: React.ComponentType<{ className?: string }> };

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const quickLinks: NavItem[] = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
  ];

  const groups: { label: string; items: NavItem[] }[] = [
    {
      label: 'Shop',
      items: [
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
        { name: 'Customers', href: '/admin/customers', icon: Users },
        { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
        { name: 'Reviews', href: '/admin/reviews', icon: Star },
        { name: 'Product Q&A', href: '/admin/product-questions', icon: HelpingHand },
      ],
    },
    {
      label: 'Therapy',
      items: [
        { name: 'Appointments', href: '/admin/appointments', icon: Calendar },
        { name: 'Services', href: '/admin/services', icon: HelpingHand },
        { name: 'Assessments', href: '/admin/assessments', icon: ClipboardList },
        { name: 'Therapist Approvals', href: '/admin/therapist-approvals', icon: UserCheck },
        { name: 'Therapist Management', href: '/admin/therapist-management', icon: Stethoscope },
        { name: 'Conversations', href: '/admin/conversations', icon: Eye },
      ],
    },
    {
      label: 'Content',
      items: [
        { name: 'Blog', href: '/admin/blog', icon: Newspaper },
        { name: 'Resources', href: '/admin/resources', icon: BookOpen },
        { name: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
        { name: 'Success Stories', href: '/admin/success-stories', icon: Heart },
        { name: 'Site Content', href: '/admin/content', icon: FileText },
      ],
    },
    {
      label: 'System',
      items: [
        { name: 'Contact', href: '/admin/contact', icon: MessageSquare },
        { name: 'Audit Log', href: '/admin/audit-log', icon: Shield },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  const groupIsActive = (items: NavItem[]) => items.some((i) => isActive(i.href));

  // Close dropdown on route change
  useEffect(() => {
    setOpenGroup(null);
    setMobileOpen(false);
  }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpenGroup(null);
      }
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="min-h-screen bg-warmgray-50">
      <SEO title="Admin" noindex />

      <header
        ref={wrapperRef}
        className="bg-white border-b-2 border-warmgray-200 sticky top-0 z-40 shadow-soft"
      >
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
          {/* Top row */}
          <div className="flex items-center justify-between h-16 gap-4">
            <Link to="/admin" className="flex items-center gap-3 flex-shrink-0">
              <img src="/logo.png" alt="TalkieToyz" className="h-10 w-auto" />
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="font-extrabold text-warmgray-900 text-sm">Admin</span>
                <span className="text-[10px] text-warmgray-500 uppercase tracking-wider">Talkie Toyz</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold transition-colors ${
                      active ? 'bg-teal-gradient text-white shadow-soft' : 'text-warmgray-700 hover:bg-warmgray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}

              {groups.map((g) => {
                const active = groupIsActive(g.items);
                const isOpen = openGroup === g.label;
                return (
                  <div key={g.label} className="relative">
                    <button
                      onClick={() => setOpenGroup(isOpen ? null : g.label)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-colors ${
                        active || isOpen ? 'bg-teal/10 text-teal' : 'text-warmgray-700 hover:bg-warmgray-100'
                      }`}
                    >
                      {g.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link to="/" className="hidden md:inline-flex text-xs font-semibold text-teal hover:text-teal-dark">
                View Store
              </Link>
              <div className="hidden md:flex items-center gap-2 pl-3 border-l border-warmgray-200">
                <div className="text-right leading-tight">
                  <p className="text-xs font-bold text-warmgray-800 truncate max-w-[120px]">{user?.name}</p>
                  <p className="text-[10px] text-warmgray-500 capitalize">{user?.role}</p>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-full text-coral hover:bg-coral/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden p-2 rounded-lg hover:bg-warmgray-100"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Desktop slide-down panel */}
          <AnimatePresence>
            {openGroup && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="hidden lg:block overflow-hidden border-t border-warmgray-100"
              >
                <div className="py-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {groups
                    .find((g) => g.label === openGroup)
                    ?.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                            active
                              ? 'bg-teal-gradient text-white shadow-soft'
                              : 'text-warmgray-700 hover:bg-warmgray-100'
                          }`}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{item.name}</span>
                        </Link>
                      );
                    })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile full menu */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="lg:hidden overflow-hidden border-t border-warmgray-100"
              >
                <div className="py-4 space-y-5 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-1">
                    {quickLinks.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                            active ? 'bg-teal-gradient text-white' : 'text-warmgray-700 hover:bg-warmgray-100'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>

                  {groups.map((g) => (
                    <div key={g.label}>
                      <p className="text-[10px] font-bold text-warmgray-400 uppercase tracking-wider mb-1 px-3">{g.label}</p>
                      <div className="space-y-1">
                        {g.items.map((item) => {
                          const Icon = item.icon;
                          const active = isActive(item.href);
                          return (
                            <Link
                              key={item.name}
                              to={item.href}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                                active ? 'bg-teal-gradient text-white' : 'text-warmgray-700 hover:bg-warmgray-100'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              {item.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <div className="pt-3 border-t border-warmgray-100 flex items-center justify-between px-3">
                    <div>
                      <p className="text-sm font-bold text-warmgray-800">{user?.name}</p>
                      <p className="text-xs text-warmgray-500 capitalize">{user?.role}</p>
                    </div>
                    <button
                      onClick={logout}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-coral hover:bg-coral/10 text-sm font-semibold"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-4 lg:p-6">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default AdminLayout;
