import { useState } from 'react';
import type { Question } from '../../types/assessment';

interface QuestionRendererProps {
  question: Question;
  answer: any;
  onAnswer: (answer: any) => void;
}

const QuestionRenderer = ({ question, answer, onAnswer }: QuestionRendererProps) => {
  const [textValue, setTextValue] = useState<string>(answer || '');

  const handleTextChange = (value: string) => {
    setTextValue(value);
    onAnswer(value);
  };

  if (question.type === 'yes_no') {
    return (
      <div className="space-y-3">
        <button
          onClick={() => onAnswer('yes')}
          className={`w-full p-4 rounded-lg border-2 transition-all font-semibold ${
            answer === 'yes'
              ? 'border-teal bg-teal-light text-teal'
              : 'border-warmgray-300 hover:border-teal hover:bg-teal-light/30'
          }`}
        >
          Yes
        </button>
        <button
          onClick={() => onAnswer('no')}
          className={`w-full p-4 rounded-lg border-2 transition-all font-semibold ${
            answer === 'no'
              ? 'border-coral bg-coral-light text-coral'
              : 'border-warmgray-300 hover:border-coral hover:bg-coral-light/30'
          }`}
        >
          No
        </button>
      </div>
    );
  }

  if (question.type === 'multiple_choice' && question.options) {
    return (
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option)}
            className={`w-full p-4 rounded-lg border-2 transition-all font-semibold text-left ${
              answer === option
                ? 'border-teal bg-teal-light text-teal'
                : 'border-warmgray-300 hover:border-teal hover:bg-teal-light/30'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    );
  }

  if (question.type === 'scale') {
    const min = question.min_value || 0;
    const max = question.max_value || 5;
    const steps = Array.from({ length: max - min + 1 }, (_, i) => min + i);

    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          {steps.map((value) => (
            <button
              key={value}
              onClick={() => onAnswer(value)}
              className={`w-12 h-12 rounded-full border-2 transition-all font-bold ${
                answer === value
                  ? 'border-teal bg-teal-gradient text-white shadow-soft-md'
                  : 'border-warmgray-300 hover:border-teal hover:bg-teal-light/30'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-warmgray-500">
          <span>Least</span>
          <span>Most</span>
        </div>
      </div>
    );
  }

  if (question.type === 'text') {
    return (
      <textarea
        value={textValue}
        onChange={(e) => handleTextChange(e.target.value)}
        className="w-full p-4 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all"
        rows={4}
        placeholder="Type your answer here..."
      />
    );
  }

  return <div>Unsupported question type</div>;
};

export default QuestionRenderer;
