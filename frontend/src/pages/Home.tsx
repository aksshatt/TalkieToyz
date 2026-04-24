import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, ChevronRight, Package } from 'lucide-react';
import Layout from '../components/layout/Layout';
import SEO from '../components/common/SEO';
import HeroSection from '../components/home/HeroSection';
import DevelopmentalDomains from '../components/home/DevelopmentalDomains';
import FeaturedCollections from '../components/home/FeaturedCollections';
import SuccessStoriesSection from '../components/common/SuccessStoriesSection';

const Home: React.FC = () => {
  return (
    <Layout>
      <SEO
        url="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'TalkieToys',
          url: 'https://talkietoyz.shop',
          description: 'Quality speech therapy toys designed by therapists to help children practice specific sounds and build communication skills.',
          contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', email: 'talkietoyz@gmail.com' },
        }}
      />
      <div className="min-h-screen">
        {/* Hero Section */}
        <HeroSection />

        {/* Developmental Areas */}
        <DevelopmentalDomains />

        {/* Featured Collections */}
        <FeaturedCollections />

        {/* Shop by Goal Quiz CTA */}
        <section className="py-14 bg-gradient-to-br from-indigo-600 to-purple-700">
          <div className="max-w-4xl mx-auto px-4 text-center text-white">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-3">Not sure where to start?</h2>
            <p className="text-indigo-100 mb-8 max-w-xl mx-auto">
              Answer 3 quick questions about your child's speech goals and we'll recommend the perfect toys — personalised just for them.
            </p>
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-4 rounded-2xl hover:bg-indigo-50 transition shadow-lg"
            >
              Take the Free Quiz <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Speech Kits CTA */}
        <section className="py-12 bg-amber-50 border-y border-amber-100">
          <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center gap-6">
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Package className="w-7 h-7 text-amber-600" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-bold text-gray-900">Therapist-Curated Speech Kits</h2>
              <p className="text-gray-500 mt-1">Get everything your child needs in one bundle — and save up to 20% vs buying individually.</p>
            </div>
            <Link
              to="/speech-kits"
              className="inline-flex items-center gap-2 bg-amber-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-amber-600 transition flex-shrink-0"
            >
              Browse Speech Kits <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Parent Success Stories */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <SuccessStoriesSection featured={true} />
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
