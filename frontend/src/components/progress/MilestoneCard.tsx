import { CheckCircle, Lightbulb } from 'lucide-react';
import type { Milestone } from '../../types/progress';

interface MilestoneCardProps {
  milestone: Milestone;
}

const MilestoneCard = ({ milestone }: MilestoneCardProps) => {
  const categoryColors: Record<string, string> = {
    expressive_language: 'bg-teal-gradient',
    receptive_language: 'bg-coral-gradient',
    articulation: 'bg-sunshine-gradient',
    social_communication: 'bg-sky-gradient',
    fluency: 'bg-playful-gradient',
    voice: 'bg-teal-gradient',
    feeding_swallowing: 'bg-coral-gradient',
  };

  const categoryColor = categoryColors[milestone.category] || 'bg-teal-gradient';

  return (
    <div className="card-talkie p-6">
      <div className="flex items-start justify-between mb-4">
        <span className={`${categoryColor} text-white text-xs font-bold px-3 py-1.5 rounded-pill shadow-soft`}>
          {milestone.category_display_name}
        </span>
        <span className="bg-warmgray-100 text-warmgray-700 text-xs font-semibold px-3 py-1.5 rounded-pill">
          {milestone.age_range_description}
        </span>
      </div>

      <h3 className="font-[var(--font-family-fun)] font-bold text-xl text-warmgray-900 mb-3">
        {milestone.title}
      </h3>

      <p className="text-sm text-warmgray-600 mb-4">{milestone.description}</p>

      {milestone.indicators && milestone.indicators.length > 0 && (
        <div className="mb-4">
          <h4 className="flex items-center gap-2 font-semibold text-sm text-warmgray-800 mb-2">
            <CheckCircle className="h-4 w-4 text-teal" />
            Indicators
          </h4>
          <ul className="space-y-1">
            {milestone.indicators.map((indicator, index) => (
              <li key={index} className="text-sm text-warmgray-600 flex items-start gap-2">
                <span className="text-teal mt-1">•</span>
                {indicator}
              </li>
            ))}
          </ul>
        </div>
      )}

      {milestone.tips && milestone.tips.length > 0 && (
        <div>
          <h4 className="flex items-center gap-2 font-semibold text-sm text-warmgray-800 mb-2">
            <Lightbulb className="h-4 w-4 text-sunshine" />
            Tips
          </h4>
          <ul className="space-y-1">
            {milestone.tips.map((tip, index) => (
              <li key={index} className="text-sm text-warmgray-600 flex items-start gap-2">
                <span className="text-sunshine mt-1">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MilestoneCard;
