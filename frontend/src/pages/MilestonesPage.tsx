import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Target } from 'lucide-react';
import MilestoneCard from '../components/progress/MilestoneCard';
import { progressService } from '../services/progressService';
import type { Milestone, MilestoneCategory } from '../types/progress';

const MilestonesPage = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<MilestoneCategory | undefined>();

  useEffect(() => {
    loadMilestones();
  }, [selectedCategory]);

  const loadMilestones = async () => {
    try {
      setLoading(true);
      const response = await progressService.getMilestones({ category: selectedCategory });
      setMilestones(response.data);
    } catch (err) {
      console.error('Failed to load milestones:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-cream-light py-12">
        <div className="container-talkie">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-gradient rounded-full mb-4">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h1 className="heading-talkie mb-4">Speech Development Milestones</h1>
            <p className="text-warmgray-600 max-w-2xl mx-auto">
              Track your child's speech development with age-appropriate milestones.
            </p>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {milestones.map((milestone) => (
                <MilestoneCard key={milestone.id} milestone={milestone} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MilestonesPage;
