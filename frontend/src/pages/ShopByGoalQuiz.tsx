import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ChevronRight, RefreshCw, ShoppingCart, Star, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/layout/Layout';
import SEO from '../components/common/SEO';
import { quizService, QuizQuestion } from '../services/quizService';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';

const STEP_COLORS = ['bg-teal-gradient', 'bg-coral-gradient', 'bg-sunshine-gradient'];

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

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-coral-dark via-coral to-sunshine py-16 px-4">
        <motion.div className="absolute w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none"
          animate={{ x: [0, 24, 0], y: [0, -16, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '-20%', left: '-5%' }} />
        <div className="relative z-10 max-w-2xl mx-auto text-center text-white">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-semibold px-5 py-2 rounded-full mb-5">
            <Sparkles className="w-4 h-4" /> 3-Question Quiz
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-4xl md:text-5xl font-[var(--font-family-fun)] font-bold mb-4">
            Shop by Speech Goal
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="text-white/85 text-lg">
            Answer 3 quick questions and we'll recommend the perfect toys for your child.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 48C240 16 480 0 720 0C960 0 1200 16 1440 48H0Z" fill="#fafaf9" />
          </svg>
        </div>
      </div>

      <div className="bg-warmgray-50 min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {loadingQuestions ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin" />
            </div>
          ) : showResults ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-[var(--font-family-fun)] font-bold text-warmgray-900">Your Personalised Picks</h2>
                  <p className="text-warmgray-500 text-sm mt-1">Based on your answers, here's what we recommend:</p>
                </div>
                <motion.button
                  onClick={reset}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-1.5 text-sm text-teal font-bold hover:text-teal-dark transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Retake Quiz
                </motion.button>
              </div>

              {recommendMutation.isPending ? (
                <div className="flex justify-center py-16">
                  <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl shadow-soft">
                  <Star className="w-12 h-12 text-warmgray-300 mx-auto mb-3" />
                  <p className="text-warmgray-500 font-semibold">No products found for your selections.</p>
                  <Link to="/products" className="inline-flex items-center gap-1.5 text-teal font-bold mt-4 hover:underline">
                    Browse all products <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {products.map((product: any, i: number) => (
                    <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ y: -5, boxShadow: '0 16px 36px rgba(0,0,0,0.12)' }}
                      className="bg-white rounded-3xl shadow-soft overflow-hidden">
                      <Link to={`/products/${product.slug}`}>
                        {product.image_urls?.[0] ? (
                          <img src={product.image_urls[0].url} alt={product.name} className="w-full h-44 object-cover" />
                        ) : (
                          <div className="w-full h-44 bg-gradient-to-br from-cream-light via-teal-light/20 to-coral-light/20 flex items-center justify-center">
                            <Star className="w-10 h-10 text-warmgray-300" />
                          </div>
                        )}
                      </Link>
                      <div className="p-4">
                        <Link to={`/products/${product.slug}`} className="font-[var(--font-family-fun)] font-bold text-warmgray-900 hover:text-teal transition-colors text-sm line-clamp-2">
                          {product.name}
                        </Link>
                        {product.speech_goals?.length > 0 && (
                          <p className="text-xs text-teal mt-1 font-semibold">{product.speech_goals.map((g: any) => g.name).join(', ')}</p>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-lg font-[var(--font-family-fun)] font-bold text-teal">₹{product.price}</span>
                          <motion.button
                            onClick={() => dispatch(addToCart({ product_id: product.id, quantity: 1 }))}
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
                            className="flex items-center gap-1.5 bg-teal-gradient text-white text-xs px-4 py-2 rounded-full font-bold shadow-soft hover:shadow-soft-md transition-shadow"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" /> Add
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {currentQuestion && (
                <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl shadow-soft-xl overflow-hidden">
                  {/* Progress */}
                  <div className="flex gap-0 h-1.5">
                    {questions.map((_, i) => (
                      <div key={i} className={`flex-1 transition-all duration-500 ${i < step ? 'bg-teal' : i === step ? 'bg-teal/60' : 'bg-warmgray-100'}`} />
                    ))}
                  </div>

                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-6">
                      <div className={`w-8 h-8 rounded-full ${STEP_COLORS[step % STEP_COLORS.length]} flex items-center justify-center text-white text-sm font-bold shadow-soft`}>
                        {step + 1}
                      </div>
                      <p className="text-xs font-bold text-warmgray-400 uppercase tracking-wide">
                        Question {step + 1} of {questions.length}
                      </p>
                    </div>

                    <h2 className="text-2xl font-[var(--font-family-fun)] font-bold text-warmgray-900 mb-7 leading-snug">
                      {currentQuestion.question}
                    </h2>

                    <div className="space-y-3">
                      {currentQuestion.options.map(option => (
                        <motion.button
                          key={option.value}
                          onClick={() => handleAnswer(option.value)}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center justify-between px-6 py-4 border-2 border-warmgray-200 rounded-2xl text-left hover:border-teal hover:bg-teal-light/10 transition-all group"
                        >
                          <span className="font-semibold text-warmgray-800 group-hover:text-teal transition-colors">{option.label}</span>
                          <ChevronRight className="w-4 h-4 text-warmgray-300 group-hover:text-teal transition-colors" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ShopByGoalQuiz;
