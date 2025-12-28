import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Assessment } from '../../types/assessment';
import QuestionRenderer from './QuestionRenderer';

interface AssessmentQuizProps {
  assessment: Assessment;
  onComplete: (answers: Record<string, any>) => void;
}

const AssessmentQuiz = ({ assessment, onComplete }: AssessmentQuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / assessment.questions.length) * 100;

  const handleAnswer = (answer: any) => {
    setAnswers({
      ...answers,
      [currentQuestion.key]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const isAnswered = answers[currentQuestion.key] !== undefined && answers[currentQuestion.key] !== '';
  const isLastQuestion = currentQuestionIndex === assessment.questions.length - 1;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-warmgray-700">
            Question {currentQuestionIndex + 1} of {assessment.questions.length}
          </span>
          <span className="text-sm font-semibold text-teal">{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-2 bg-warmgray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-gradient transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="card-talkie p-8 mb-6">
        <div className="mb-2">
          {currentQuestion.category && (
            <span className="inline-block bg-sky-gradient text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
              {currentQuestion.category}
            </span>
          )}
        </div>

        <h2 className="font-[var(--font-family-fun)] font-bold text-2xl text-warmgray-900 mb-6">
          {currentQuestion.text}
        </h2>

        <QuestionRenderer
          question={currentQuestion}
          answer={answers[currentQuestion.key]}
          onAnswer={handleAnswer}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className={`btn-secondary-talkie flex items-center gap-2 ${
            currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={!isAnswered}
          className={`btn-primary-talkie flex items-center gap-2 ${
            !isAnswered ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLastQuestion ? 'Complete' : 'Next'}
          {!isLastQuestion && <ChevronRight className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
};

export default AssessmentQuiz;
