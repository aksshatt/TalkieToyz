import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppSelector } from '../../store/hooks';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const cart = useAppSelector((state) => state.cart.cart);

  const cartItemsCount = cart?.items_count || 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-soft sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <img
                src="/logo.png"
                alt="TalkieToyz"
                className="h-12 w-auto"
              />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/products"
                className="text-warmgray-700 font-semibold hover:text-teal transition-colors"
              >
                Products
              </Link>
              <Link
                to="/assessments"
                className="text-warmgray-700 font-semibold hover:text-teal transition-colors"
              >
                Assessments
              </Link>
              <Link
                to="/milestones"
                className="text-warmgray-700 font-semibold hover:text-teal transition-colors"
              >
                Milestones
              </Link>
              <Link
                to="/progress"
                className="text-warmgray-700 font-semibold hover:text-teal transition-colors"
              >
                Progress
              </Link>
              <Link
                to="/blog"
                className="text-warmgray-700 font-semibold hover:text-teal transition-colors"
              >
                Blog
              </Link>
              <Link
                to="/resources"
                className="text-warmgray-700 font-semibold hover:text-teal transition-colors"
              >
                Resources
              </Link>
              <Link
                to="/faq"
                className="text-warmgray-700 font-semibold hover:text-teal transition-colors"
              >
                FAQ
              </Link>
              <Link
                to="/contact"
                className="text-warmgray-700 font-semibold hover:text-teal transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative p-2.5 hover:bg-teal-light/30 rounded-full transition-all"
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
                <div className="flex items-center space-x-3">
                  <span className="text-warmgray-700 font-medium hidden md:inline">
                    Hi, {user?.name}!
                  </span>
                  <Link
                    to="/profile"
                    className="p-2.5 hover:bg-teal-light/30 rounded-full transition-all"
                  >
                    <User className="h-6 w-6 text-warmgray-700" />
                  </Link>
                  <button
                    onClick={logout}
                    className="p-2.5 hover:bg-coral-light/30 rounded-full transition-all"
                    title="Logout"
                  >
                    <LogOut className="h-6 w-6 text-warmgray-700" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-warmgray-700 font-semibold hover:text-teal transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="btn-primary"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-white/95 shadow-soft-lg mt-16 rounded-t-3xl">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-[var(--font-family-fun)] font-bold mb-4 text-warmgray-800">
                <span className="text-teal">Talkie</span>
                <span className="text-coral">Toyz</span>
              </h3>
              <p className="text-warmgray-600 leading-relaxed">
                Where fun meets learning! Quality educational toys for children aged 2-8.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-[var(--font-family-fun)] font-bold mb-4 text-warmgray-800">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/products"
                    className="text-warmgray-600 hover:text-teal transition-colors font-medium"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/assessments"
                    className="text-warmgray-600 hover:text-teal transition-colors font-medium"
                  >
                    Assessments
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog"
                    className="text-warmgray-600 hover:text-teal transition-colors font-medium"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources"
                    className="text-warmgray-600 hover:text-teal transition-colors font-medium"
                  >
                    Resources
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="text-warmgray-600 hover:text-teal transition-colors font-medium"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-warmgray-600 hover:text-teal transition-colors font-medium"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-[var(--font-family-fun)] font-bold mb-4 text-warmgray-800">Contact</h3>
              <p className="text-warmgray-600 mb-2">Email: support@talkietoyz.com</p>
              <p className="text-warmgray-600">Phone: +91 (800) 123-4567</p>
            </div>
          </div>
          <div className="border-t border-warmgray-200 mt-8 pt-6 text-center text-warmgray-500">
            <p className="font-medium">&copy; 2025 TalkieToyz. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
