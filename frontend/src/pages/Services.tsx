import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageCircle, HandMetal, Activity, BookOpen,
  Brain, Sparkles, Heart, Users, Calendar, ArrowRight,
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import SEO from '../components/common/SEO';

const services = [
  {
    title: 'Speech Therapy',
    slug: 'speech-therapy',
    Icon: MessageCircle,
    image: '/services/speech-therapy.png',
    tint: 'from-teal/15 to-sky/10',
    iconBg: 'bg-teal/15 text-teal',
    description:
      'We help children improve speech clarity, language development, communication skills, and social interaction. Therapy is customized to each child’s needs.',
  },
  {
    title: 'Occupational Therapy',
    slug: 'occupational-therapy',
    Icon: HandMetal,
    image: '/services/occupational-therapy.png',
    tint: 'from-sunshine/20 to-coral-light/15',
    iconBg: 'bg-sunshine/20 text-amber-600',
    description:
      'Focused on improving fine motor skills, sensory processing, attention, and daily living activities to make children more independent.',
  },
  {
    title: 'Physiotherapy',
    slug: 'physiotherapy',
    Icon: Activity,
    image: '/services/physiotherapy.png',
    tint: 'from-coral-light/20 to-sunshine/10',
    iconBg: 'bg-coral-light/30 text-coral',
    description:
      'Helps improve strength, balance, coordination, and overall physical development in children with motor delays or neurological conditions.',
  },
  {
    title: 'Special Education',
    slug: 'special-education',
    Icon: BookOpen,
    image: '/services/special-education.png',
    tint: 'from-sunshine/25 to-teal-light/10',
    iconBg: 'bg-sunshine/25 text-amber-700',
    description:
      'Individualized teaching strategies support children with learning difficulties, helping them improve academic and cognitive skills.',
  },
  {
    title: 'Psychological Assessment',
    slug: 'psychological-assessment',
    Icon: Brain,
    image: '/services/psychological-assessment.png',
    tint: 'from-sky/20 to-teal-light/10',
    iconBg: 'bg-sky/20 text-sky-700',
    description:
      'Detailed assessments understand a child’s cognitive, emotional, and behavioral profile for accurate diagnosis and intervention planning.',
  },
  {
    title: 'Behaviour Management',
    slug: 'behaviour-management',
    Icon: Sparkles,
    image: '/services/behaviour-management.png',
    tint: 'from-teal-light/20 to-sunshine/10',
    iconBg: 'bg-teal-light/30 text-teal',
    description:
      'We reduce challenging behaviors and promote positive behaviors using structured, child-friendly techniques.',
  },
  {
    title: 'Child Counselling',
    slug: 'child-counselling',
    Icon: Heart,
    image: '/services/child-counselling.png',
    tint: 'from-coral-light/20 to-sky/10',
    iconBg: 'bg-coral-light/30 text-coral',
    description:
      'Support for children dealing with emotional, social, and behavioral concerns in a safe and supportive environment.',
  },
  {
    title: 'Parent Counselling',
    slug: 'parent-counselling',
    Icon: Users,
    image: '/services/parent-counselling.png',
    tint: 'from-sky/20 to-coral-light/10',
    iconBg: 'bg-sky/25 text-sky-700',
    description:
      'Guidance and training for parents to understand their child’s needs better and continue therapy strategies at home.',
  },
];

const Services: React.FC = () => {
  return (
    <Layout>
      <SEO
        title="Our Services | Talkie Toyz"
        description="Speech Therapy, Occupational Therapy, Physiotherapy, Special Education, Psychological Assessment, Behaviour Management, Child & Parent Counselling — therapist-led services supporting children's growth."
        url="/services"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-light/30 via-white to-coral-light/20 pt-16 pb-20">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <motion.div
            className="absolute w-80 h-80 rounded-full bg-teal/20 blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            style={{ top: '-10%', left: '-5%' }}
          />
          <motion.div
            className="absolute w-72 h-72 rounded-full bg-coral/20 blur-3xl"
            animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            style={{ bottom: '-15%', right: '-5%' }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-1.5 rounded-full shadow-soft mb-5"
          >
            <Sparkles className="w-4 h-4 text-teal" />
            <span className="text-sm font-semibold text-warmgray-700">Therapist-Led Services</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-warmgray-900 mb-4"
          >
            Our <span className="bg-gradient-to-r from-teal to-coral bg-clip-text text-transparent">Services</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-warmgray-600 max-w-2xl mx-auto"
          >
            Supporting children’s growth and development through expert-led therapy, assessments, and counselling — customized to every child.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-3 justify-center mt-7"
          >
            <Link
              to="/book"
              className="inline-flex items-center gap-2 bg-teal-gradient text-white font-bold px-6 py-3 rounded-full shadow-soft hover:shadow-soft-lg transition-all"
            >
              <Calendar className="w-4 h-4" /> Book a Session
            </Link>
            <Link
              to="/assessments"
              className="inline-flex items-center gap-2 bg-white text-teal font-bold px-6 py-3 rounded-full border-2 border-teal/20 hover:border-teal hover:bg-teal/5 transition-all"
            >
              Free Assessment <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 bg-warmgray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-warmgray-900 mb-2">How We Help</h2>
            <p className="text-warmgray-600">Eight specialized services. One caring team.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -6 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all flex flex-col"
              >
                {/* Image band */}
                <div className={`relative bg-gradient-to-br ${s.tint} aspect-[4/3] overflow-hidden`}>
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className={`absolute top-3 left-3 w-10 h-10 rounded-2xl ${s.iconBg} backdrop-blur flex items-center justify-center shadow-soft`}>
                    <s.Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-warmgray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-warmgray-600 mb-4 flex-1 leading-relaxed">{s.description}</p>
                  <Link
                    to={`/book?service=${s.slug}`}
                    className="mt-auto inline-flex items-center justify-center gap-2 bg-teal-gradient text-white font-semibold px-4 py-2.5 rounded-full hover:shadow-soft-md transition-all text-sm"
                  >
                    <Calendar className="w-4 h-4" /> Book Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process strip */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-warmgray-900 mb-2">How It Works</h2>
            <p className="text-warmgray-600">Three simple steps to get started.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Book a Session', desc: 'Pick the service that fits your child and schedule a session with our therapist team.', Icon: Calendar },
              { step: '02', title: 'Assessment & Plan', desc: 'We evaluate your child’s unique needs and build a personalized therapy plan.', Icon: Brain },
              { step: '03', title: 'Grow Together', desc: 'Regular sessions, progress tracking, and parent guidance to support every step.', Icon: Sparkles },
            ].map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative bg-gradient-to-br from-warmgray-50 to-white border border-warmgray-100 rounded-3xl p-6 shadow-soft hover:shadow-soft-lg transition-all"
              >
                <span className="absolute -top-3 -right-3 text-6xl font-extrabold text-teal/10 select-none">{p.step}</span>
                <div className="w-12 h-12 rounded-2xl bg-teal-gradient text-white flex items-center justify-center mb-4 shadow-soft">
                  <p.Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-warmgray-900 mb-2">{p.title}</h3>
                <p className="text-warmgray-600 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-gradient-to-br from-teal via-sky to-coral rounded-3xl p-10 md:p-14 text-center text-white shadow-soft-lg relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute w-60 h-60 bg-white/30 rounded-full blur-3xl -top-20 -left-20" />
            <div className="absolute w-72 h-72 bg-white/20 rounded-full blur-3xl -bottom-24 -right-20" />
          </div>
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Ready to start your child’s journey?</h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-6">
              Our therapists are here to help. Book a free consultation and we’ll guide you to the right service.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/book"
                className="inline-flex items-center gap-2 bg-white text-teal font-bold px-7 py-3 rounded-full shadow-soft hover:scale-105 transition-transform"
              >
                <Calendar className="w-4 h-4" /> Book Now
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-white/10 border-2 border-white/40 text-white font-bold px-7 py-3 rounded-full hover:bg-white/20 transition-all"
              >
                Browse Therapy Toys <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Services;
