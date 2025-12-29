import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useEffect } from 'react';
import { useAppDispatch } from './store/hooks';
import { fetchCart } from './store/slices/cartSlice';

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
import OrderConfirmation from './pages/OrderConfirmation';

// Assessment & Progress Pages
import AssessmentList from './pages/AssessmentList';
import AssessmentDetail from './pages/AssessmentDetail';
import AssessmentResultsPage from './pages/AssessmentResultsPage';
import MilestonesPage from './pages/MilestonesPage';
import ProgressTracker from './pages/ProgressTracker';
import ProgressLogFormPage from './pages/ProgressLogFormPage';
import ProgressLogDetail from './pages/ProgressLogDetail';

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

// Communication Components
import WhatsAppButton from './components/common/WhatsAppButton';
import TawkToChat from './components/common/TawkToChat';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Load cart on app mount
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Product Routes */}
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:slug" element={<ProductDetail />} />

          {/* Cart & Checkout Routes */}
          <Route path="/cart" element={<Cart />} />
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
          <Route path="/assessments" element={<AssessmentList />} />
          <Route path="/assessments/:slug" element={<AssessmentDetail />} />
          <Route path="/assessment/results/:id" element={<AssessmentResultsPage />} />

          {/* Milestone Routes */}
          <Route path="/milestones" element={<MilestonesPage />} />

          {/* Progress Tracking Routes */}
          <Route
            path="/progress"
            element={
              <PrivateRoute>
                <ProgressTracker />
              </PrivateRoute>
            }
          />
          <Route
            path="/progress/log/new"
            element={
              <PrivateRoute>
                <ProgressLogFormPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/progress/log/:id"
            element={
              <PrivateRoute>
                <ProgressLogDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/progress/log/:id/edit"
            element={
              <PrivateRoute>
                <ProgressLogFormPage />
              </PrivateRoute>
            }
          />

          {/* Blog Routes */}
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPostDetail />} />

          {/* Resource Routes */}
          <Route path="/resources" element={<ResourcesPage />} />

          {/* Communication Routes */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />

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
            <Route path="reviews" element={<ReviewModeration />} />
            <Route path="blog" element={<BlogManagement />} />
            <Route path="blog/new" element={<BlogPostFormPage />} />
            <Route path="blog/edit/:slug" element={<BlogPostFormPage />} />
            <Route path="resources" element={<ResourceManagement />} />
            <Route path="resources/new" element={<ResourceFormPage />} />
            <Route path="resources/edit/:slug" element={<ResourceFormPage />} />
            <Route path="faqs" element={<FAQManagement />} />
            <Route path="content" element={<ContentManagement />} />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Floating Communication Components */}
        <WhatsAppButton />
        <TawkToChat />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
