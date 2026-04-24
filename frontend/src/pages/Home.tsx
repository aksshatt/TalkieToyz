import React from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  ChevronRight,
  Package,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Sparkles,
  Award,
  Star,
  ArrowRight,
  Target,
  BookOpen,
  MessageCircle,
  Users,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import SEO from '../components/common/SEO';
import HeroSection from '../components/home/HeroSection';
import DevelopmentalDomains from '../components/home/DevelopmentalDomains';
import FeaturedCollections from '../components/home/FeaturedCollections';
import SuccessStoriesSection from '../components/common/SuccessStoriesSection';

const trustStrip = [
  { icon: ShieldCheck, label: 'Therapist-Designed', sub: 'Built by RCI experts' },
  { icon: Truck, label: 'Free Shipping', sub: 'On orders over ₹999' },
  { icon: HeartHandshake, label: 'Child-Safe', sub: 'Non-toxic materials' },
  { icon: Award, label: 'Expert-Backed', sub: 'Proven techniques' },
];

const whyUs = [
  {
    icon: Target,
    color: 'from-teal/15 to-teal-light/25 border-teal/25',
    iconBg: 'bg-teal-gradient',
    title: 'Goal-Oriented Play',
    text: 'Each toy targets a specific speech or development goal — no fluff, just results.',
  },
  {
    icon: Sparkles,
    color: 'from-coral/15 to-coral-light/25 border-coral/25',
    iconBg: 'bg-coral-gradient',
    title: 'Therapist-Created',
    text: 'Designed and refined by certified speech-language pathologists over years of practice.',
  },
  {
    icon: HeartHandshake,
    color: 'from-sunshine/20 to-sunshine-light/30 border-sunshine/25',
    iconBg: 'bg-sunshine-gradient',
    title: 'Loved by Parents',
    text: 'Hundreds of families use our toys daily — and rate them 4.8★ on average.',
  },
];

const howItWorks = [
  {
    step: '1',
    title: 'Tell us about your child',
    text: 'Take our 3-minute quiz or browse by developmental goal.',
    icon: MessageCircle,
  },
  {
    step: '2',
    title: 'Get matched toys',
    text: 'We recommend age-appropriate, therapist-picked toys for your goals.',
    icon: Sparkles,
  },
  {
    step: '3',
    title: 'Play & grow together',
    text: 'Follow our play guides and watch your child flourish — at their own pace.',
    icon: Star,
  },
];

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
          description:
            'Quality speech therapy toys designed by therapists to help children practice specific sounds and build communication skills.',
          contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', email: 'talkietoyz@gmail.com' },
        }}
      />
      <div className="min-h-screen">
        {/* Hero */}
        <HeroSection />

        {/* Trust strip */}
        <section className="bg-white py-6 border-y border-warmgray-100">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustStrip.map((t, i) => (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 group"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-light/40 to-coral-light/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <t.icon className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <div className="font-extrabold text-warmgray-900 text-sm leading-tight">{t.label}</div>
                  <div className="text-xs text-warmgray-600">{t.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Developmental Areas */}
        <DevelopmentalDomains />

        {/* Why Choose Us */}
        <section className="py-16 bg-cream-light px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-teal/10 text-teal text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Why TalkieToyz
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-warmgray-900 mb-3">
                Play with a <span className="text-coral">purpose</span>
              </h2>
              <p className="text-warmgray-600 max-w-2xl mx-auto">
                Every toy we make is rooted in speech-therapy research — so every giggle moves your child forward.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {whyUs.map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className={`relative bg-gradient-to-br ${card.color} rounded-3xl p-7 border-2 shadow-soft overflow-hidden`}
                >
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 ${card.iconBg} rounded-2xl mb-5 shadow-soft-md`}
                  >
                    <card.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-extrabold text-warmgray-900 mb-2">{card.title}</h3>
                  <p className="text-warmgray-700 text-sm leading-relaxed">{card.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Collections */}
        <FeaturedCollections />

        {/* How it works */}
        <section className="py-20 px-4 bg-gradient-to-br from-teal-light/20 via-cream-light to-coral-light/20 relative overflow-hidden">
          <motion.div
            className="absolute w-80 h-80 rounded-full bg-teal/10 blur-3xl pointer-events-none"
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            style={{ top: '10%', right: '-10%' }}
          />
          <motion.div
            className="absolute w-72 h-72 rounded-full bg-coral/10 blur-3xl pointer-events-none"
            animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            style={{ bottom: '-10%', left: '-5%' }}
          />
          <div className="relative max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-2 bg-coral/10 text-coral text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3">
                <Target className="w-3.5 h-3.5" /> Simple as 1-2-3
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-warmgray-900">How it works</h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 relative">
              {howItWorks.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="relative bg-white rounded-3xl p-7 shadow-soft border border-warmgray-100 hover:shadow-soft-md transition-all"
                >
                  <div className="absolute -top-5 left-7 w-10 h-10 rounded-full bg-gradient-to-br from-teal to-teal-dark text-white flex items-center justify-center font-extrabold shadow-soft-md">
                    {step.step}
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-light/40 flex items-center justify-center mb-4 mt-3">
                    <step.icon className="w-6 h-6 text-teal" />
                  </div>
                  <h3 className="font-extrabold text-warmgray-900 text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-warmgray-600 leading-relaxed">{step.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quiz CTA */}
        <section className="py-16 px-4 bg-cream-light">
          <div className="max-w-6xl mx-auto relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-800 rounded-3xl p-10 md:p-14 shadow-soft-xl">
            <motion.div
              className="absolute w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"
              animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              style={{ top: '-20%', right: '-10%' }}
            />
            <motion.div
              className="absolute w-60 h-60 rounded-full bg-sunshine/20 blur-3xl pointer-events-none"
              animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              style={{ bottom: '-20%', left: '10%' }}
            />
            <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-center text-white">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/25">
                  <Brain className="w-3.5 h-3.5" /> 3 minutes · Free
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
                  Not sure where to <span className="text-sunshine">start?</span>
                </h2>
                <p className="text-white/90 text-lg max-w-xl mb-6">
                  Answer 3 quick questions about your child's speech goals and we'll recommend the
                  perfect toys — personalised just for them.
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/85 mb-2">
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-sunshine fill-sunshine" /> Tailored picks
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Age-appropriate
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Target className="w-4 h-4" /> Goal-aligned
                  </span>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="shrink-0">
                <Link
                  to="/quiz"
                  className="inline-flex items-center gap-2 bg-white text-indigo-700 font-extrabold px-8 py-4 rounded-full hover:bg-sunshine hover:text-indigo-900 transition-all shadow-soft-xl"
                >
                  Take the Free Quiz <ChevronRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Speech Kits */}
        <section className="py-14 px-4 bg-cream-light">
          <div className="max-w-6xl mx-auto relative bg-gradient-to-br from-sunshine/25 via-coral-light/40 to-coral/20 rounded-3xl p-8 md:p-12 shadow-soft border-2 border-sunshine/20 overflow-hidden">
            <motion.div
              className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-coral/20 blur-3xl pointer-events-none"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0 w-20 h-20 bg-coral-gradient rounded-3xl flex items-center justify-center shadow-soft-lg">
                <Package className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-coral/15 text-coral text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Curated bundles · Save up to 20%
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-warmgray-900 mb-1">
                  Therapist-Curated Speech Kits
                </h2>
                <p className="text-warmgray-700 md:max-w-xl">
                  Everything your child needs in one bundle — thoughtfully matched for age, goal, and play style.
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="shrink-0">
                <Link
                  to="/speech-kits"
                  className="inline-flex items-center gap-2 bg-coral-gradient text-white font-extrabold px-7 py-3.5 rounded-full hover:shadow-soft-lg transition-all shadow-soft"
                >
                  Browse Speech Kits <ChevronRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Parent Success Stories */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <SuccessStoriesSection featured={true} />
          </div>
        </section>

        {/* Explore resources */}
        <section className="py-16 px-4 bg-cream-light">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center gap-2 bg-sky/15 text-sky-dark text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3">
                <BookOpen className="w-3.5 h-3.5" /> Learn with us
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-warmgray-900 mb-2">
                Free resources for every parent
              </h2>
              <p className="text-warmgray-600">Guides, milestones, and articles — crafted by our therapist team.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  to: '/blog',
                  icon: BookOpen,
                  bg: 'from-teal to-teal-dark',
                  title: 'Learning Hub',
                  text: 'Expert tips, guides and stories for your child\'s speech journey.',
                },
                {
                  to: '/milestones',
                  icon: Target,
                  bg: 'from-coral to-coral-dark',
                  title: 'Milestone Tracker',
                  text: 'What to look for at every stage — 0 to 8 years, all covered.',
                },
                {
                  to: '/resources',
                  icon: Sparkles,
                  bg: 'from-sky to-sky-dark',
                  title: 'Free Downloads',
                  text: 'Printable worksheets and activity sheets, free forever.',
                },
              ].map((r, i) => (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    to={r.to}
                    className={`group relative block overflow-hidden rounded-3xl p-8 text-white bg-gradient-to-br ${r.bg} shadow-soft hover:shadow-soft-xl transition-all`}
                  >
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-4">
                        <r.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-extrabold mb-1">{r.title}</h3>
                      <p className="text-sm text-white/90 mb-4">{r.text}</p>
                      <span className="inline-flex items-center gap-1 text-sm font-bold group-hover:gap-2 transition-all">
                        Explore <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final Book-a-Session CTA */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-5xl mx-auto relative overflow-hidden bg-gradient-to-br from-teal via-teal-dark to-sky rounded-3xl p-10 md:p-14 shadow-soft-xl text-center text-white">
            <motion.div
              className="absolute w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ top: '-20%', right: '10%' }}
            />
            <motion.div
              className="absolute w-52 h-52 rounded-full bg-sunshine/20 blur-3xl pointer-events-none"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              style={{ bottom: '-20%', left: '10%' }}
            />
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-5"
              >
                <Users className="w-7 h-7 text-white" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Need one-on-one support?</h2>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg">
                Talk to a certified speech therapist for personalised guidance — available online and in-centre.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    to="/book"
                    className="inline-flex items-center gap-2 bg-white text-teal font-extrabold px-7 py-3.5 rounded-full shadow-soft-lg hover:shadow-soft-xl transition-all"
                  >
                    Book a Session <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border-2 border-white/40 text-white font-extrabold px-7 py-3.5 rounded-full hover:bg-white/25 transition-all"
                  >
                    View Services
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
