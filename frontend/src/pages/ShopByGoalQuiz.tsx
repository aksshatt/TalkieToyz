import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ChevronRight, RefreshCw, ShoppingCart, Star } from 'lucide-react';
import Layout from '../components/layout/Layout';
import SEO from '../components/common/SEO';
import { quizService, QuizQuestion } from '../services/quizService';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';

const ShopByGoalQuiz: React.FC = () => {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const { data: questionsData, isLoading: loadingQuestions } = useQuery({
    queryKey: ['quiz_questions'],
    queryFn: quizService.getQuestions,
  });

  const recommendMutation = useMutation({
    mutationFn: () => quizService.getRecommendations({
      goal: answers[1] || '',
      age_range: answers[2] || '',
      activity_type: answers[3] || '',
    }),
    onSuccess: () => setShowResults(true),
  });

  const questions: QuizQuestion[] = questionsData?.data || [];
  const currentQuestion = questions[step];
  const products = recommendMutation.data?.data?.products || [];

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(s => s + 1);
    } else {
      recommendMutation.mutate();
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setShowResults(false);
    recommendMutation.reset();
  };

  return (
    <Layout>
      <SEO url="/quiz" />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-1 rounded-full mb-4">
              3-Question Quiz
            </span>
            <h1 className="text-3xl font-bold text-gray-900">Shop by Speech Goal</h1>
            <p className="text-gray-500 mt-2">Answer 3 quick questions and we'll recommend the perfect toys for your child.</p>
          </div>

          {loadingQuestions ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : showResults ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Your Personalised Picks</h2>
                  <p className="text-sm text-gray-500">Based on your answers, here's what we recommend:</p>
                </div>
                <button
                  onClick={reset}
                  className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  <RefreshCw className="w-4 h-4" /> Retake Quiz
                </button>
              </div>

              {recommendMutation.isPending ? (
                <div className="flex justify-center py-16">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map((product: any) => (
                    <div key={product.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition">
                      <Link to={`/products/${product.slug}`}>
                        {product.image_urls?.[0] ? (
                          <img src={product.image_urls[0].url} alt={product.name} className="w-full h-44 object-cover" />
                        ) : (
                          <div className="w-full h-44 bg-indigo-50 flex items-center justify-center">
                            <Star className="w-10 h-10 text-indigo-200" />
                          </div>
                        )}
                      </Link>
                      <div className="p-4">
                        <Link to={`/products/${product.slug}`} className="font-semibold text-gray-900 hover:text-indigo-600 text-sm line-clamp-2">
                          {product.name}
                        </Link>
                        {product.speech_goals?.length > 0 && (
                          <p className="text-xs text-indigo-600 mt-1">{product.speech_goals.map((g: any) => g.name).join(', ')}</p>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-indigo-700 font-bold">₹{product.price}</span>
                          <button
                            onClick={() => dispatch(addToCart({ product_id: product.id, quantity: 1 }))}
                            className="flex items-center gap-1 bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
                          >
                            <ShoppingCart className="w-3 h-3" /> Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              {/* Progress */}
              <div className="flex gap-2 mb-8">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all ${i <= step ? 'bg-indigo-600' : 'bg-gray-200'}`}
                  />
                ))}
              </div>

              {currentQuestion && (
                <>
                  <p className="text-xs font-medium text-indigo-600 mb-2">Question {step + 1} of {questions.length}</p>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">{currentQuestion.question}</h2>
                  <div className="space-y-3">
                    {currentQuestion.options.map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer(option.value)}
                        className="w-full flex items-center justify-between px-5 py-4 border-2 border-gray-200 rounded-xl text-left hover:border-indigo-500 hover:bg-indigo-50 transition group"
                      >
                        <span className="font-medium text-gray-800">{option.label}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ShopByGoalQuiz;
