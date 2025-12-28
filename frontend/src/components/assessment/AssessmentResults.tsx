import { CheckCircle, TrendingUp, Lightbulb } from 'lucide-react';
import type { AssessmentResult } from '../../types/assessment';

interface AssessmentResultsProps {
  result: AssessmentResult;
}

const AssessmentResults = ({ result }: AssessmentResultsProps) => {
  const getScoreLevel = (percentage: number) => {
    if (percentage >= 80) return { label: 'Excellent', color: 'teal', emoji: '🎉' };
    if (percentage >= 60) return { label: 'Good', color: 'sky', emoji: '👍' };
    if (percentage >= 40) return { label: 'Fair', color: 'sunshine', emoji: '⭐' };
    return { label: 'Needs Attention', color: 'coral', emoji: '💪' };
  };

  const scoreLevel = getScoreLevel(result.percentage_score);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-gradient rounded-full mb-4 shadow-soft-lg">
          <CheckCircle className="h-12 w-12 text-white" />
        </div>
        <h1 className="font-[var(--font-family-fun)] font-bold text-4xl text-warmgray-900 mb-2">
          Assessment Complete!
        </h1>
        <p className="text-warmgray-600">Results for {result.child_name}</p>
      </div>

      {/* Score Card */}
      <div className="card-talkie p-8 text-center">
        <div className="text-6xl mb-4">{scoreLevel.emoji}</div>
        <div className="mb-6">
          <div className={`inline-block bg-${scoreLevel.color}-gradient text-white text-2xl font-bold px-6 py-3 rounded-pill shadow-soft-md`}>
            {Math.round(result.percentage_score)}%
          </div>
        </div>
        <h2 className="font-[var(--font-family-fun)] font-bold text-3xl text-warmgray-900 mb-2">
          {scoreLevel.label}!
        </h2>
        <p className="text-warmgray-600">
          Your child scored {result.total_score} out of {Math.round(result.total_score / result.percentage_score * 100)} points
        </p>
      </div>

      {/* Category Breakdown */}
      {result.scores && Object.keys(result.scores).length > 0 && (
        <div className="card-talkie p-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-6 w-6 text-teal" />
            <h3 className="font-[var(--font-family-fun)] font-bold text-2xl text-warmgray-900">
              Category Breakdown
            </h3>
          </div>
          <div className="space-y-4">
            {Object.entries(result.scores).map(([category, score]) => (
              <div key={category}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-warmgray-700 capitalize">
                    {category.replace(/_/g, ' ')}
                  </span>
                  <span className="font-bold text-teal">{score}</span>
                </div>
                <div className="h-2 bg-warmgray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-gradient"
                    style={{ width: `${(score as number / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations && (
        <div className="card-talkie p-8">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="h-6 w-6 text-sunshine" />
            <h3 className="font-[var(--font-family-fun)] font-bold text-2xl text-warmgray-900">
              Recommendations
            </h3>
          </div>

          {result.recommendations.message && (
            <div className="bg-sunshine-light border-l-4 border-sunshine p-4 rounded-lg mb-6">
              <p className="text-warmgray-700">{result.recommendations.message}</p>
            </div>
          )}

          {result.recommendations.tips && result.recommendations.tips.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-warmgray-800 mb-3">Tips for Improvement:</h4>
              {result.recommendations.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-teal-gradient rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-warmgray-600">{tip}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => window.location.href = '/assessments'}
          className="btn-secondary-talkie"
        >
          Back to Assessments
        </button>
        <button
          onClick={() => window.location.href = '/products'}
          className="btn-primary-talkie"
        >
          Browse Recommended Products
        </button>
      </div>
    </div>
  );
};

export default AssessmentResults;
