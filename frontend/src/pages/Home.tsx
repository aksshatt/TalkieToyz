import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import { ClipboardList, TrendingUp, Milestone, BookOpen, Download } from 'lucide-react';

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <Layout>
    <div className="min-h-screen">

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-slide-in">
          <h2 className="text-6xl font-[var(--font-family-fun)] font-bold text-warmgray-800 mb-4">
            Welcome to <span className="text-teal">Talkie</span><span className="text-coral">Toyz</span>!
          </h2>
          <p className="text-2xl text-warmgray-600 mb-8 font-medium">
            Where Fun Meets Learning!
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/products"
              className="btn-primary text-lg px-10 py-4"
            >
              Shop Now
            </Link>
            {!isAuthenticated && (
              <>
                <Link
                  to="/signup"
                  className="btn-outline text-lg px-10 py-4"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="card-talkie-hover text-center">
            <h3 className="text-2xl font-[var(--font-family-fun)] font-bold text-warmgray-800 mb-3">
              Educational & Fun
            </h3>
            <p className="text-warmgray-600 leading-relaxed">
              Toys designed to make learning exciting for children aged 2-8
            </p>
          </div>

          <div className="card-talkie-hover text-center">
            <h3 className="text-2xl font-[var(--font-family-fun)] font-bold text-warmgray-800 mb-3">
              Safe & Friendly
            </h3>
            <p className="text-warmgray-600 leading-relaxed">
              High-quality materials that are safe for kids and approved by parents
            </p>
          </div>

          <div className="card-talkie-hover text-center">
            <h3 className="text-2xl font-[var(--font-family-fun)] font-bold text-warmgray-800 mb-3">
              Parent Approved
            </h3>
            <p className="text-warmgray-600 leading-relaxed">
              Trusted by families worldwide for quality and educational value
            </p>
          </div>
        </div>

        {/* New Features Section */}
        <div className="mt-20">
          <h3 className="text-4xl font-[var(--font-family-fun)] font-bold text-center text-warmgray-800 mb-10">
            Explore Our Features
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Assessments */}
            <Link to="/assessments" className="card-talkie-hover group">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-teal-light rounded-xl group-hover:scale-110 transition-transform">
                  <ClipboardList className="h-8 w-8 text-teal" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-warmgray-800 mb-2">Speech Assessments</h4>
                  <p className="text-warmgray-600">
                    Take interactive assessments to evaluate your child's speech development
                  </p>
                </div>
              </div>
            </Link>

            {/* Milestones */}
            <Link to="/milestones" className="card-talkie-hover group">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-coral-light rounded-xl group-hover:scale-110 transition-transform">
                  <Milestone className="h-8 w-8 text-coral" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-warmgray-800 mb-2">Developmental Milestones</h4>
                  <p className="text-warmgray-600">
                    Track key speech and language milestones for ages 0-8
                  </p>
                </div>
              </div>
            </Link>

            {/* Progress Tracker */}
            <Link to="/progress" className="card-talkie-hover group">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-teal-light rounded-xl group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-8 w-8 text-teal" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-warmgray-800 mb-2">Progress Tracking</h4>
                  <p className="text-warmgray-600">
                    Log and visualize your child's speech development progress
                  </p>
                </div>
              </div>
            </Link>

            {/* Blog */}
            <Link to="/blog" className="card-talkie-hover group">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-coral-light rounded-xl group-hover:scale-110 transition-transform">
                  <BookOpen className="h-8 w-8 text-coral" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-warmgray-800 mb-2">Expert Blog</h4>
                  <p className="text-warmgray-600">
                    Read tips, guides, and success stories from speech experts
                  </p>
                </div>
              </div>
            </Link>

            {/* Resources */}
            <Link to="/resources" className="card-talkie-hover group">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-teal-light rounded-xl group-hover:scale-110 transition-transform">
                  <Download className="h-8 w-8 text-teal" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-warmgray-800 mb-2">Free Resources</h4>
                  <p className="text-warmgray-600">
                    Download worksheets, guides, and checklists for home practice
                  </p>
                </div>
              </div>
            </Link>

            {/* Products */}
            <Link to="/products" className="card-talkie-hover group">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-coral-light rounded-xl group-hover:scale-110 transition-transform">
                  <svg className="h-8 w-8 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-warmgray-800 mb-2">Shop Products</h4>
                  <p className="text-warmgray-600">
                    Browse our curated selection of speech therapy toys
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* User-specific content */}
        {isAuthenticated && (
          <div className="mt-16 card-talkie bg-teal-gradient text-white">
            <h3 className="text-3xl font-[var(--font-family-fun)] font-bold mb-4">
              Welcome back, {user?.name}! 
            </h3>
            <p className="text-white/90 mb-6 text-lg">
              You're logged in as a <span className="font-bold capitalize">{user?.role}</span>.
            </p>
            <div className="flex gap-4">
              <Link
                to="/profile"
                className="bg-white text-teal font-semibold px-8 py-3 rounded-pill shadow-soft hover-lift"
              >
                View Profile
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
    </Layout>
  );
};

export default Home;
