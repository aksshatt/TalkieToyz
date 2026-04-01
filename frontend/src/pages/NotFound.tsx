import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, BookOpen } from 'lucide-react';
import Layout from '../components/layout/Layout';
import SEO from '../components/common/SEO';

const floatingToys = ['🧸', '🎨', '🧩', '📚', '✏️', '🎭', '🎪', '🪀'];

const NotFound = () => {
  return (
    <Layout>
      <SEO title="Page Not Found" noindex />
      <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden">

        {/* Animated background blobs */}
        <motion.div className="absolute w-96 h-96 rounded-full bg-teal/10 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '-10%', left: '-10%' }}
        />
        <motion.div className="absolute w-80 h-80 rounded-full bg-coral/10 blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ bottom: '-10%', right: '-10%' }}
        />

        {/* Floating toy emojis */}
        {floatingToys.map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl select-none pointer-events-none"
            style={{
              left: `${8 + (i * 12)}%`,
              top: `${10 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 3 + i * 0.4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          >
            {emoji}
          </motion.div>
        ))}

        <div className="relative text-center max-w-lg mx-auto z-10">
          {/* 404 number */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="relative inline-block mb-6"
          >
            <span className="text-[10rem] sm:text-[14rem] font-[var(--font-family-fun)] font-bold leading-none select-none"
              style={{
                background: 'linear-gradient(135deg, #4DD0E1 0%, #FF85C0 50%, #FFD54F 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              404
            </span>
            {/* Wiggling toy on top of 4 */}
            <motion.span
              className="absolute -top-4 -right-2 text-5xl"
              animate={{ rotate: [0, 20, -20, 10, 0], y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              🧸
            </motion.span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl sm:text-4xl font-[var(--font-family-fun)] font-bold text-warmgray-800 mb-3"
          >
            Oops! Toy got lost 🔍
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-warmgray-500 text-lg mb-8 leading-relaxed"
          >
            Looks like this page wandered off to play somewhere else. Let's get you back on track!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal to-teal-dark text-white font-bold rounded-full shadow-soft-lg hover:shadow-soft-xl transition-shadow"
              >
                <Home className="w-5 h-5" /> Go Home
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-coral to-coral-dark text-white font-bold rounded-full shadow-soft-lg hover:shadow-soft-xl transition-shadow"
              >
                <ShoppingBag className="w-5 h-5" /> Shop Toys
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/assessments"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-warmgray-300 text-warmgray-700 font-bold rounded-full hover:bg-warmgray-50 transition-colors"
              >
                <BookOpen className="w-5 h-5" /> Take a Quiz
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
