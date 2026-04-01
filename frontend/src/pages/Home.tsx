import React from 'react';
import Layout from '../components/layout/Layout';
import SEO from '../components/common/SEO';
import HeroSection from '../components/home/HeroSection';
import DevelopmentalDomains from '../components/home/DevelopmentalDomains';
import FeaturedCollections from '../components/home/FeaturedCollections';

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
        {/* Hero Section - Large photograph with learning through play message */}
        <HeroSection />

        {/* Developmental Areas - Circular icons for different learning categories */}
        <DevelopmentalDomains />

        {/* Featured Collections - Grid of educational product cards */}
        <FeaturedCollections />
      </div>
    </Layout>
  );
};

export default Home;
