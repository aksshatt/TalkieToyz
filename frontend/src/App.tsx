import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import NotFound from './pages/NotFound';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useEffect } from 'react';
import { useAppDispatch } from './store/hooks';
import { fetchCart } from './store/slices/cartSlice';
import { AnimatePresence, motion } from 'framer-motion';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Profile from './pages/Profile';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import OrderDetail from './pages/OrderDetail';
import OrderConfirmation from './pages/OrderConfirmation';

// Assessment Pages
import AssessmentList from './pages/AssessmentList';
import AssessmentDetail from './pages/AssessmentDetail';
import AssessmentResultsPage from './pages/AssessmentResultsPage';
import MilestonesPage from './pages/MilestonesPage';

// Blog & Resource Pages
import BlogList from './pages/BlogList';
import BlogPostDetail from './pages/BlogPostDetail';
import ResourcesPage from './pages/ResourcesPage';

// Communication Pages
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import About from './pages/About';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Customers from './pages/admin/Customers';
import BlogManagement from './pages/admin/BlogManagement';
import BlogPostFormPage from './pages/admin/BlogPostFormPage';
import ResourceManagement from './pages/admin/ResourceManagement';
import ResourceFormPage from './pages/admin/ResourceFormPage';
import ReviewModeration from './components/admin/ReviewModeration';
import FAQManagement from './pages/admin/FAQManagement';
import ContentManagement from './pages/admin/ContentManagement';
import Appointments from './pages/admin/Appointments';
import ContactSubmissions from './pages/admin/ContactSubmissions';
import Analytics from './pages/admin/Analytics';
import AssessmentResultsAdmin from './pages/admin/AssessmentResultsAdmin';
import AuditLog from './pages/admin/AuditLog';
import AssessmentHistoryPage from './pages/AssessmentHistoryPage';
import WishlistPage from './pages/WishlistPage';

// Communication Components
import WhatsAppButton from './components/common/WhatsAppButton';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
} as const;

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit">
      {children}
    </motion.div>
  );
}

function App() {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    // Load cart on app mount
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
          <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
          <Route path="/reset-password" element={<PageWrapper><ResetPassword /></PageWrapper>} />

          {/* Product Routes */}
          <Route path="/products" element={<PageWrapper><ProductList /></PageWrapper>} />
          <Route path="/products/:slug" element={<PageWrapper><ProductDetail /></PageWrapper>} />

          {/* Cart & Checkout Routes */}
          <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />
          <Route
            path="/order-confirmation"
            element={
              <PrivateRoute>
                <OrderConfirmation />
              </PrivateRoute>
            }
          />

          {/* Order Routes */}
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <OrderHistory />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <PrivateRoute>
                <OrderDetail />
              </PrivateRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Assessment Routes */}
          <Route path="/assessments" element={<PageWrapper><AssessmentList /></PageWrapper>} />
          <Route path="/assessments/:slug" element={<PageWrapper><AssessmentDetail /></PageWrapper>} />
          <Route path="/assessment/results/:id" element={<PageWrapper><AssessmentResultsPage /></PageWrapper>} />

          <Route
            path="/my-assessments"
            element={
              <PrivateRoute>
                <AssessmentHistoryPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <PrivateRoute>
                <WishlistPage />
              </PrivateRoute>
            }
          />

          {/* Milestone Routes */}
          <Route path="/milestones" element={<PageWrapper><MilestonesPage /></PageWrapper>} />

          {/* Blog Routes */}
          <Route path="/blog" element={<PageWrapper><BlogList /></PageWrapper>} />
          <Route path="/blog/:slug" element={<PageWrapper><BlogPostDetail /></PageWrapper>} />

          {/* Resource Routes */}
          <Route path="/resources" element={<PageWrapper><ResourcesPage /></PageWrapper>} />

          {/* Communication Routes */}
          <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
          <Route path="/faq" element={<PageWrapper><FAQ /></PageWrapper>} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="reviews" element={<ReviewModeration />} />
            <Route path="blog" element={<BlogManagement />} />
            <Route path="blog/new" element={<BlogPostFormPage />} />
            <Route path="blog/edit/:slug" element={<BlogPostFormPage />} />
            <Route path="resources" element={<ResourceManagement />} />
            <Route path="resources/new" element={<ResourceFormPage />} />
            <Route path="resources/edit/:slug" element={<ResourceFormPage />} />
            <Route path="faqs" element={<FAQManagement />} />
            <Route path="content" element={<ContentManagement />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="assessments" element={<AssessmentResultsAdmin />} />
            <Route path="contact" element={<ContactSubmissions />} />
            <Route path="audit-log" element={<AuditLog />} />
          </Route>

          {/* Catch all - 404 page */}
          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        </Routes>
        </AnimatePresence>

        {/* Floating Communication Components */}
        <WhatsAppButton />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
