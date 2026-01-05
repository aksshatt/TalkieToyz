import { Link } from 'react-router-dom';
import { Sparkles, BookOpen } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/hero-image.jpg"
          alt="Diverse toddlers playing with educational toys on a soft mat"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=2000&auto=format&fit=crop';
          }}
        />
        {/* Gradient Overlay - darker on left for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-warmgray-900/75 via-warmgray-900/50 to-transparent md:from-warmgray-900/70 md:via-warmgray-900/40 md:to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center h-full max-w-2xl">

          {/* Main Headline */}
          <h1 className="font-[var(--font-family-fun)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
            Where Every Playtime Becomes a{' '}
            <span className="text-sunshine">Learning Moment</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/95 leading-relaxed mb-8 drop-shadow-md font-medium max-w-xl">
            Expert-curated educational toys that nurture development, spark creativity, and make learning joyful.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/products"
              className="group inline-flex items-center justify-center px-8 py-4 bg-teal hover:bg-teal-dark text-white font-bold text-lg rounded-full shadow-soft-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Shop Learning Toys
            </Link>
            <Link
              to="/assessments"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/95 backdrop-blur-sm hover:bg-white text-warmgray-800 font-bold text-lg rounded-full border-2 border-white shadow-soft hover:shadow-lg transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 mr-2 text-sunshine" />
              Take the Development Quiz
            </Link>
          </div>

          {/* Trust Indicators - Subtle and below CTAs */}
          <div className="mt-10 flex flex-wrap gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-teal rounded-full"></div>
              <span className="text-sm font-medium">Safe & Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-sunshine rounded-full"></div>
              <span className="text-sm font-medium">Expert Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-coral rounded-full"></div>
              <span className="text-sm font-medium">Age-Appropriate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Soft Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default HeroSection;
