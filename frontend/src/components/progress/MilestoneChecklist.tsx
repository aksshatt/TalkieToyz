import { useState } from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import type { Milestone } from '../../types/progress';

interface MilestoneChecklistProps {
  milestones: Milestone[];
  completedIds?: number[];
  onToggle?: (milestoneId: number) => void;
}

const MilestoneChecklist = ({ milestones, completedIds = [], onToggle }: MilestoneChecklistProps) => {
  const [completed, setCompleted] = useState<Set<number>>(new Set(completedIds));

  const handleToggle = (id: number) => {
    const newCompleted = new Set(completed);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompleted(newCompleted);
    onToggle?.(id);
  };

  const groupedByAge = milestones.reduce((acc, milestone) => {
    const key = `${milestone.age_months_min}-${milestone.age_months_max}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(milestone);
    return acc;
  }, {} as Record<string, Milestone[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedByAge).map(([ageRange, milestones]) => {
        const completedCount = milestones.filter(m => completed.has(m.id)).length;
        const progress = (completedCount / milestones.length) * 100;

        return (
          <div key={ageRange} className="card-talkie p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-[var(--font-family-fun)] font-bold text-lg text-warmgray-900">
                {milestones[0].age_range_description}
              </h3>
              <span className="text-sm font-semibold text-teal">
                {completedCount}/{milestones.length} completed
              </span>
            </div>

            <div className="h-2 bg-warmgray-200 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-teal-gradient transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="space-y-3">
              {milestones.map((milestone) => (
                <button
                  key={milestone.id}
                  onClick={() => handleToggle(milestone.id)}
                  className="w-full text-left p-3 rounded-lg border-2 border-warmgray-200 hover:border-teal transition-all"
                >
                  <div className="flex items-start gap-3">
                    {completed.has(milestone.id) ? (
                      <CheckCircle className="h-6 w-6 text-teal flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="h-6 w-6 text-warmgray-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={`font-semibold ${completed.has(milestone.id) ? 'text-teal' : 'text-warmgray-900'}`}>
                        {milestone.title}
                      </p>
                      {milestone.description && (
                        <p className="text-sm text-warmgray-600 mt-1">{milestone.description}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MilestoneChecklist;
