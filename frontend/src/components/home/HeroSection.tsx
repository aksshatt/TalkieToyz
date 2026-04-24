import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, BookOpen, Calendar } from 'lucide-react';
import BookAppointmentModal from '../common/BookAppointmentModal';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
} as const;

const HeroSection = () => {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
      {/* Background Image with Ken Burns zoom-out */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 9, ease: 'easeOut' }}
      >
        <img
          src="/hero-image1.jpg"
          alt="Diverse toddlers playing with educational toys on a soft mat"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=2000&auto=format&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-warmgray-900/75 via-warmgray-900/50 to-transparent md:from-warmgray-900/70 md:via-warmgray-900/40 md:to-transparent"></div>
      </motion.div>

      {/* Floating decorative blobs */}
      <motion.div
        className="absolute top-14 right-20 w-20 h-20 rounded-full bg-sunshine/25 hidden md:block"
        animate={{ y: [0, -18, 0], rotate: [0, 12, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-28 right-36 w-12 h-12 rounded-full bg-coral/25 hidden md:block"
        animate={{ y: [0, 14, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
      />
      <motion.div
        className="absolute top-36 right-52 w-9 h-9 rounded-full bg-teal/25 hidden md:block"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
      />
      <motion.div
        className="absolute top-1/2 right-12 w-6 h-6 rounded-full bg-white/20 hidden lg:block"
        animate={{ y: [0, -8, 0], x: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      />

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col justify-center h-full max-w-2xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-[var(--font-family-fun)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 drop-shadow-lg"
          >
            Where Every Playtime Becomes a{' '}
            <motion.span
              className="text-sunshine inline-block"
              animate={{ rotate: [0, -1, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            >
              Learning Moment
            </motion.span>
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl md:text-2xl text-white/95 leading-relaxed mb-8 drop-shadow-md font-medium max-w-xl"
          >
            Expert-curated educational toys that nurture development, spark creativity, and make learning joyful.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/products"
                className="group inline-flex items-center justify-center px-8 py-4 bg-teal hover:bg-teal-dark text-black font-bold text-lg rounded-full shadow-soft-lg hover:shadow-xl transition-colors duration-300"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Shop Learning Toys
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/assessments"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/95 backdrop-blur-sm hover:bg-white text-black font-bold text-lg rounded-full border-2 border-white shadow-soft hover:shadow-lg transition-colors duration-300"
              >
                <Sparkles className="w-5 h-5 mr-2 text-sunshine" />
                Take the Development Quiz
              </Link>
            </motion.div>
            <motion.button
              onClick={() => setShowBooking(true)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center justify-center px-8 py-4 bg-coral hover:bg-coral-dark text-black font-bold text-lg rounded-full shadow-soft hover:shadow-lg transition-colors duration-300"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Appointment
            </motion.button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div variants={itemVariants} className="mt-10 flex flex-wrap gap-3">
            {[
              { color: 'bg-teal', label: 'Safe & Certified' },
              { color: 'bg-sunshine', label: 'Expert Approved' },
              { color: 'bg-coral', label: 'Age-Appropriate' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                className="inline-flex items-center gap-2 bg-warmgray-900/70 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 shadow-soft"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + i * 0.12, duration: 0.45 }}
              >
                <motion.div
                  className={`w-2.5 h-2.5 ${item.color} rounded-full flex-shrink-0`}
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                />
                <span className="text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Soft Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent pointer-events-none"></div>
      <BookAppointmentModal isOpen={showBooking} onClose={() => setShowBooking(false)} />
    </section>
  );
};

export default HeroSection;
