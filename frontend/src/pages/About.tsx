import { useEffect, useState } from 'react';
import {
  Heart,
  Sparkles,
  Target,
  ArrowRight,
  MapPin,
  Phone,
  Clock,
  Award,
  Users,
  GraduationCap,
  Star,
  Quote,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SEO from '../components/common/SEO';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { siteContentService } from '../services/siteContentService';
import type { SiteContentKeys } from '../types/siteContent';

const About = () => {
  const [content, setContent] = useState<SiteContentKeys>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      const data = await siteContentService.getPageContentKeys('about');
      setContent(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load content:', err);
      setError('Failed to load page content');
    } finally {
      setIsLoading(false);
    }
  };

  const getVisionCards = () => {
    try {
      return content.vision_cards ? JSON.parse(content.vision_cards) : [];
    } catch {
      return [];
    }
  };
  const visionCards = getVisionCards();

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = { heart: Heart, sparkles: Sparkles, target: Target };
    return icons[iconName] || Heart;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen py-12 bg-warmgray-50">
          <div className="max-w-4xl mx-auto px-4">
            <LoadingSkeleton />
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen py-12 bg-warmgray-50">
          <div className="max-w-4xl mx-auto px-4 text-center text-red-600">{error}</div>
        </div>
      </Layout>
    );
  }

  const HeroIcon = getIcon(content.hero_icon || 'heart');

  const cardGradients: Record<string, string> = {
    teal: 'from-teal/15 via-teal-light/25 to-white border-teal/20',
    coral: 'from-coral/15 via-coral-light/25 to-white border-coral/20',
    sunshine: 'from-sunshine/20 via-sunshine-light/30 to-white border-sunshine/20',
  };
  const iconGradients: Record<string, string> = {
    teal: 'bg-teal-gradient',
    coral: 'bg-coral-gradient',
    sunshine: 'bg-sunshine-gradient',
  };

  const stats = [
    { icon: Users, value: '200+', label: 'Happy Families' },
    { icon: GraduationCap, value: '5+', label: 'Years Experience' },
    { icon: Award, value: 'RCI', label: 'Certified' },
    { icon: Star, value: '4.8', label: 'Avg Rating' },
  ];

  const values = [
    { icon: '🎯', title: 'Purposeful Play', text: 'Every toy is built around a specific therapy goal.' },
    { icon: '🧠', title: 'Evidence-Based', text: 'Rooted in speech and language therapy research.' },
    { icon: '💛', title: 'Child-First', text: 'Safe, gentle, and designed for little hands.' },
    { icon: '🌱', title: 'Inclusive', text: 'Supporting every child, every ability, every journey.' },
  ];

  return (
    <Layout>
      <SEO
        title="About Us"
        description="Meet the team behind TalkieToys — therapist-designed speech therapy toys that help children communicate, learn, and grow through play."
        url="/about"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-coral-dark via-coral to-sunshine py-24 px-4">
        <motion.div
          className="absolute w-[28rem] h-[28rem] rounded-full bg-white/10 blur-3xl pointer-events-none"
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '-20%', left: '-8%' }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-teal/25 blur-3xl pointer-events-none"
          animate={{ x: [0, -30, 0], y: [0, 35, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ bottom: '-20%', right: '-5%' }}
        />
        {[Heart, Sparkles, Target, Star, Award].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute text-white/15 pointer-events-none hidden md:block"
            style={{ top: `${10 + i * 16}%`, left: `${5 + i * 18}%` }}
            animate={{ y: [0, -14, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
          >
            <Icon className="w-8 h-8" />
          </motion.div>
        ))}

        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-2 rounded-full mb-5 border border-white/25"
          >
            <HeroIcon className="w-4 h-4 text-sunshine" />
            <span className="text-sm font-semibold">Our Story</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg leading-tight"
          >
            {content.hero_title || (
              <>
                Made with <span className="text-sunshine">love</span>, built for{' '}
                <span className="text-white underline decoration-sunshine decoration-4 underline-offset-4">
                  every child
                </span>
              </>
            )}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
          >
            Therapist-designed, play-powered, and crafted to unlock communication — one joyful
            moment at a time.
          </motion.p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 48C240 16 480 0 720 0C960 0 1200 16 1440 48H0Z" fill="#fdf8f0" />
          </svg>
        </div>
      </section>

      {/* Stats band */}
      <section className="relative -mt-6 px-4 z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 bg-white rounded-3xl shadow-soft-xl border border-warmgray-100 p-5 md:p-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-coral/15 to-teal/15 mb-2">
                <s.icon className="w-5 h-5 text-coral" />
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-warmgray-900">{s.value}</div>
              <div className="text-xs md:text-sm text-warmgray-600 font-semibold">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="bg-cream-light py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Founder */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 grid md:grid-cols-[380px_1fr] gap-10 items-center"
          >
            {/* Image with frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative mx-auto md:mx-0 w-full max-w-sm"
            >
              <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl bg-coral/20 -z-10" />
              <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl bg-teal/20 -z-10" />
              <div className="relative rounded-3xl overflow-hidden shadow-soft-xl border-4 border-white">
                <img
                  src={content.founder_image || '/swekchaa-tamrakar.jpg'}
                  alt={`${content.founder_name || 'Swekchaa Tamrakar'} - Founder of Talkie Toyz`}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"%3E%3Crect width="400" height="500" fill="%2399d5d0"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="%23fff" text-anchor="middle" dominant-baseline="middle"%3E' +
                      encodeURIComponent(content.founder_name || 'Founder') +
                      '%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
              <div className="mt-5 bg-white rounded-2xl shadow-soft p-4 text-center border border-warmgray-100">
                <p className="font-extrabold text-warmgray-900">
                  {content.founder_name || 'Swekchaa Tamrakar'}
                </p>
                <p className="text-coral text-sm font-semibold mt-0.5">
                  {content.founder_title || 'Founder & Speech Therapist'}
                </p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-sunshine fill-sunshine" />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="inline-flex items-center gap-2 bg-coral/10 text-coral text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
                <Sparkles className="w-3.5 h-3.5" /> Meet the Founder
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-warmgray-900 mb-5 leading-tight">
                {content.main_heading || 'Meet the Mind Behind Talkie Toyz'}
              </h2>
              <div className="relative bg-white rounded-2xl p-6 shadow-soft border border-warmgray-100 mb-5">
                <Quote className="absolute -top-3 -left-3 w-8 h-8 text-coral bg-white rounded-full p-1.5 border border-coral/20" />
                <p className="text-warmgray-700 leading-relaxed italic">
                  {content.founder_bio_1 ||
                    "I'm Swekchaa Tamrakar, a speech and hearing professional, founder of Talkie Toyz and Madhuram Multi Rehabilitation Centre, and a passionate believer in learning through play."}
                </p>
              </div>
              <p className="text-warmgray-700 leading-relaxed">
                {content.founder_bio_2 ||
                  "That's how Talkie Toyz was born — to create toys that don't just entertain, but educate, empower, and encourage communication."}
              </p>
            </motion.div>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-teal/10 text-teal text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3">
                <Heart className="w-3.5 h-3.5" /> What We Stand For
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-warmgray-900">
                Our <span className="text-coral">Values</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl p-5 text-center shadow-soft border border-warmgray-100 hover:shadow-soft-md transition-all"
                >
                  <div className="text-4xl mb-2">{v.icon}</div>
                  <h3 className="font-extrabold text-warmgray-900 mb-1">{v.title}</h3>
                  <p className="text-xs text-warmgray-600 leading-relaxed">{v.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Vision cards (CMS) */}
          {visionCards.length > 0 && (
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {visionCards.map((card: any, index: number) => {
                const CardIcon = getIcon(card.icon);
                const gradientClass = cardGradients[card.color as keyof typeof cardGradients] || cardGradients.teal;
                const iconClass = iconGradients[card.color as keyof typeof iconGradients] || iconGradients.teal;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -8, boxShadow: '0 20px 44px rgba(0,0,0,0.1)' }}
                    className={`relative bg-gradient-to-br ${gradientClass} rounded-3xl p-7 text-center border-2 shadow-soft overflow-hidden`}
                  >
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 ${iconClass} rounded-2xl mb-5 shadow-soft-md`}
                    >
                      <CardIcon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-extrabold text-warmgray-900 mb-2">{card.title}</h3>
                    <p className="text-warmgray-700 text-sm leading-relaxed">{card.description}</p>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Credentials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-sunshine/20 text-warmgray-800 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3">
                <Award className="w-3.5 h-3.5" /> Professional Background
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-warmgray-900">
                {content.credentials_heading || 'Backed by Expertise'}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ y: -4 }}
                className="relative bg-white rounded-3xl p-7 shadow-soft border-t-4 border-teal overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-light/30 rounded-full blur-2xl pointer-events-none" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-gradient rounded-2xl mb-4 shadow-soft">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-extrabold text-xl text-teal mb-2">
                    {content.talkie_toyz_title || 'Talkie Toyz'}
                  </h4>
                  <p className="text-warmgray-700 text-sm leading-relaxed">
                    {content.talkie_toyz_description ||
                      'Founder & Creator of therapeutic toys designed specifically for speech and communication development.'}
                  </p>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ y: -4 }}
                className="relative bg-white rounded-3xl p-7 shadow-soft border-t-4 border-coral overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-coral-light/30 rounded-full blur-2xl pointer-events-none" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-coral-gradient rounded-2xl mb-4 shadow-soft">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-extrabold text-xl text-coral mb-2">
                    {content.madhuram_title || 'Madhuram Multi Rehabilitation Centre'}
                  </h4>
                  <p className="text-warmgray-700 text-sm leading-relaxed">
                    {content.madhuram_description ||
                      'Founder & Speech-Hearing Professional providing comprehensive therapy services for children.'}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-soft-xl overflow-hidden mb-16 border border-warmgray-100"
          >
            <div className="grid md:grid-cols-2">
              <div className="h-72 md:h-auto md:min-h-[400px]">
                <iframe
                  title="TalkieToys Location"
                  src="https://www.google.com/maps?q=4th+gate+Near+Madan+Mahal+Railway+Station+Rd+Wright+Town+Jabalpur+Madhya+Pradesh+482002&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="p-8 md:p-10">
                <div className="inline-flex items-center gap-2 bg-teal/10 text-teal text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3">
                  <MapPin className="w-3.5 h-3.5" /> Visit Us
                </div>
                <h3 className="text-3xl font-extrabold text-warmgray-900 mb-2">Come say hi in Jabalpur</h3>
                <p className="text-warmgray-600 mb-7">
                  Drop by our centre or give us a call — we'd love to meet you.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-11 h-11 bg-teal-gradient rounded-xl flex items-center justify-center shadow-soft">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-extrabold text-warmgray-900 mb-0.5">Address</p>
                      <p className="text-warmgray-600 text-sm leading-relaxed">
                        4th Gate, Near Madan Mahal Railway Station Rd,
                        <br />
                        Wright Town, Jabalpur, Madhya Pradesh 482002
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-11 h-11 bg-coral-gradient rounded-xl flex items-center justify-center shadow-soft">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-extrabold text-warmgray-900 mb-0.5">Phone</p>
                      <a href="tel:+919340113875" className="text-coral font-bold hover:underline">
                        +91 93401 13875
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-11 h-11 bg-sunshine-gradient rounded-xl flex items-center justify-center shadow-soft">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-extrabold text-warmgray-900 mb-0.5">Hours</p>
                      <p className="text-warmgray-600 text-sm">Mon – Sat · 10:30 am onwards</p>
                    </div>
                  </div>
                </div>

                <div className="mt-7 pt-6 border-t border-warmgray-200 space-y-2">
                  {['Free parking nearby', 'Wheelchair accessible', 'Welcoming child-safe space'].map((line) => (
                    <div key={line} className="flex items-center gap-2 text-sm text-warmgray-700">
                      <CheckCircle2 className="w-4 h-4 text-teal" /> {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden bg-gradient-to-br from-teal via-teal-dark to-sky rounded-3xl p-10 md:p-14 text-center text-white shadow-soft-xl"
          >
            <motion.div
              className="absolute w-52 h-52 rounded-full bg-white/10 blur-3xl pointer-events-none"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ top: '-20%', right: '10%' }}
            />
            <motion.div
              className="absolute w-40 h-40 rounded-full bg-sunshine/20 blur-3xl pointer-events-none"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              style={{ bottom: '-20%', left: '10%' }}
            />
            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-5"
              >
                <Heart className="w-7 h-7 text-white" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                Let's make communication fun — together
              </h2>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg">
                {content.cta_text ||
                  'Join us in making communication development fun, effective, and accessible for every child.'}
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    to={content.cta_button_1_link || '/products'}
                    className="inline-flex items-center gap-2 bg-white text-teal font-extrabold px-7 py-3.5 rounded-full shadow-soft-lg hover:shadow-soft-xl transition-all"
                  >
                    {content.cta_button_1_text || 'Explore Our Toys'} <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    to={content.cta_button_2_link || '/contact'}
                    className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border-2 border-white/40 text-white font-extrabold px-7 py-3.5 rounded-full hover:bg-white/25 transition-all"
                  >
                    {content.cta_button_2_text || 'Get in Touch'}
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
