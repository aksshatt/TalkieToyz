import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Activity, Hand, MessageCircle, Ear, Brain, Users, Heart } from 'lucide-react';
import type { Assessment, Question } from '../../types/assessment';

interface AssessmentQuizProps {
  assessment: Assessment;
  onComplete: (answers: Record<string, any>) => void;
}

interface Section {
  category: string;
  label: string;
  icon: React.ReactNode;
  questions: Question[];
}

const CATEGORY_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  gross_motor: { label: 'Gross Motor', icon: <Activity className="h-5 w-5" />, color: 'from-blue-400 to-blue-600' },
  fine_motor: { label: 'Fine Motor', icon: <Hand className="h-5 w-5" />, color: 'from-purple-400 to-purple-600' },
  expressive_language: { label: 'Speech (Expressive)', icon: <MessageCircle className="h-5 w-5" />, color: 'from-pink-400 to-pink-600' },
  receptive_language: { label: 'Language (Receptive)', icon: <Ear className="h-5 w-5" />, color: 'from-orange-400 to-orange-600' },
  cognitive: { label: 'Cognitive', icon: <Brain className="h-5 w-5" />, color: 'from-teal-400 to-teal-600' },
  social_communication: { label: 'Social', icon: <Users className="h-5 w-5" />, color: 'from-green-400 to-green-600' },
  emotional: { label: 'Emotional / Behavior', icon: <Heart className="h-5 w-5" />, color: 'from-red-400 to-red-600' },
  articulation: { label: 'Articulation', icon: <MessageCircle className="h-5 w-5" />, color: 'from-indigo-400 to-indigo-600' },
};

const AssessmentQuiz = ({ assessment, onComplete }: AssessmentQuizProps) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  // Group questions by category (preserving order)
  const sections = useMemo(() => {
    const sectionMap: Record<string, Question[]> = {};
    const sectionOrder: string[] = [];

    assessment.questions.forEach((q) => {
      const cat = q.category || 'other';
      if (!sectionMap[cat]) {
        sectionMap[cat] = [];
        sectionOrder.push(cat);
      }
      sectionMap[cat].push(q);
    });

    return sectionOrder.map((cat): Section => {
      const config = CATEGORY_CONFIG[cat] || { label: cat.replace(/_/g, ' '), icon: <Brain className="h-5 w-5" />, color: 'from-gray-400 to-gray-600' };
      return {
        category: cat,
        label: config.label,
        icon: config.icon,
        questions: sectionMap[cat],
      };
    });
  }, [assessment.questions]);

  const currentSection = sections[currentSectionIndex];
  const totalQuestions = assessment.questions.length;
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / totalQuestions) * 100;

  const handleAnswer = (questionKey: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionKey]: answer,
    }));
  };

  const isSectionComplete = currentSection.questions.every(
    (q) => answers[q.key] !== undefined && answers[q.key] !== ''
  );

  const isLastSection = currentSectionIndex === sections.length - 1;

  const handleNext = () => {
    if (isLastSection) {
      onComplete(answers);
    } else {
      setCurrentSectionIndex(currentSectionIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const config = CATEGORY_CONFIG[currentSection.category] || { label: currentSection.category, icon: <Brain className="h-5 w-5" />, color: 'from-gray-400 to-gray-600' };

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* Overall Progress */}
      <div className="mb-4 sm:mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs sm:text-sm font-semibold text-warmgray-700">
            Section {currentSectionIndex + 1} of {sections.length}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-teal">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="h-1.5 sm:h-2 bg-warmgray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-gradient transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Section Navigation Dots */}
      <div className="flex justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 flex-wrap">
        {sections.map((section, index) => {
          const sectionAnswered = section.questions.every(
            (q) => answers[q.key] !== undefined && answers[q.key] !== ''
          );
          return (
            <button
              key={section.category}
              onClick={() => setCurrentSectionIndex(index)}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                index === currentSectionIndex
                  ? 'bg-teal text-white shadow-md scale-110'
                  : sectionAnswered
                  ? 'bg-teal-light text-teal border-2 border-teal'
                  : 'bg-warmgray-100 text-warmgray-500 border-2 border-warmgray-200'
              }`}
              title={CATEGORY_CONFIG[section.category]?.label || section.category}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {/* Section Header */}
      <div className={`bg-gradient-to-r ${config.color} rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-4 sm:mb-6 text-white shadow-md`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-full">
            {config.icon}
          </div>
          <div>
            <h2 className="font-[var(--font-family-fun)] font-bold text-lg sm:text-xl md:text-2xl">
              {currentSection.label}
            </h2>
            <p className="text-white/80 text-xs sm:text-sm">
              {currentSection.questions.filter((q) => answers[q.key] !== undefined && answers[q.key] !== '').length} of {currentSection.questions.length} answered
            </p>
          </div>
        </div>
      </div>

      {/* Section Questions */}
      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
        {currentSection.questions.map((question, qIndex) => {
          const isAnswered = answers[question.key] !== undefined && answers[question.key] !== '';
          return (
            <div
              key={question.key}
              className={`card-talkie p-4 sm:p-5 transition-all ${
                isAnswered ? 'border-l-4 border-l-teal' : 'border-l-4 border-l-warmgray-200'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-warmgray-100 text-warmgray-600 flex items-center justify-center text-xs sm:text-sm font-bold">
                  {qIndex + 1}
                </span>
                <h3 className="font-semibold text-sm sm:text-base text-warmgray-900 pt-0.5 sm:pt-1">
                  {question.text}
                </h3>
              </div>

              {/* Yes/No inline buttons */}
              {question.type === 'yes_no' && (
                <div className="flex gap-3 ml-10 sm:ml-11">
                  <button
                    onClick={() => handleAnswer(question.key, 'yes')}
                    className={`flex-1 py-2 sm:py-2.5 rounded-lg border-2 transition-all font-semibold text-sm sm:text-base ${
                      answers[question.key] === 'yes'
                        ? 'border-teal bg-teal-light text-teal'
                        : 'border-warmgray-300 hover:border-teal hover:bg-teal-light/30 text-warmgray-600'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleAnswer(question.key, 'no')}
                    className={`flex-1 py-2 sm:py-2.5 rounded-lg border-2 transition-all font-semibold text-sm sm:text-base ${
                      answers[question.key] === 'no'
                        ? 'border-coral bg-coral-light text-coral'
                        : 'border-warmgray-300 hover:border-coral hover:bg-coral-light/30 text-warmgray-600'
                    }`}
                  >
                    No
                  </button>
                </div>
              )}

              {/* Multiple choice */}
              {question.type === 'multiple_choice' && question.options && (
                <div className="space-y-2 ml-10 sm:ml-11">
                  {question.options.map((option: any, oIndex: number) => {
                    const isObject = typeof option === 'object' && option !== null;
                    const optionLabel = isObject ? option.label : option;
                    const optionValue = isObject ? option.value : option;
                    const isSelected = isObject
                      ? (typeof answers[question.key] === 'object' ? answers[question.key]?.value === optionValue : answers[question.key] === optionValue)
                      : answers[question.key] === option;

                    return (
                      <button
                        key={oIndex}
                        onClick={() => handleAnswer(question.key, isObject ? option : optionValue)}
                        className={`w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg border-2 transition-all font-semibold text-left text-sm sm:text-base ${
                          isSelected
                            ? 'border-teal bg-teal-light text-teal'
                            : 'border-warmgray-300 hover:border-teal hover:bg-teal-light/30 text-warmgray-600'
                        }`}
                      >
                        {optionLabel}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Scale */}
              {question.type === 'scale' && (
                <div className="ml-10 sm:ml-11">
                  <div className="flex gap-2 sm:gap-3">
                    {Array.from(
                      { length: (question.max_value || 5) - (question.min_value || 0) + 1 },
                      (_, i) => (question.min_value || 0) + i
                    ).map((value) => (
                      <button
                        key={value}
                        onClick={() => handleAnswer(question.key, value)}
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 transition-all font-bold text-sm ${
                          answers[question.key] === value
                            ? 'border-teal bg-teal-gradient text-white shadow-soft-md'
                            : 'border-warmgray-300 hover:border-teal hover:bg-teal-light/30'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] sm:text-xs text-warmgray-500 mt-1">
                    <span>{question.min_label || 'Least'}</span>
                    <span>{question.max_label || 'Most'}</span>
                  </div>
                </div>
              )}

              {/* Text */}
              {question.type === 'text' && (
                <div className="ml-10 sm:ml-11">
                  <textarea
                    value={answers[question.key] || ''}
                    onChange={(e) => handleAnswer(question.key, e.target.value)}
                    className="w-full p-3 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all text-sm sm:text-base"
                    rows={3}
                    placeholder="Type your answer here..."
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 pb-6">
        <button
          onClick={handlePrevious}
          disabled={currentSectionIndex === 0}
          className={`btn-outline flex items-center justify-center gap-2 text-sm sm:text-base py-2.5 sm:py-3 order-2 sm:order-1 ${
            currentSectionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          Previous Section
        </button>

        <button
          onClick={handleNext}
          disabled={!isSectionComplete}
          className={`btn-primary flex items-center justify-center gap-2 text-sm sm:text-base py-2.5 sm:py-3 order-1 sm:order-2 ${
            !isSectionComplete ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLastSection ? 'Complete Assessment' : 'Next Section'}
          {!isLastSection && <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />}
        </button>
      </div>
    </div>
  );
};

export default AssessmentQuiz;
