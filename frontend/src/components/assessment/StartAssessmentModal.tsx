import { useState } from 'react';
import { X, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { AssessmentSummary } from '../../types/assessment';

interface StartAssessmentModalProps {
  assessment: AssessmentSummary | { slug: string; title: string; description?: string; question_count?: number; min_age?: number; max_age?: number };
  isOpen: boolean;
  onClose: () => void;
}

const StartAssessmentModal = ({ assessment, isOpen, onClose }: StartAssessmentModalProps) => {
  const navigate = useNavigate();
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  if (!isOpen) return null;

  const handleStart = () => {
    if (childName && childAge) {
      navigate(`/assessments/${assessment.slug}`, {
        state: { childName, childAge, selectedLanguage, autoStart: true }
      });
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-soft-lg w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-warmgray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-gradient rounded-full shadow-soft">
              <ClipboardList className="h-5 w-5 text-white" />
            </div>
            <h2 className="font-[var(--font-family-fun)] font-bold text-lg sm:text-xl text-warmgray-900">
              Start Assessment
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-warmgray-500 hover:text-warmgray-700 transition-colors p-1"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6">
          <h3 className="font-semibold text-warmgray-900 text-base sm:text-lg mb-1">
            {assessment.title}
          </h3>
          {assessment.description && (
            <p className="text-xs sm:text-sm text-warmgray-600 mb-4">
              {assessment.description}
            </p>
          )}

          {/* Assessment Info */}
          <div className="bg-teal-light/30 p-3 rounded-lg mb-4 sm:mb-5">
            <ul className="space-y-1 text-xs sm:text-sm text-warmgray-700">
              {assessment.question_count && <li>• {assessment.question_count} questions</li>}
              {assessment.min_age != null && assessment.max_age != null && (
                <li>• Recommended for ages {Math.floor(assessment.min_age / 12)}-{Math.ceil(assessment.max_age / 12)} years</li>
              )}
              <li>• Takes approximately 10-15 minutes</li>
            </ul>
          </div>

          {/* Form */}
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-warmgray-700 mb-1.5">
                Child's Name *
              </label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all"
                placeholder="Enter child's name"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-warmgray-700 mb-1.5">
                Child's Age (years) *
              </label>
              <input
                type="number"
                value={childAge}
                onChange={(e) => setChildAge(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all"
                placeholder="Enter age in years"
                min="0"
                max="20"
                step="0.5"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-warmgray-700 mb-1.5">
                Preferred Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Marathi">Marathi (मराठी)</option>
                <option value="Odia">Odia (ଓଡ଼ିଆ)</option>
                <option value="Konkani">Konkani (कोंकणी)</option>
                <option value="Gujarati">Gujarati (ગુજરાતી)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-warmgray-200 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-warmgray-300 text-warmgray-700 rounded-xl hover:bg-warmgray-50 transition-colors font-semibold order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            disabled={!childName || !childAge}
            className="flex-1 text-sm sm:text-base py-2.5 sm:py-3 font-semibold rounded-full text-white bg-gradient-to-r from-[#B2EBF2] via-[#4DD0E1] to-[#26C6DA] hover:from-[#FF85C0] hover:via-[#FF69B4] hover:to-[#FF4DA6] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none order-1 sm:order-2"
          >
            Start Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartAssessmentModal;
