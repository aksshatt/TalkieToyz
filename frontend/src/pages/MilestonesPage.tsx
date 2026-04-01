import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Target, ChevronDown, ChevronRight, Baby, Brain, Heart, Sparkles } from 'lucide-react';
import SEO from '../components/common/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from '../config/axios';

interface Milestone {
  id: number;
  title: string;
  description: string;
  category: string;
  category_display_name: string;
  age_months_min: number;
  age_months_max: number;
}

const AGE_RANGES = [
  { label: '0–6 Months', min: 0, max: 6 },
  { label: '6–12 Months', min: 6, max: 12 },
  { label: '1–2 Years', min: 12, max: 24 },
  { label: '2–3 Years', min: 24, max: 36 },
  { label: '3–5 Years', min: 36, max: 60 },
  { label: '5–8 Years', min: 60, max: 96 },
];

const CATEGORY_ORDER = [
  'gross_motor', 'fine_motor', 'speech', 'language', 'cognitive', 'social', 'emotional',
];

const CATEGORY_STYLES: Record<string, { bg: string; border: string; text: string; dot: string; icon: string }> = {
  gross_motor: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700', dot: 'bg-blue-400', icon: '🏃' },
  fine_motor:  { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-700', dot: 'bg-purple-400', icon: '✋' },
  speech:      { bg: 'bg-teal-50', border: 'border-teal-100', text: 'text-teal-700', dot: 'bg-teal-400', icon: '🗣️' },
  language:    { bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-700', dot: 'bg-green-400', icon: '📖' },
  cognitive:   { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700', dot: 'bg-amber-400', icon: '🧠' },
  social:      { bg: 'bg-pink-50', border: 'border-pink-100', text: 'text-pink-700', dot: 'bg-pink-400', icon: '🤝' },
  emotional:   { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-700', dot: 'bg-red-400', icon: '❤️' },
};

// Gradient per age range for the accordion header
const RANGE_GRADIENTS = [
  'from-teal-light/60 to-sky-light/40',
  'from-sky-light/60 to-blue-50',
  'from-sunshine-light/60 to-teal-light/30',
  'from-coral-light/50 to-sunshine-light/40',
  'from-purple-50 to-pink-50',
  'from-teal-light/40 to-coral-light/30',
];

const MilestonesPage = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openAgeRange, setOpenAgeRange] = useState<string>('0–6 Months');

  useEffect(() => { loadMilestones(); }, []);

  const loadMilestones = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/milestones?per_page=250');
      setMilestones(response.data.data || []);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load milestones:', err);
      setError('Failed to load milestones. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getMilestonesForAgeRange = (min: number, max: number) =>
    milestones.filter((m) => m.age_months_min === min && m.age_months_max === max);

  const groupByCategory = (items: Milestone[]) => {
    const grouped: Record<string, Milestone[]> = {};
    for (const m of items) {
      if (!grouped[m.category]) grouped[m.category] = [];
      grouped[m.category].push(m);
    }
    return grouped;
  };

  return (
    <Layout>
      <SEO
        title="Speech & Development Milestones"
        description="Understand key speech and developmental milestones for children by age group. Track progress and find toys that support each stage of your child's growth."
        url="/milestones"
      />
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-dark via-teal to-sky py-20 px-4">
        <motion.div className="absolute w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"
          animate={{ x: [0, 32, 0], y: [0, -22, 0] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '-15%', left: '-8%' }} />
        <motion.div className="absolute w-72 h-72 rounded-full bg-sunshine/20 blur-3xl pointer-events-none"
          animate={{ x: [0, -18, 0], y: [0, 26, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ bottom: '-15%', right: '5%' }} />
        <motion.div className="absolute w-48 h-48 rounded-full bg-coral/15 blur-2xl pointer-events-none"
          animate={{ x: [0, 16, -12, 0], y: [0, -16, 12, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{ top: '28%', right: '18%' }} />

        {[Baby, Brain, Heart, Target, Sparkles].map((Icon, i) => (
          <motion.div key={i} className="absolute text-white/12 pointer-events-none"
            style={{ top: `${10 + i * 18}%`, left: `${5 + i * 18}%` }}
            animate={{ y: [0, -12, 0], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 4.5 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }}>
            <Icon className="w-7 h-7" />
          </motion.div>
        ))}

        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <Target className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-4xl md:text-5xl font-[var(--font-family-fun)] font-bold mb-4">
            Child Development <span className="text-sunshine">Milestones</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="text-lg text-white/85 max-w-xl mx-auto">
            Track your child's growth across key developmental areas, organized by age range.
          </motion.p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 48C240 16 480 0 720 0C960 0 1200 16 1440 48H0Z" fill="white" />
          </svg>
        </div>
      </div>

      <div className="bg-white min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4">

          {/* Category Legend */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-2 justify-center mb-10">
            {CATEGORY_ORDER.map((cat, i) => {
              const style = CATEGORY_STYLES[cat];
              const displayName = cat.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
              return (
                <motion.span key={cat}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.06, y: -2 }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${style.bg} ${style.text} ${style.border} cursor-default shadow-sm`}
                >
                  <span>{style.icon}</span>
                  {displayName}
                </motion.span>
              );
            })}
          </motion.div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal border-t-transparent mx-auto" />
              <p className="text-warmgray-600 mt-4">Loading milestones...</p>
            </div>
          ) : error ? (
            <div className="max-w-md mx-auto bg-red-50 border-l-4 border-red-500 p-6 rounded-xl">
              <p className="text-red-700">{error}</p>
            </div>
          ) : milestones.length === 0 ? (
            <div className="text-center py-20 text-warmgray-600">No milestones available at this time.</div>
          ) : (
            <div className="space-y-3">
              {AGE_RANGES.map((range, rangeIdx) => {
                const isOpen = openAgeRange === range.label;
                const rangeMilestones = getMilestonesForAgeRange(range.min, range.max);
                const grouped = groupByCategory(rangeMilestones);
                const gradient = RANGE_GRADIENTS[rangeIdx % RANGE_GRADIENTS.length];

                return (
                  <motion.div key={range.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: rangeIdx * 0.06 }}
                    className="bg-white rounded-2xl shadow-soft border border-warmgray-100 overflow-hidden"
                  >
                    {/* Accordion Header */}
                    <button
                      onClick={() => setOpenAgeRange(isOpen ? '' : range.label)}
                      className={`w-full flex items-center justify-between px-6 py-5 text-left bg-gradient-to-r ${gradient} hover:brightness-95 transition-all`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-warmgray-900">{range.label}</span>
                        <span className="text-sm text-warmgray-500 bg-white/60 px-2.5 py-0.5 rounded-full font-medium">
                          {rangeMilestones.length} milestones
                        </span>
                      </div>
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                        <ChevronDown className="h-5 w-5 text-warmgray-500" />
                      </motion.div>
                    </button>

                    {/* Accordion Content */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {CATEGORY_ORDER.map((cat) => {
                              const items = grouped[cat];
                              if (!items || items.length === 0) return null;
                              const style = CATEGORY_STYLES[cat];
                              const displayName = cat.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

                              return (
                                <motion.div key={cat}
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className={`rounded-xl p-4 border ${style.bg} ${style.border}`}
                                >
                                  <h3 className={`font-semibold text-sm mb-3 ${style.text} flex items-center gap-2`}>
                                    <span>{style.icon}</span>
                                    {displayName}
                                  </h3>
                                  <ul className="space-y-2">
                                    {items.map((m) => (
                                      <li key={m.id} className="flex items-start gap-2 text-sm text-warmgray-700">
                                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${style.dot} flex-shrink-0`} />
                                        {m.title}
                                      </li>
                                    ))}
                                  </ul>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-14 relative overflow-hidden bg-gradient-to-br from-teal via-teal-dark to-sky rounded-3xl p-8 sm:p-12 text-center text-white shadow-soft-xl"
          >
            <motion.div className="absolute w-52 h-52 rounded-full bg-white/10 blur-3xl pointer-events-none"
              animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ top: '-20%', right: '10%' }} />
            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, 6, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-5"
              >
                <Target className="w-7 h-7 text-white" />
              </motion.div>
              <h2 className="text-3xl font-[var(--font-family-fun)] font-bold mb-4">Want Personalized Guidance?</h2>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                Take our comprehensive assessment to get customized recommendations for your child's development.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to="/assessments"
                  className="inline-flex items-center gap-2 bg-white text-teal font-bold px-8 py-4 rounded-2xl shadow-soft-lg hover:shadow-soft-xl transition-shadow"
                >
                  Take Assessment
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </Layout>
  );
};

export default MilestonesPage;
