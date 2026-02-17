import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Target, ChevronDown, ChevronRight } from 'lucide-react';
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
  { label: '0\u20136 Months', min: 0, max: 6 },
  { label: '6\u201312 Months', min: 6, max: 12 },
  { label: '1\u20132 Years', min: 12, max: 24 },
  { label: '2\u20133 Years', min: 24, max: 36 },
  { label: '3\u20135 Years', min: 36, max: 60 },
  { label: '5\u20138 Years', min: 60, max: 96 },
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

const CATEGORY_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  gross_motor: { bg: 'bg-blue-50', text: 'text-blue-700', icon: '\uD83C\uDFC3' },
  fine_motor: { bg: 'bg-purple-50', text: 'text-purple-700', icon: '\u270B' },
  speech: { bg: 'bg-teal/10', text: 'text-teal', icon: '\uD83D\uDDE3\uFE0F' },
  language: { bg: 'bg-green-50', text: 'text-green-700', icon: '\uD83D\uDCD6' },
  cognitive: { bg: 'bg-amber-50', text: 'text-amber-700', icon: '\uD83E\uDDE0' },
  social: { bg: 'bg-pink-50', text: 'text-pink-700', icon: '\uD83E\uDD1D' },
  emotional: { bg: 'bg-red-50', text: 'text-red-700', icon: '\u2764\uFE0F' },
};

const MilestonesPage = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openAgeRange, setOpenAgeRange] = useState<string>('0\u20136 Months');

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

  const getMilestonesForAgeRange = (min: number, max: number) => {
    return milestones.filter(
      (m) => m.age_months_min === min && m.age_months_max === max
    );
  };

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
      <div className="min-h-screen bg-gradient-to-b from-white to-cream-light/30 py-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal/10 rounded-2xl mb-6">
              <Target className="h-8 w-8 text-teal" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-warmgray-900 mb-4">
              Child Development Milestones
            </h1>
            <p className="text-lg text-warmgray-600 max-w-2xl mx-auto">
              Track your child's growth across key developmental areas. Milestones are organized by age range to help you understand what to expect at each stage.
            </p>
          </div>

          {/* Category Legend */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {CATEGORY_ORDER.map((cat) => {
              const color = CATEGORY_COLORS[cat];
              const displayName = cat.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
              return (
                <span
                  key={cat}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${color.bg} ${color.text}`}
                >
                  <span>{color.icon}</span>
                  {displayName}
                </span>
              );
            })}
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal border-t-transparent mx-auto"></div>
              <p className="text-warmgray-600 mt-4">Loading milestones...</p>
            </div>
          ) : error ? (
            <div className="max-w-md mx-auto bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          ) : milestones.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-warmgray-600">No milestones available at this time.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {AGE_RANGES.map((range) => {
                const isOpen = openAgeRange === range.label;
                const rangeMilestones = getMilestonesForAgeRange(range.min, range.max);
                const grouped = groupByCategory(rangeMilestones);

                return (
                  <div
                    key={range.label}
                    className="bg-white rounded-2xl shadow-md border border-warmgray-100 overflow-hidden"
                  >
                    {/* Accordion Header */}
                    <button
                      onClick={() => setOpenAgeRange(isOpen ? '' : range.label)}
                      className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-warmgray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-teal">
                          {range.label}
                        </span>
                        <span className="text-sm text-warmgray-400">
                          {rangeMilestones.length} milestones
                        </span>
                      </div>
                      {isOpen ? (
                        <ChevronDown className="h-5 w-5 text-warmgray-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-warmgray-400" />
                      )}
                    </button>

                    {/* Accordion Content */}
                    {isOpen && (
                      <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {CATEGORY_ORDER.map((cat) => {
                          const items = grouped[cat];
                          if (!items || items.length === 0) return null;
                          const color = CATEGORY_COLORS[cat];
                          const displayName = cat
                            .replace('_', ' ')
                            .replace(/\b\w/g, (c) => c.toUpperCase());

                          return (
                            <div
                              key={cat}
                              className={`rounded-xl p-4 ${color.bg}`}
                            >
                              <h3 className={`font-semibold text-sm mb-3 ${color.text} flex items-center gap-2`}>
                                <span>{color.icon}</span>
                                {displayName}
                              </h3>
                              <ul className="space-y-1.5">
                                {items.map((m) => (
                                  <li
                                    key={m.id}
                                    className="flex items-start gap-2 text-sm text-warmgray-700"
                                  >
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-warmgray-400 flex-shrink-0" />
                                    {m.title}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-br from-teal via-teal-dark to-warmgray-800 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">
              Want Personalized Guidance?
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Take our comprehensive assessment to get customized recommendations for your child's development.
            </p>
            <a
              href="/assessments"
              className="inline-block bg-white text-teal font-semibold px-8 py-4 rounded-lg hover:bg-warmgray-50 transition-all shadow-lg hover:shadow-xl"
            >
              Take Assessment
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MilestonesPage;
