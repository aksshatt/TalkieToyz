import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingCart, User, LogOut, Menu, X, Heart, ClipboardList,
  Home, ShoppingBag, Brain, BookOpen, ChevronUp, MessageSquare,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppSelector } from '../../store/hooks';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const navLinks = [
  { to: '/products', label: 'Products' },
  { to: '/assessments', label: 'Assessments' },
  { to: '/milestones', label: 'Milestones' },
  { to: '/blog', label: 'Blog' },
  { to: '/resources', label: 'Resources' },
  { to: '/orders', label: 'Orders' },
  { to: '/about', label: 'About Us' },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
  const cart = useAppSelector((state) => state.cart.cart);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const prevCartCount = useRef(0);
  const [cartBounce, setCartBounce] = useState(false);
  const location = useLocation();

  const cartItemsCount = cart?.items_count || 0;
  const isScrolled = scrollY > 60;

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const sy = window.scrollY;
      setScrollY(sy);
      setShowScrollTop(sy > 400);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (sy / total) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cart badge bounce on item add
  useEffect(() => {
    if (cartItemsCount > prevCartCount.current) {
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 600);
    }
    prevCartCount.current = cartItemsCount;
  }, [cartItemsCount]);

  const mobileNavItems = [
    { to: '/', Icon: Home, label: 'Home' },
    { to: '/products', Icon: ShoppingBag, label: 'Shop' },
    { to: '/assessments', Icon: Brain, label: 'Assess' },
    ...(isAuthenticated ? [{ to: '/messages', Icon: MessageSquare, label: 'Messages' }] : []),
    { to: '/cart', Icon: ShoppingCart, label: 'Cart', badge: cartItemsCount },
    { to: isAuthenticated ? '/profile' : '/login', Icon: User, label: isAuthenticated ? 'Profile' : 'Login' },
  ];

  return (
    <div className="min-h-screen pb-16 lg:pb-0">

      {/* ── Scroll Progress Bar ── */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[70] bg-warmgray-100">
        <motion.div
          className="h-full bg-gradient-to-r from-teal via-coral to-sunshine origin-left"
          style={{ scaleX: scrollProgress / 100 }}
          transition={{ ease: 'linear', duration: 0 }}
        />
      </div>

      {/* ── Animated Mobile Background Blobs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden lg:hidden z-0" aria-hidden>
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-teal/8 blur-3xl"
          animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.15, 0.9, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '5%', right: '-10%' }}
        />
        <motion.div
          className="absolute w-56 h-56 rounded-full bg-coral/8 blur-3xl"
          animate={{ x: [0, -25, 15, 0], y: [0, 30, -20, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          style={{ top: '35%', left: '-8%' }}
        />
        <motion.div
          className="absolute w-48 h-48 rounded-full bg-sunshine/8 blur-2xl"
          animate={{ x: [0, 20, -10, 0], y: [0, -25, 15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
          style={{ bottom: '20%', right: '5%' }}
        />
        <motion.div
          className="absolute w-36 h-36 rounded-full bg-sky/8 blur-2xl"
          animate={{ x: [0, -15, 10, 0], y: [0, 20, -12, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{ bottom: '45%', right: '30%' }}
        />
      </div>

      {/* ── Header ── */}
      <header
        className={`bg-white/95 backdrop-blur-md sticky z-50 transition-all duration-300 ${
          isScrolled ? 'top-1 shadow-soft-lg' : 'top-1 shadow-soft'
        }`}
      >
        <div className={`max-w-7xl mx-auto px-4 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3'}`}>
          <div className="flex items-center justify-between gap-6">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <motion.img
                src="/logo.png"
                alt="TalkieToyz"
                className={`w-auto transition-all duration-300 ${isScrolled ? 'h-12 sm:h-14' : 'h-16 sm:h-20'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map(({ to, label }) => {
                const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`relative px-3 py-2 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap ${
                      isActive ? 'text-teal' : 'text-warmgray-700 hover:text-teal hover:bg-teal-light/20'
                    }`}
                  >
                    {label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-teal rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2.5 hover:bg-teal-light/30 rounded-full transition-all"
                title="Shopping Cart"
              >
                <ShoppingCart className="h-6 w-6 text-warmgray-700" />
                <AnimatePresence>
                  {cartItemsCount > 0 && (
                    <motion.span
                      key={cartItemsCount}
                      initial={{ scale: 0 }}
                      animate={cartBounce ? { scale: [0, 1.4, 0.9, 1.1, 1] } : { scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute -top-1 -right-1 bg-coral text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-soft"
                    >
                      {cartItemsCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {isAuthenticated ? (
                <>
                  <Link to="/messages" className="p-2.5 hover:bg-teal-light/30 rounded-full transition-all" title="Messages">
                    <MessageSquare className="h-6 w-6 text-warmgray-700" />
                  </Link>
                  <Link to="/wishlist" className="p-2.5 hover:bg-teal-light/30 rounded-full transition-all" title="Wishlist">
                    <Heart className="h-6 w-6 text-warmgray-700" />
                  </Link>
                  <Link to="/my-assessments" className="hidden sm:block p-2.5 hover:bg-teal-light/30 rounded-full transition-all" title="My Assessments">
                    <ClipboardList className="h-6 w-6 text-warmgray-700" />
                  </Link>
                  <Link to="/profile" className="p-2.5 hover:bg-teal-light/30 rounded-full transition-all" title="Profile">
                    <User className="h-6 w-6 text-warmgray-700" />
                  </Link>
                  <button onClick={logout} className="hidden sm:block p-2.5 hover:bg-coral-light/30 rounded-full transition-all" title="Logout">
                    <LogOut className="h-6 w-6 text-warmgray-700" />
                  </button>
                </>
              ) : (
                <div className="hidden sm:flex items-center space-x-2">
                  <Link to="/login" className="text-warmgray-700 font-semibold hover:text-teal transition-colors text-sm px-3 py-2">
                    Login
                  </Link>
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <Link to="/signup" className="btn-primary text-sm px-4 py-2">Sign Up</Link>
                  </motion.div>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 hover:bg-warmgray-100 rounded-full transition-all"
                aria-label="Toggle menu"
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isMobileMenuOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <X className="h-6 w-6 text-warmgray-700" />
                    </motion.div>
                  ) : (
                    <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Menu className="h-6 w-6 text-warmgray-700" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="lg:hidden overflow-hidden border-t border-warmgray-100 mt-3"
              >
                <nav className="flex flex-col space-y-1 px-2 py-3">
                  {navLinks.map(({ to, label }, i) => (
                    <motion.div
                      key={to}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={to}
                        className={`block px-4 py-3 rounded-xl font-semibold transition-colors ${
                          location.pathname === to
                            ? 'bg-teal-light/30 text-teal'
                            : 'text-warmgray-700 hover:text-teal hover:bg-teal-light/20'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {label}
                      </Link>
                    </motion.div>
                  ))}
                  {!isAuthenticated && (
                    <motion.div
                      className="flex gap-2 pt-2 px-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: navLinks.length * 0.05 }}
                    >
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}
                        className="flex-1 py-2.5 text-center border-2 border-teal/30 text-teal font-semibold rounded-xl hover:bg-teal/5 transition-all text-sm">
                        Login
                      </Link>
                      <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}
                        className="flex-1 py-2.5 text-center bg-gradient-to-r from-teal to-teal-dark text-white font-semibold rounded-xl shadow-soft text-sm">
                        Sign Up
                      </Link>
                    </motion.div>
                  )}
                  {isAuthenticated && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: navLinks.length * 0.05 }}
                      className="space-y-1"
                    >
                      <Link to="/messages" onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-warmgray-700 hover:text-teal hover:bg-teal-light/20 transition-colors">
                        <MessageSquare className="w-5 h-5" /> Messages
                      </Link>
                      <button
                        onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                        className="w-full text-left px-4 py-3 rounded-xl font-semibold text-warmgray-700 hover:text-coral hover:bg-coral-light/20 transition-colors"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="relative z-10">{children}</main>

      {/* ── Footer ── */}
      <footer className="bg-gradient-to-br from-warmgray-900 via-warmgray-800 to-warmgray-900 text-white mt-20 relative overflow-hidden">
        {/* Footer bg blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <motion.div className="absolute w-80 h-80 rounded-full bg-teal/30 blur-3xl"
            animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            style={{ top: '-10%', left: '-5%' }}
          />
          <motion.div className="absolute w-72 h-72 rounded-full bg-coral/20 blur-3xl"
            animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            style={{ bottom: '-10%', right: '-5%' }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-[var(--font-family-fun)] font-bold mb-4">Why Choose Us</h3>
              <ul className="space-y-3 text-warmgray-300">
                {['Expert-curated educational toys', 'Age-appropriate learning', 'Safe & certified materials', 'Parent-approved quality'].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-teal-light mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-xl font-[var(--font-family-fun)] font-bold mb-4">Learning Hub</h3>
              <ul className="space-y-3">
                {[
                  { to: '/blog', label: 'Expert Blog' },
                  { to: '/resources', label: 'Free Resources' },
                  { to: '/assessments', label: 'Development Assessments' },
                  { to: '/milestones', label: 'Milestones Tracker' },
                  { to: '/faq', label: 'FAQ' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="text-warmgray-300 hover:text-teal-light transition-colors font-medium">{label}</Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-[var(--font-family-fun)] font-bold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { to: '/products', label: 'Shop Toys' },
                  { to: '/about', label: 'About Us' },
                  { to: '/contact', label: 'Contact' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="text-warmgray-300 hover:text-teal-light transition-colors font-medium">{label}</Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-xl font-[var(--font-family-fun)] font-bold mb-4">Stay Connected</h3>
              <p className="text-warmgray-300 mb-4 text-sm">Get learning tips, new toy launches, and special offers!</p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-warmgray-400 focus:outline-none focus:ring-2 focus:ring-teal-light transition-all"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-teal-gradient text-white font-bold py-3 rounded-full hover:shadow-soft-lg transition-all"
                >
                  Subscribe
                </motion.button>
              </form>
              <div className="flex gap-3 mt-6">
                {[
                  { label: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                  { label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                ].map(({ label, path }) => (
                  <motion.a key={label} href="#" whileHover={{ scale: 1.15, y: -2 }} whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-teal-light/20 flex items-center justify-center transition-colors"
                    aria-label={label}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d={path} /></svg>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Wave divider */}
          <div className="border-t border-white/10 pt-6 text-center text-warmgray-400">
            <p className="font-medium">&copy; 2025 TalkieToyz. All rights reserved. Made with ❤️ for growing minds.</p>
            <p className="text-sm text-warmgray-500 mt-1">Designed &amp; developed by Akshat</p>
          </div>
        </div>
      </footer>

      {/* ── Scroll to Top Button ── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-20 right-4 lg:bottom-8 lg:right-6 z-50 w-12 h-12 bg-gradient-to-br from-teal to-teal-dark text-white rounded-full shadow-soft-lg flex items-center justify-center"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Bottom Mobile Nav ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-warmgray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
          {mobileNavItems.map(({ to, Icon, label, badge }) => {
            const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                  isActive ? 'text-teal' : 'text-warmgray-500'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-bg"
                    className="absolute inset-0 bg-teal-light/20 rounded-xl"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <div className="relative">
                  <Icon className={`w-5 h-5 relative z-10 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  {badge != null && badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-coral text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-semibold relative z-10 ${isActive ? 'text-teal' : 'text-warmgray-500'}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

    </div>
  );
};

export default Layout;
