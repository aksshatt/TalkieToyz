import { useState, useEffect, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import {
  Target,
  ChevronRight,
  Baby,
  Brain,
  Heart,
  Sparkles,
  Search,
  X,
  Filter,
  CheckCircle2,
  ArrowRight,
  Trophy,
} from 'lucide-react';
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
  { label: '0–6 Months', short: '0–6m', min: 0, max: 6, emoji: '🍼' },
  { label: '6–12 Months', short: '6–12m', min: 6, max: 12, emoji: '👶' },
  { label: '1–2 Years', short: '1–2y', min: 12, max: 24, emoji: '🧸' },
  { label: '2–3 Years', short: '2–3y', min: 24, max: 36, emoji: '🎨' },
  { label: '3–5 Years', short: '3–5y', min: 36, max: 60, emoji: '🚀' },
  { label: '5–8 Years', short: '5–8y', min: 60, max: 96, emoji: '🎓' },
];

const CATEGORY_ORDER = [
  'gross_motor',
  'fine_motor',
  'speech',
  'language',
  'cognitive',
  'social',
  'emotional',
];

const CATEGORY_STYLES: Record<
  string,
  { bg: string; border: string; text: string; dot: string; icon: string; label: string }
> = {
  gross_motor: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700', dot: 'bg-blue-400', icon: '🏃', label: 'Gross Motor' },
  fine_motor: { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-700', dot: 'bg-purple-400', icon: '✋', label: 'Fine Motor' },
  speech: { bg: 'bg-teal-50', border: 'border-teal-100', text: 'text-teal-700', dot: 'bg-teal-400', icon: '🗣️', label: 'Speech' },
  language: { bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-700', dot: 'bg-green-400', icon: '📖', label: 'Language' },
  cognitive: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700', dot: 'bg-amber-400', icon: '🧠', label: 'Cognitive' },
  social: { bg: 'bg-pink-50', border: 'border-pink-100', text: 'text-pink-700', dot: 'bg-pink-400', icon: '🤝', label: 'Social' },
  emotional: { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-700', dot: 'bg-red-400', icon: '❤️', label: 'Emotional' },
};

const MilestonesPage = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeRange, setActiveRange] = useState(AGE_RANGES[0].label);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadMilestones();
  }, []);

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

  const currentRange = AGE_RANGES.find((r) => r.label === activeRange)!;

  const rangeMilestones = useMemo(
    () =>
      milestones.filter(
        (m) => m.age_months_min === currentRange.min && m.age_months_max === currentRange.max
      ),
    [milestones, currentRange]
  );

  const filtered = useMemo(() => {
    return rangeMilestones.filter((m) => {
      const catOk = activeCategory === 'all' || m.category === activeCategory;
      const q = search.trim().toLowerCase();
      const qOk =
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.description?.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [rangeMilestones, activeCategory, search]);

  const grouped = useMemo(() => {
    const g: Record<string, Milestone[]> = {};
    for (const m of filtered) {
      if (!g[m.category]) g[m.category] = [];
      g[m.category].push(m);
    }
    return g;
  }, [filtered]);

  const categoryCountsForRange = useMemo(() => {
    const c: Record<string, number> = {};
    for (const m of rangeMilestones) c[m.category] = (c[m.category] || 0) + 1;
    return c;
  }, [rangeMilestones]);

  const totalMilestones = milestones.length;
  const rangeCoverage = totalMilestones > 0 ? (rangeMilestones.length / totalMilestones) * 100 : 0;

  return (
    <Layout>
      <SEO
        title="Speech & Development Milestones"
        description="Understand key speech and developmental milestones for children by age group. Track progress and find toys that support each stage of your child's growth."
        url="/milestones"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-dark via-teal to-sky py-20 px-4">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '-20%', left: '-8%' }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-sunshine/20 blur-3xl pointer-events-none"
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ bottom: '-20%', right: '-5%' }}
        />
        {[Baby, Brain, Heart, Target, Sparkles].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute text-white/15 pointer-events-none hidden md:block"
            style={{ top: `${10 + i * 16}%`, left: `${4 + i * 18}%` }}
            animate={{ y: [0, -12, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
          >
            <Icon className="w-8 h-8" />
          </motion.div>
        ))}

        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-2 rounded-full mb-5 border border-white/25"
          >
            <Target className="w-4 h-4 text-sunshine" />
            <span className="text-sm font-semibold">Age-Wise Milestone Tracker</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg"
          >
            Development <span className="text-sunshine">Milestones</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8"
          >
            Every child grows at their own pace. Here's what to look for at each stage — across
            speech, motor, cognitive and social development.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-white/85 text-sm"
          >
            <span className="inline-flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-sunshine" /> {totalMilestones} milestones tracked
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Baby className="w-4 h-4" /> 0–8 years covered
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Expert-verified
            </span>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 48C240 16 480 0 720 0C960 0 1200 16 1440 48H0Z" fill="#fdf8f0" />
          </svg>
        </div>
      </section>

      <div className="bg-cream-light min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Age range tabs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-3 text-warmgray-600 text-sm font-semibold">
              <Filter className="w-4 h-4" />
              <span>Select age range</span>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {AGE_RANGES.map((r) => {
                const count = milestones.filter(
                  (m) => m.age_months_min === r.min && m.age_months_max === r.max
                ).length;
                const active = activeRange === r.label;
                return (
                  <motion.button
                    key={r.label}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setActiveRange(r.label);
                      setActiveCategory('all');
                    }}
                    className={`relative flex flex-col items-center gap-1 p-4 rounded-2xl border-2 transition-all ${
                      active
                        ? 'bg-gradient-to-br from-teal to-teal-dark text-white border-teal shadow-soft-md'
                        : 'bg-white text-warmgray-700 border-warmgray-200 hover:border-teal/40'
                    }`}
                  >
                    <span className="text-2xl">{r.emoji}</span>
                    <span className="text-xs md:text-sm font-extrabold">{r.short}</span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                        active ? 'bg-white/25 text-white' : 'bg-warmgray-100 text-warmgray-500'
                      }`}
                    >
                      {count} items
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Progress + Search */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl shadow-soft border border-warmgray-100 p-5 mb-6 flex flex-col md:flex-row md:items-center gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-warmgray-800">
                  <span className="text-xl">{currentRange.emoji}</span>
                  <span className="font-extrabold">{currentRange.label}</span>
                </div>
                <span className="text-xs text-warmgray-500 font-semibold">
                  {rangeMilestones.length} of {totalMilestones}
                </span>
              </div>
              <div className="h-2 bg-warmgray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-teal to-sky"
                  initial={{ width: 0 }}
                  animate={{ width: `${rangeCoverage}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </div>
            <div className="relative md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warmgray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search milestones..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-cream-light border-2 border-warmgray-200 focus:border-teal focus:outline-none focus:ring-4 focus:ring-teal/10 text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-warmgray-400 hover:text-warmgray-700"
                  aria-label="Clear"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Category chips */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 flex flex-wrap gap-2"
          >
            <button
              onClick={() => setActiveCategory('all')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
                activeCategory === 'all'
                  ? 'bg-warmgray-900 text-white border-warmgray-900'
                  : 'bg-white text-warmgray-700 border-warmgray-200 hover:border-warmgray-400'
              }`}
            >
              All
              <span className={`text-[10px] px-1.5 rounded-full ${activeCategory === 'all' ? 'bg-white/25' : 'bg-warmgray-100'}`}>
                {rangeMilestones.length}
              </span>
            </button>
            {CATEGORY_ORDER.map((cat) => {
              const style = CATEGORY_STYLES[cat];
              const count = categoryCountsForRange[cat] || 0;
              if (!count) return null;
              const active = activeCategory === cat;
              return (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
                    active
                      ? `${style.bg} ${style.text} border-current`
                      : `bg-white text-warmgray-700 border-warmgray-200 hover:${style.text}`
                  }`}
                >
                  <span>{style.icon}</span>
                  {style.label}
                  <span className={`text-[10px] px-1.5 rounded-full ${active ? 'bg-white/70' : 'bg-warmgray-100'}`}>
                    {count}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-soft border border-warmgray-100 space-y-3">
                  <div className="h-4 w-1/3 bg-warmgray-200 rounded animate-shimmer" />
                  <div className="h-3 bg-warmgray-200 rounded animate-shimmer" />
                  <div className="h-3 bg-warmgray-200 rounded animate-shimmer w-3/4" />
                  <div className="h-3 bg-warmgray-200 rounded animate-shimmer w-5/6" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="max-w-md mx-auto bg-red-50 border-l-4 border-red-500 p-6 rounded-xl">
              <p className="text-red-700">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-3xl shadow-soft border border-warmgray-100"
            >
              <Target className="w-14 h-14 text-warmgray-300 mx-auto mb-4" />
              <p className="text-warmgray-700 text-lg font-bold mb-1">No milestones match</p>
              <p className="text-warmgray-500 text-sm mb-4">Try another age range, category, or search.</p>
              <button
                onClick={() => {
                  setSearch('');
                  setActiveCategory('all');
                }}
                className="inline-flex items-center gap-1.5 text-teal font-semibold hover:underline"
              >
                Reset filters <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeRange}-${activeCategory}-${search}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                {CATEGORY_ORDER.filter((cat) => grouped[cat]?.length).map((cat) => {
                  const items = grouped[cat];
                  const style = CATEGORY_STYLES[cat];
                  return (
                    <motion.div
                      key={cat}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                      className={`rounded-2xl border-2 overflow-hidden shadow-soft bg-white`}
                    >
                      <div className={`flex items-center justify-between px-5 py-3 ${style.bg} border-b-2 ${style.border}`}>
                        <div className={`inline-flex items-center gap-2 font-extrabold ${style.text}`}>
                          <span className="text-lg">{style.icon}</span>
                          {style.label}
                        </div>
                        <span className="text-xs font-semibold text-warmgray-600 bg-white/80 px-2 py-0.5 rounded-full">
                          {items.length}
                        </span>
                      </div>
                      <ul className="p-5 space-y-3">
                        {items.map((m) => (
                          <li key={m.id} className="flex items-start gap-3 group">
                            <div className={`mt-0.5 w-5 h-5 rounded-full ${style.bg} ${style.text} flex items-center justify-center flex-shrink-0 border ${style.border}`}>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-warmgray-900">{m.title}</p>
                              {m.description && (
                                <p className="text-xs text-warmgray-600 mt-0.5 line-clamp-2">{m.description}</p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-14 relative overflow-hidden bg-gradient-to-br from-teal via-teal-dark to-sky rounded-3xl p-8 sm:p-12 text-center text-white shadow-soft-xl"
          >
            <motion.div
              className="absolute w-52 h-52 rounded-full bg-white/10 blur-3xl pointer-events-none"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ top: '-20%', right: '10%' }}
            />
            <motion.div
              className="absolute w-40 h-40 rounded-full bg-sunshine/20 blur-3xl pointer-events-none"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              style={{ bottom: '-20%', left: '10%' }}
            />
            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-5"
              >
                <Target className="w-7 h-7 text-white" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Want personalised guidance?</h2>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                Take our comprehensive assessment to get customised recommendations for your child's
                development — or book a 1:1 session with our experts.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/assessments"
                  className="inline-flex items-center gap-2 bg-white text-teal font-extrabold px-7 py-3.5 rounded-full shadow-soft-lg hover:shadow-soft-xl transition-all"
                >
                  Take Assessment <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/book"
                  className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border-2 border-white/40 text-white font-extrabold px-7 py-3.5 rounded-full hover:bg-white/25 transition-all"
                >
                  Book a Session <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default MilestonesPage;
