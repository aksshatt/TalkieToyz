import { Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';
import TherapistRoute from './components/auth/TherapistRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import WhatsAppButton from './components/common/WhatsAppButton';
import ScrollToTopButton from './components/common/ScrollToTopButton';
import { useAppDispatch } from './store/hooks';
import { fetchCart } from './store/slices/cartSlice';

// Eager: Home (LCP), NotFound (small)
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Lazy everything else — keeps initial bundle small
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const Profile = lazy(() => import('./pages/Profile'));
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const AssessmentList = lazy(() => import('./pages/AssessmentList'));
const AssessmentDetail = lazy(() => import('./pages/AssessmentDetail'));
const AssessmentResultsPage = lazy(() => import('./pages/AssessmentResultsPage'));
const MilestonesPage = lazy(() => import('./pages/MilestonesPage'));
const BlogList = lazy(() => import('./pages/BlogList'));
const BlogPostDetail = lazy(() => import('./pages/BlogPostDetail'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const BookSession = lazy(() => import('./pages/BookSession'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const AssessmentHistoryPage = lazy(() => import('./pages/AssessmentHistoryPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const ShopByGoalQuiz = lazy(() => import('./pages/ShopByGoalQuiz'));
const ChildProfilesPage = lazy(() => import('./pages/ChildProfilesPage'));
const ChildProgressDashboard = lazy(() => import('./pages/ChildProgressDashboard'));
const LoyaltyDashboard = lazy(() => import('./pages/LoyaltyDashboard'));
const BundleBuilderPage = lazy(() => import('./pages/BundleBuilderPage'));
const PatientInbox = lazy(() => import('./pages/patient/PatientInbox'));

// Therapist
const TherapistLayout = lazy(() => import('./components/therapist/TherapistLayout'));
const TherapistPatients = lazy(() => import('./pages/therapist/TherapistPatients'));
const TherapistPatientDetail = lazy(() => import('./pages/therapist/TherapistPatientDetail'));
const TherapistMessages = lazy(() => import('./pages/therapist/TherapistMessages'));
const TherapistTemplates = lazy(() => import('./pages/therapist/TherapistTemplates'));

// Admin (heavy bundle — fully lazy)
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Products = lazy(() => import('./pages/admin/Products'));
const Orders = lazy(() => import('./pages/admin/Orders'));
const Customers = lazy(() => import('./pages/admin/Customers'));
const BlogManagement = lazy(() => import('./pages/admin/BlogManagement'));
const BlogPostFormPage = lazy(() => import('./pages/admin/BlogPostFormPage'));
const ResourceManagement = lazy(() => import('./pages/admin/ResourceManagement'));
const ResourceFormPage = lazy(() => import('./pages/admin/ResourceFormPage'));
const ReviewModeration = lazy(() => import('./components/admin/ReviewModeration'));
const FAQManagement = lazy(() => import('./pages/admin/FAQManagement'));
const ContentManagement = lazy(() => import('./pages/admin/ContentManagement'));
const Appointments = lazy(() => import('./pages/admin/Appointments'));
const ContactSubmissions = lazy(() => import('./pages/admin/ContactSubmissions'));
const Analytics = lazy(() => import('./pages/admin/Analytics'));
const AssessmentResultsAdmin = lazy(() => import('./pages/admin/AssessmentResultsAdmin'));
const AuditLog = lazy(() => import('./pages/admin/AuditLog'));
const SuccessStories = lazy(() => import('./pages/admin/SuccessStories'));
const ProductQuestions = lazy(() => import('./pages/admin/ProductQuestions'));
const CouponGenerator = lazy(() => import('./pages/admin/CouponGenerator'));
const TherapistApprovals = lazy(() => import('./pages/admin/TherapistApprovals'));
const TherapistManagement = lazy(() => import('./pages/admin/TherapistManagement'));
const ConversationMonitor = lazy(() => import('./pages/admin/ConversationMonitor'));
const ServicesAdmin = lazy(() => import('./pages/admin/ServicesAdmin'));

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

function RouteFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-teal/30 border-t-teal rounded-full animate-spin" />
    </div>
  );
}

function App() {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Suspense fallback={<RouteFallback />}>
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

              {/* Cart & Checkout */}
              <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
              <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
              <Route path="/order-confirmation" element={<PrivateRoute><OrderConfirmation /></PrivateRoute>} />

              {/* Order Routes */}
              <Route path="/orders" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
              <Route path="/orders/:id" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />

              {/* Protected */}
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

              {/* Assessment */}
              <Route path="/assessments" element={<PageWrapper><AssessmentList /></PageWrapper>} />
              <Route path="/assessments/:slug" element={<PageWrapper><AssessmentDetail /></PageWrapper>} />
              <Route path="/assessment/results/:id" element={<PageWrapper><AssessmentResultsPage /></PageWrapper>} />
              <Route path="/my-assessments" element={<PrivateRoute><AssessmentHistoryPage /></PrivateRoute>} />
              <Route path="/wishlist" element={<PrivateRoute><WishlistPage /></PrivateRoute>} />

              {/* Milestones */}
              <Route path="/milestones" element={<PageWrapper><MilestonesPage /></PageWrapper>} />

              {/* Quiz */}
              <Route path="/quiz" element={<PageWrapper><ShopByGoalQuiz /></PageWrapper>} />

              {/* Speech Kits */}
              <Route path="/speech-kits" element={<PageWrapper><BundleBuilderPage /></PageWrapper>} />

              {/* Child Profiles & Progress */}
              <Route path="/children" element={<PrivateRoute><ChildProfilesPage /></PrivateRoute>} />
              <Route path="/children/:id" element={<PrivateRoute><ChildProgressDashboard /></PrivateRoute>} />

              {/* Loyalty */}
              <Route path="/loyalty" element={<PrivateRoute><LoyaltyDashboard /></PrivateRoute>} />

              {/* Patient Inbox */}
              <Route path="/messages" element={<PrivateRoute><PatientInbox /></PrivateRoute>} />

              {/* Therapist */}
              <Route
                path="/therapist"
                element={<TherapistRoute><TherapistLayout /></TherapistRoute>}
              >
                <Route index element={<TherapistPatients />} />
                <Route path="patients" element={<TherapistPatients />} />
                <Route path="patients/:id" element={<TherapistPatientDetail />} />
                <Route path="messages" element={<TherapistMessages />} />
                <Route path="templates" element={<TherapistTemplates />} />
              </Route>

              {/* Blog */}
              <Route path="/blog" element={<PageWrapper><BlogList /></PageWrapper>} />
              <Route path="/blog/:slug" element={<PageWrapper><BlogPostDetail /></PageWrapper>} />

              {/* Resources */}
              <Route path="/resources" element={<PageWrapper><ResourcesPage /></PageWrapper>} />

              {/* Communication */}
              <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
              <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
              <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
              <Route path="/book" element={<PageWrapper><BookSession /></PageWrapper>} />
              <Route path="/terms" element={<PageWrapper><Terms /></PageWrapper>} />
              <Route path="/privacy" element={<PageWrapper><Privacy /></PageWrapper>} />
              <Route path="/faq" element={<PageWrapper><FAQ /></PageWrapper>} />

              {/* Admin */}
              <Route
                path="/admin"
                element={<AdminRoute><AdminLayout /></AdminRoute>}
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
                <Route path="services" element={<ServicesAdmin />} />
                <Route path="assessments" element={<AssessmentResultsAdmin />} />
                <Route path="contact" element={<ContactSubmissions />} />
                <Route path="audit-log" element={<AuditLog />} />
                <Route path="success-stories" element={<SuccessStories />} />
                <Route path="product-questions" element={<ProductQuestions />} />
                <Route path="coupons" element={<CouponGenerator />} />
                <Route path="therapist-approvals" element={<TherapistApprovals />} />
                <Route path="therapist-management" element={<TherapistManagement />} />
                <Route path="conversations" element={<ConversationMonitor />} />
              </Route>

              <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </Suspense>

        <WhatsAppButton />
        <ScrollToTopButton />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
