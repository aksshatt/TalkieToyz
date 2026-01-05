import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Target, Calendar, CheckCircle } from 'lucide-react';
import axios from '../config/axios';

interface Milestone {
  id: number;
  title: string;
  description: string;
  age_range_start: number;
  age_range_end: number;
  category: string;
}

const MilestonesPage = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMilestones();
  }, []);

  const loadMilestones = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/milestones');
      setMilestones(response.data.data || []);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load milestones:', err);
      setError('Failed to load milestones. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getAgeRangeText = (start: number, end: number) => {
    const startYears = Math.floor(start / 12);
    const startMonths = start % 12;
    const endYears = Math.floor(end / 12);
    const endMonths = end % 12;

    const formatAge = (years: number, months: number) => {
      if (years === 0) return `${months} months`;
      if (months === 0) return `${years} ${years === 1 ? 'year' : 'years'}`;
      return `${years}y ${months}m`;
    };

    return `${formatAge(startYears, startMonths)} - ${formatAge(endYears, endMonths)}`;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-cream-light/30 py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal/10 rounded-2xl mb-6">
              <Target className="h-8 w-8 text-teal" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-warmgray-900 mb-4">
              Speech Development Milestones
            </h1>
            <p className="text-lg text-warmgray-600 max-w-2xl mx-auto">
              Track your child's speech and language development with these age-appropriate milestones designed by professional therapists.
            </p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-warmgray-100 hover:border-teal/30"
                >
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block px-3 py-1 bg-teal/10 text-teal text-xs font-semibold rounded-full">
                      {milestone.category}
                    </span>
                    <CheckCircle className="h-5 w-5 text-warmgray-300" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-warmgray-900 mb-3">
                    {milestone.title}
                  </h3>

                  {/* Description */}
                  <p className="text-warmgray-600 text-sm mb-4 leading-relaxed">
                    {milestone.description}
                  </p>

                  {/* Age Range */}
                  <div className="flex items-center gap-2 text-sm text-warmgray-500 pt-4 border-t border-warmgray-100">
                    <Calendar className="h-4 w-4" />
                    <span>{getAgeRangeText(milestone.age_range_start, milestone.age_range_end)}</span>
                  </div>
                </div>
              ))}
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
