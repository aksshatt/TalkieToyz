import { Link } from 'react-router-dom';
import { ClipboardList, Clock } from 'lucide-react';
import type { AssessmentSummary } from '../../types/assessment';

interface AssessmentCardProps {
  assessment: AssessmentSummary;
}

const AssessmentCard = ({ assessment }: AssessmentCardProps) => {
  return (
    <Link to={`/assessments/${assessment.slug}`}>
      <div className="card-talkie-hover overflow-hidden animate-slide-in">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-teal-gradient rounded-full shadow-soft">
              <ClipboardList className="h-6 w-6 text-white" />
            </div>
            <span className="bg-sky-gradient text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-soft">
              {assessment.question_count} Questions
            </span>
          </div>

          <h3 className="font-[var(--font-family-fun)] font-bold text-warmgray-900 text-xl mb-2">
            {assessment.title}
          </h3>

          <p className="text-sm text-warmgray-600 mb-4 line-clamp-3">
            {assessment.description}
          </p>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="bg-coral-gradient text-white px-3 py-1.5 rounded-pill shadow-soft flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Ages {assessment.min_age}-{assessment.max_age} months
            </span>
          </div>

          <div className="mt-4">
            <button className="btn-secondary-talkie w-full">
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AssessmentCard;
