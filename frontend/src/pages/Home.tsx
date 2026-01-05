import React from 'react';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/home/HeroSection';
import DevelopmentalDomains from '../components/home/DevelopmentalDomains';
import FeaturedCollections from '../components/home/FeaturedCollections';

const Home: React.FC = () => {
  return (
    <Layout>
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
