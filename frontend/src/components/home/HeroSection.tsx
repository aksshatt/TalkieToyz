import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Target } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-white via-cream-light/30 to-teal-light/10 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(0 137 123) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 sm:py-28 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8">
            <div className="inline-block">
              <span className="px-4 py-2 bg-teal/10 text-teal font-semibold rounded-full text-sm">
                Trusted by 1000+ Families
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-warmgray-900 leading-tight">
              Expert-Curated Educational Toys for{' '}
              <span className="text-teal">Speech Development</span>
            </h1>

            <p className="text-lg sm:text-xl text-warmgray-600 leading-relaxed max-w-xl">
              Evidence-based learning tools designed by speech therapists to support your child's developmental milestones through purposeful play.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-teal hover:bg-teal-dark text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl group"
              >
                Browse Products
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/assessments"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-warmgray-300 text-warmgray-700 font-semibold rounded-lg hover:bg-warmgray-50 transition-all"
              >
                Take Assessment
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <div className="font-semibold text-warmgray-900">Safe & Certified</div>
                  <div className="text-sm text-warmgray-600">Quality guaranteed</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <div className="font-semibold text-warmgray-900">Expert Approved</div>
                  <div className="text-sm text-warmgray-600">Therapist designed</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <div className="font-semibold text-warmgray-900">Age Appropriate</div>
                  <div className="text-sm text-warmgray-600">Developmental fit</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Hero Image */}
          <div className="relative lg:pl-8">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=1000&auto=format&fit=crop"
                alt="Children engaging with educational toys"
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-hero.jpg';
                }}
              />

              {/* Stats Badge */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 shadow-xl">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-teal">500+</div>
                      <div className="text-xs text-warmgray-600 mt-1">Products</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-teal">1000+</div>
                      <div className="text-xs text-warmgray-600 mt-1">Families</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-teal">98%</div>
                      <div className="text-xs text-warmgray-600 mt-1">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-teal/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-coral/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
