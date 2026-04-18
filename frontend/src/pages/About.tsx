import { useEffect, useState } from 'react';
import { Heart, Sparkles, Target, ArrowRight, MapPin, Phone, Clock } from 'lucide-react';
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

  useEffect(() => { loadContent(); }, []);

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
    try { return content.vision_cards ? JSON.parse(content.vision_cards) : []; }
    catch { return []; }
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
          <div className="max-w-4xl mx-auto px-4"><LoadingSkeleton /></div>
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
    teal: 'from-teal/10 to-teal-light/20 border-teal/20',
    coral: 'from-coral/10 to-coral-light/20 border-coral/20',
    sunshine: 'from-sunshine/10 to-sunshine-light/20 border-sunshine/20',
  };
  const iconGradients: Record<string, string> = {
    teal: 'bg-teal-gradient',
    coral: 'bg-coral-gradient',
    sunshine: 'bg-sunshine-gradient',
  };

  return (
    <Layout>
      <SEO
        title="About Us"
        description="Meet the team behind TalkieToys — therapist-designed speech therapy toys that help children communicate, learn, and grow through play."
        url="/about"
      />
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-coral-dark via-coral to-sunshine py-20 px-4">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"
          animate={{ x: [0, 35, 0], y: [0, -25, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '-15%', left: '-5%' }}
        />
        <motion.div
          className="absolute w-72 h-72 rounded-full bg-teal/20 blur-3xl pointer-events-none"
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ bottom: '-15%', right: '5%' }}
        />
        <motion.div
          className="absolute w-52 h-52 rounded-full bg-white/15 blur-2xl pointer-events-none"
          animate={{ x: [0, 18, -12, 0], y: [0, -18, 12, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{ top: '30%', right: '15%' }}
        />

        {[Heart, Sparkles, Target].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute text-white/15 pointer-events-none"
            style={{ top: `${15 + i * 28}%`, left: `${8 + i * 25}%` }}
            animate={{ y: [0, -14, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4.5 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.9 }}
          >
            <Icon className="w-8 h-8" />
          </motion.div>
        ))}

        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6"
          >
            <HeroIcon className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-4xl md:text-5xl font-[var(--font-family-fun)] font-bold mb-4"
          >
            {content.hero_title || 'About Us'}
          </motion.h1>
          <motion.div
            className="h-1 bg-white/60 rounded-full mx-auto"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 48C240 16 480 0 720 0C960 0 1200 16 1440 48H0Z" fill="#fafaf9" />
          </svg>
        </div>
      </div>

      <div className="bg-warmgray-50 min-h-screen py-12">
        <div className="max-w-5xl mx-auto px-4">

          {/* Founder Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-soft-xl overflow-hidden mb-10"
          >
            <div className="p-8 md:p-10">
              <h2 className="text-3xl font-[var(--font-family-fun)] font-bold text-warmgray-800 mb-8 text-center">
                {content.main_heading || 'Meet the Mind Behind Talkie Toyz'}
              </h2>
              <div className="grid md:grid-cols-3 gap-8 items-start">
                {/* Image */}
                <motion.div
                  className="md:col-span-1"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-soft-lg">
                    <img
                      src={content.founder_image || '/swekchaa-tamrakar.jpg'}
                      alt={`${content.founder_name || 'Swekchaa Tamrakar'} - Founder of Talkie Toyz`}
                      className="w-full h-auto object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"%3E%3Crect width="400" height="500" fill="%2399d5d0"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="%23fff" text-anchor="middle" dominant-baseline="middle"%3E' + encodeURIComponent(content.founder_name || 'Founder') + '%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-coral/30 to-transparent" />
                  </div>
                  <div className="text-center mt-3">
                    <p className="font-bold text-warmgray-800">{content.founder_name || 'Swekchaa Tamrakar'}</p>
                    <p className="text-coral text-sm font-semibold">{content.founder_title || 'Founder & Speech Therapist'}</p>
                  </div>
                </motion.div>

                {/* Bio */}
                <motion.div
                  className="md:col-span-2"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <p className="text-lg text-warmgray-700 leading-relaxed mb-5">
                    {content.founder_bio_1 || "I'm Swekchaa Tamrakar, a speech and hearing professional, founder of Talkie Toyz and Madhuram Multi Rehabilitation Centre, and a passionate believer in learning through play."}
                  </p>
                  <p className="text-lg text-warmgray-700 leading-relaxed">
                    {content.founder_bio_2 || "That's how Talkie Toyz was born—to create toys that don't just entertain, but educate, empower, and encourage communication."}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Vision Cards */}
          {visionCards.length > 0 && (
            <div className="grid md:grid-cols-3 gap-6 mb-10">
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
                    whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(0,0,0,0.1)' }}
                    className={`bg-gradient-to-br ${gradientClass} rounded-2xl p-6 text-center border shadow-soft`}
                  >
                    <div className={`inline-flex items-center justify-center w-14 h-14 ${iconClass} rounded-2xl mb-4 shadow-soft`}>
                      <CardIcon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-warmgray-800 mb-2">{card.title}</h3>
                    <p className="text-warmgray-600 text-sm leading-relaxed">{card.description}</p>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Credentials Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-teal-light/20 to-sky-light/20 rounded-3xl p-8 md:p-10 border border-teal/10 shadow-soft mb-10"
          >
            <h3 className="text-2xl font-[var(--font-family-fun)] font-bold text-warmgray-800 mb-6 text-center">
              {content.credentials_heading || 'Professional Background'}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/70 rounded-2xl p-5 border border-teal/10">
                <h4 className="font-bold text-lg text-teal mb-2">{content.talkie_toyz_title || 'Talkie Toyz'}</h4>
                <p className="text-warmgray-700 text-sm leading-relaxed">
                  {content.talkie_toyz_description || 'Founder & Creator of therapeutic toys designed specifically for speech and communication development.'}
                </p>
              </div>
              <div className="bg-white/70 rounded-2xl p-5 border border-coral/10">
                <h4 className="font-bold text-lg text-coral mb-2">{content.madhuram_title || 'Madhuram Multi Rehabilitation Centre'}</h4>
                <p className="text-warmgray-700 text-sm leading-relaxed">
                  {content.madhuram_description || 'Founder & Speech-Hearing Professional providing comprehensive therapy services for children.'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Location Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-soft-xl overflow-hidden mb-10"
          >
            <div className="p-8 md:p-10">
              <h3 className="text-2xl font-[var(--font-family-fun)] font-bold text-warmgray-800 mb-2 text-center">
                Visit Us
              </h3>
              <p className="text-warmgray-500 text-center mb-8">Come meet us in Jabalpur</p>

              <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Map */}
                <div className="rounded-2xl overflow-hidden shadow-soft-lg h-72 md:h-80">
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

                {/* Info */}
                <div className="flex flex-col gap-5">
                  <div className="flex items-start gap-4 bg-teal/5 rounded-2xl p-5 border border-teal/10">
                    <div className="flex-shrink-0 w-10 h-10 bg-teal-gradient rounded-xl flex items-center justify-center shadow-soft">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-warmgray-800 mb-1">Address</p>
                      <p className="text-warmgray-600 text-sm leading-relaxed">
                        4th Gate, Near Madan Mahal Railway Station Rd,<br />
                        Wright Town, Jabalpur,<br />
                        Madhya Pradesh 482002
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-coral/5 rounded-2xl p-5 border border-coral/10">
                    <div className="flex-shrink-0 w-10 h-10 bg-coral-gradient rounded-xl flex items-center justify-center shadow-soft">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-warmgray-800 mb-1">Phone</p>
                      <a
                        href="tel:+919340113875"
                        className="text-coral font-semibold text-sm hover:underline"
                      >
                        093401 13875
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-sunshine/5 rounded-2xl p-5 border border-sunshine/10">
                    <div className="flex-shrink-0 w-10 h-10 bg-sunshine-gradient rounded-xl flex items-center justify-center shadow-soft">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-warmgray-800 mb-1">Hours</p>
                      <p className="text-warmgray-600 text-sm">Opens 10:30 am · Monday – Saturday</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-white rounded-3xl shadow-soft p-10"
          >
            <p className="text-lg text-warmgray-600 mb-7 max-w-xl mx-auto">
              {content.cta_text || 'Join us in making communication development fun, effective, and accessible for every child.'}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to={content.cta_button_1_link || '/products'}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-teal to-teal-dark text-white font-bold px-8 py-3.5 rounded-xl shadow-soft-lg hover:shadow-soft-xl transition-shadow"
                >
                  {content.cta_button_1_text || 'Explore Our Toys'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to={content.cta_button_2_link || '/contact'}
                  className="inline-flex items-center gap-2 bg-white text-teal font-bold px-8 py-3.5 rounded-xl border-2 border-teal/30 shadow-soft hover:shadow-soft-md transition-shadow"
                >
                  {content.cta_button_2_text || 'Get in Touch'}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
