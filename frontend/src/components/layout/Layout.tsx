import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppSelector } from '../../store/hooks';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const cart = useAppSelector((state) => state.cart.cart);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemsCount = cart?.items_count || 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-soft sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img
                src="/logo.png"
                alt="TalkieToyz"
                className="h-16 sm:h-20 w-auto transition-all hover:scale-105"
              />
            </Link>

            {/* Navigation Links - Desktop */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link
                to="/products"
                className="text-warmgray-700 font-semibold hover:text-teal transition-colors whitespace-nowrap"
              >
                Products
              </Link>
              <Link
                to="/assessments"
                className="text-warmgray-700 font-semibold hover:text-teal transition-colors whitespace-nowrap"
              >
                Assessments
              </Link>
              <Link
                to="/milestones"
                className="text-warmgray-700 font-semibold hover:text-teal transition-colors whitespace-nowrap"
              >
                Milestones
              </Link>
              <Link
                to="/blog"
                className="text-warmgray-700 font-semibold hover:text-teal transition-colors whitespace-nowrap"
              >
                Blog
              </Link>
              <Link
                to="/resources"
                className="text-warmgray-700 font-semibold hover:text-teal transition-colors whitespace-nowrap"
              >
                Resources
              </Link>
              <Link
                to="/orders"
                className="text-warmgray-700 font-semibold hover:text-teal transition-colors whitespace-nowrap"
              >
                Orders
              </Link>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative p-2.5 hover:bg-teal-light/30 rounded-full transition-all"
                title="Shopping Cart"
              >
                <ShoppingCart className="h-6 w-6 text-warmgray-700" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-coral-gradient text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse-soft shadow-soft">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="p-2.5 hover:bg-teal-light/30 rounded-full transition-all"
                    title="Profile"
                  >
                    <User className="h-6 w-6 text-warmgray-700" />
                  </Link>
                  <button
                    onClick={logout}
                    className="hidden sm:block p-2.5 hover:bg-coral-light/30 rounded-full transition-all"
                    title="Logout"
                  >
                    <LogOut className="h-6 w-6 text-warmgray-700" />
                  </button>
                </>
              ) : (
                <div className="hidden sm:flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-warmgray-700 font-semibold hover:text-teal transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="btn-primary text-sm px-4 py-2"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 hover:bg-warmgray-100 rounded-full transition-all"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-warmgray-700" />
                ) : (
                  <Menu className="h-6 w-6 text-warmgray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-warmgray-200 bg-white mt-4">
              <nav className="flex flex-col space-y-1 px-4 py-4">
                <Link
                  to="/products"
                  className="text-warmgray-700 font-semibold hover:text-teal hover:bg-teal-light/20 px-4 py-3 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  to="/assessments"
                  className="text-warmgray-700 font-semibold hover:text-teal hover:bg-teal-light/20 px-4 py-3 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Assessments
                </Link>
                <Link
                  to="/milestones"
                  className="text-warmgray-700 font-semibold hover:text-teal hover:bg-teal-light/20 px-4 py-3 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Milestones
                </Link>
                <Link
                  to="/blog"
                  className="text-warmgray-700 font-semibold hover:text-teal hover:bg-teal-light/20 px-4 py-3 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  to="/resources"
                  className="text-warmgray-700 font-semibold hover:text-teal hover:bg-teal-light/20 px-4 py-3 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Resources
                </Link>
                <Link
                  to="/orders"
                  className="text-warmgray-700 font-semibold hover:text-teal hover:bg-teal-light/20 px-4 py-3 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Orders
                </Link>
                {!isAuthenticated && (
                  <>
                    <Link
                      to="/login"
                      className="text-warmgray-700 font-semibold hover:text-teal hover:bg-teal-light/20 px-4 py-3 rounded-lg transition-colors sm:hidden"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="text-warmgray-700 font-semibold hover:text-teal hover:bg-teal-light/20 px-4 py-3 rounded-lg transition-colors sm:hidden"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
                {isAuthenticated && (
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-warmgray-700 font-semibold hover:text-teal hover:bg-teal-light/20 px-4 py-3 rounded-lg transition-colors text-left sm:hidden"
                  >
                    Logout
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-warmgray-900 via-warmgray-800 to-warmgray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Why Choose Us */}
            <div>
              <h3 className="text-xl font-[var(--font-family-fun)] font-bold mb-4">
                Why Choose Us
              </h3>
              <ul className="space-y-3 text-warmgray-300">
                <li className="flex items-start gap-2">
                  <span className="text-teal-light mt-1">✓</span>
                  <span>Expert-curated educational toys</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-light mt-1">✓</span>
                  <span>Age-appropriate learning</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-light mt-1">✓</span>
                  <span>Safe & certified materials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-light mt-1">✓</span>
                  <span>Parent-approved quality</span>
                </li>
              </ul>
            </div>

            {/* Learning Hub */}
            <div>
              <h3 className="text-xl font-[var(--font-family-fun)] font-bold mb-4">
                Learning Hub
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/blog"
                    className="text-warmgray-300 hover:text-teal-light transition-colors font-medium"
                  >
                    Expert Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources"
                    className="text-warmgray-300 hover:text-teal-light transition-colors font-medium"
                  >
                    Free Resources
                  </Link>
                </li>
                <li>
                  <Link
                    to="/assessments"
                    className="text-warmgray-300 hover:text-teal-light transition-colors font-medium"
                  >
                    Development Assessments
                  </Link>
                </li>
                <li>
                  <Link
                    to="/milestones"
                    className="text-warmgray-300 hover:text-teal-light transition-colors font-medium"
                  >
                    Milestones Tracker
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="text-warmgray-300 hover:text-teal-light transition-colors font-medium"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-[var(--font-family-fun)] font-bold mb-4">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/products"
                    className="text-warmgray-300 hover:text-teal-light transition-colors font-medium"
                  >
                    Shop Toys
                  </Link>
                </li>
                <li>
                  <Link
                    to="/domains"
                    className="text-warmgray-300 hover:text-teal-light transition-colors font-medium"
                  >
                    Developmental Domains
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-warmgray-300 hover:text-teal-light transition-colors font-medium"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-warmgray-300 hover:text-teal-light transition-colors font-medium"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter Signup */}
            <div>
              <h3 className="text-xl font-[var(--font-family-fun)] font-bold mb-4">
                Stay Connected
              </h3>
              <p className="text-warmgray-300 mb-4 text-sm">
                Get learning tips, new toy launches, and special offers!
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-warmgray-400 focus:outline-none focus:ring-2 focus:ring-teal-light transition-all"
                />
                <button
                  type="submit"
                  className="w-full bg-teal-gradient text-white font-bold py-3 rounded-full hover:shadow-soft-lg transition-all hover-lift"
                >
                  Subscribe
                </button>
              </form>

              {/* Social Icons */}
              <div className="flex gap-3 mt-6">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-teal-light/20 flex items-center justify-center transition-all hover-lift"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-teal-light/20 flex items-center justify-center transition-all hover-lift"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-teal-light/20 flex items-center justify-center transition-all hover-lift"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 text-center text-warmgray-400">
            <p className="font-medium">&copy; 2025 TalkieToyz. All rights reserved. Made with ❤️ for growing minds.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
