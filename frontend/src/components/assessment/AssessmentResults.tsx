import { CheckCircle, TrendingUp, Lightbulb, Download, Share2, Calendar, Award, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { AssessmentResult } from '../../types/assessment';

interface AssessmentResultsProps {
  result: AssessmentResult;
}

const AssessmentResults = ({ result }: AssessmentResultsProps) => {
  const navigate = useNavigate();

  const getScoreLevel = (percentage: number) => {
    if (percentage >= 80) return {
      label: 'Excellent Progress',
      color: 'teal',
      bgColor: 'bg-teal-light/30',
      borderColor: 'border-teal',
      emoji: '🎉',
      message: 'Outstanding! Your child is showing great progress.'
    };
    if (percentage >= 60) return {
      label: 'Good Progress',
      color: 'sky',
      bgColor: 'bg-sky-light/30',
      borderColor: 'border-sky',
      emoji: '👍',
      message: 'Great work! Your child is developing well.'
    };
    if (percentage >= 40) return {
      label: 'Making Progress',
      color: 'sunshine',
      bgColor: 'bg-sunshine-light/30',
      borderColor: 'border-sunshine',
      emoji: '⭐',
      message: 'Your child is on the right track with room to grow.'
    };
    return {
      label: 'Needs Support',
      color: 'coral',
      bgColor: 'bg-coral-light/30',
      borderColor: 'border-coral',
      emoji: '💪',
      message: 'With the right support, your child can make great progress.'
    };
  };

  const scoreLevel = getScoreLevel(result.percentage_score);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${result.child_name}'s Assessment Results`,
        text: `Check out ${result.child_name}'s assessment results: ${Math.round(result.percentage_score)}%`,
        url: window.location.href,
      }).catch(() => {
        // Share failed or was cancelled
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/assessment_results/${result.id}/download_pdf`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `assessment_result_${result.child_name}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  const childAgeYears = Math.floor(result.child_age_months / 12);
  const childAgeMonths = result.child_age_months % 12;
  const ageDisplay = childAgeMonths > 0
    ? `${childAgeYears} years ${childAgeMonths} months`
    : `${childAgeYears} years`;

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-teal-gradient rounded-full mb-3 sm:mb-4 shadow-soft-lg animate-bounce-slow">
          <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
        </div>
        <h1 className="font-[var(--font-family-fun)] font-bold text-2xl sm:text-3xl md:text-4xl text-warmgray-900 mb-2">
          Assessment Complete!
        </h1>
        <p className="text-sm sm:text-base text-warmgray-600 mb-1">
          Results for <span className="font-semibold text-warmgray-900">{result.child_name}</span>
        </p>
        <p className="text-xs sm:text-sm text-warmgray-500">
          Age: {ageDisplay} • Completed on {new Date(result.completed_at).toLocaleDateString()}
        </p>
      </div>

      {/* Action Buttons - Top */}
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-4">
        <button
          onClick={handleShare}
          className="btn-secondary-talkie text-xs sm:text-sm px-3 sm:px-4 py-2 flex items-center gap-2"
        >
          <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Share</span>
        </button>
        <button
          onClick={handleDownload}
          className="btn-secondary-talkie text-xs sm:text-sm px-3 sm:px-4 py-2 flex items-center gap-2"
        >
          <Download className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Download PDF</span>
        </button>
      </div>

      {/* Score Card */}
      <div className="card-talkie p-6 sm:p-8 text-center">
        <div className="text-5xl sm:text-6xl mb-4">{scoreLevel.emoji}</div>

        {/* Circular Progress */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-warmgray-200"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - result.percentage_score / 100)}`}
              className={`text-${scoreLevel.color} transition-all duration-1000`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl sm:text-4xl font-bold text-warmgray-900">
              {Math.round(result.percentage_score)}%
            </span>
          </div>
        </div>

        <div className={`${scoreLevel.bgColor} ${scoreLevel.borderColor} border-l-4 p-4 rounded-lg mb-4`}>
          <h2 className="font-[var(--font-family-fun)] font-bold text-xl sm:text-2xl md:text-3xl text-warmgray-900 mb-2">
            {scoreLevel.label}
          </h2>
          <p className="text-sm sm:text-base text-warmgray-700">
            {scoreLevel.message}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-warmgray-600">
          <Award className="h-4 w-4" />
          <span>Total Score: <strong className="text-warmgray-900">{result.total_score}</strong> points</span>
        </div>
      </div>

      {/* Category Breakdown */}
      {result.scores && Object.keys(result.scores).length > 0 && (
        <div className="card-talkie p-4 sm:p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="p-2 bg-teal-light rounded-lg">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-teal" />
            </div>
            <h3 className="font-[var(--font-family-fun)] font-bold text-lg sm:text-xl md:text-2xl text-warmgray-900">
              Skill Area Breakdown
            </h3>
          </div>
          <div className="space-y-4 sm:space-y-5">
            {Object.entries(result.scores).map(([category, score], index) => {
              const maxScore = result.category_max_scores[category] || 10;
              const percentage = (score as number / maxScore) * 100;
              return (
                <div key={category} className="animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-warmgray-500" />
                      <span className="font-semibold text-sm sm:text-base text-warmgray-700 capitalize">
                        {category.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span className="font-bold text-base sm:text-lg text-teal">{score}/{maxScore}</span>
                  </div>
                  <div className="h-2 sm:h-3 bg-warmgray-200 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-teal-gradient transition-all duration-1000 ease-out rounded-full"
                      style={{
                        width: `${percentage}%`,
                        transitionDelay: `${index * 100}ms`
                      }}
                    />
                  </div>
                  <div className="text-xs text-warmgray-500 mt-1 text-right">
                    {percentage >= 80 ? 'Excellent' : percentage >= 60 ? 'Good' : percentage >= 40 ? 'Fair' : 'Needs Focus'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations && (
        <div className="card-talkie p-4 sm:p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="p-2 bg-sunshine-light rounded-lg">
              <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 text-sunshine" />
            </div>
            <h3 className="font-[var(--font-family-fun)] font-bold text-lg sm:text-xl md:text-2xl text-warmgray-900">
              Personalized Recommendations
            </h3>
          </div>

          {result.recommendations.message && (
            <div className="bg-gradient-to-r from-sunshine-light/50 to-teal-light/30 border-l-4 border-sunshine p-4 sm:p-5 rounded-lg mb-6 shadow-soft">
              <p className="text-sm sm:text-base text-warmgray-800 leading-relaxed">{result.recommendations.message}</p>
            </div>
          )}

          {result.recommendations.tips && result.recommendations.tips.length > 0 && (
            <div className="space-y-3 sm:space-y-4">
              <h4 className="font-semibold text-sm sm:text-base text-warmgray-800 mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-teal-gradient rounded"></span>
                Actionable Tips for Progress:
              </h4>
              {result.recommendations.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 bg-white/50 p-3 sm:p-4 rounded-lg hover:bg-white transition-colors">
                  <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 bg-teal-gradient rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-soft">
                    {index + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-warmgray-700 leading-relaxed flex-1">{tip}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Book Appointment CTA */}
      <div className="card-talkie p-6 sm:p-8 bg-gradient-to-br from-coral-light/20 to-teal-light/20">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-coral-gradient rounded-full mb-3 sm:mb-4">
            <Calendar className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
          </div>
          <h3 className="font-[var(--font-family-fun)] font-bold text-lg sm:text-xl md:text-2xl text-warmgray-900 mb-2">
            Want Professional Guidance?
          </h3>
          <p className="text-sm sm:text-base text-warmgray-600 mb-4 sm:mb-6 max-w-2xl mx-auto">
            Our speech therapy experts can provide personalized support and create a customized development plan for your child.
          </p>
          <button
            onClick={() => navigate('/assessments')}
            className="btn-primary text-sm sm:text-base px-6 sm:px-8 py-3 inline-flex items-center gap-2"
          >
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            Book a Consultation
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4">
        <button
          onClick={() => navigate('/assessments')}
          className="btn-secondary-talkie text-sm sm:text-base w-full sm:w-auto"
        >
          Take Another Assessment
        </button>
        <button
          onClick={() => navigate('/products')}
          className="btn-primary-talkie text-sm sm:text-base w-full sm:w-auto"
        >
          Browse Recommended Toys
        </button>
      </div>
    </div>
  );
};

export default AssessmentResults;
