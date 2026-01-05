import { Link } from 'react-router-dom';
import { ClipboardList, Clock } from 'lucide-react';
import type { AssessmentSummary } from '../../types/assessment';

interface AssessmentCardProps {
  assessment: AssessmentSummary;
}

const AssessmentCard = ({ assessment }: AssessmentCardProps) => {
  return (
    <Link to={`/assessments/${assessment.slug}`} className="block h-full">
      <div className="card-talkie-hover overflow-hidden animate-slide-in h-full flex flex-col">
        <div className="p-4 sm:p-6 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-teal-gradient rounded-full shadow-soft">
              <ClipboardList className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <span className="bg-sky-gradient text-white text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-soft">
              {assessment.question_count} Questions
            </span>
          </div>

          <h3 className="font-[var(--font-family-fun)] font-bold text-warmgray-900 text-lg sm:text-xl mb-2">
            {assessment.title}
          </h3>

          <p className="text-xs sm:text-sm text-warmgray-600 mb-3 sm:mb-4 line-clamp-3 flex-1">
            {assessment.description}
          </p>

          <div className="flex items-center gap-2 text-xs font-semibold mb-3 sm:mb-4">
            <span className="bg-coral-gradient text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-pill shadow-soft flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className="text-xs">Ages {assessment.min_age}-{assessment.max_age} months</span>
            </span>
          </div>

          <div className="mt-auto">
            <button className="btn-secondary-talkie w-full text-sm sm:text-base py-2 sm:py-3">
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AssessmentCard;
