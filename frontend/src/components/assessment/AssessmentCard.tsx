import { ClipboardList, Clock } from 'lucide-react';
import type { AssessmentSummary } from '../../types/assessment';

interface AssessmentCardProps {
  assessment: AssessmentSummary;
  onStartAssessment: (assessment: AssessmentSummary) => void;
}

const AssessmentCard = ({ assessment, onStartAssessment }: AssessmentCardProps) => {
  return (
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
            <span className="text-xs">Ages {Math.floor(assessment.min_age / 12)}-{Math.ceil(assessment.max_age / 12)} years</span>
          </span>
        </div>

        <div className="mt-auto">
          <button
            onClick={() => onStartAssessment(assessment)}
            className="w-full text-sm sm:text-base py-2.5 sm:py-3 font-semibold rounded-full text-white bg-gradient-to-r from-[#B2EBF2] via-[#4DD0E1] to-[#26C6DA] hover:from-[#FF85C0] hover:via-[#FF69B4] hover:to-[#FF4DA6] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            Start Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentCard;
