import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, Clock, ExternalLink, MessageCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import SEO from '../components/common/SEO';
import { contactService } from '../services/contactService';
import toast from 'react-hot-toast';
import type { ContactFormData } from '../types/contact';

const Contact = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    if (!formData.subject.trim() || formData.subject.trim().length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) { toast.error('Please fix the errors in the form'); return; }
    setIsSubmitting(true);
    try {
      const response = await contactService.submitContact(formData);
      if (response.success) {
        toast.success(response.message);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const infoCards = [
    {
      icon: MapPin,
      label: 'Address',
      gradient: 'from-sunshine/20 to-sunshine-light/30',
      iconBg: 'bg-sunshine-gradient',
      content: (
        <p className="text-warmgray-600 text-sm leading-relaxed">
          4th, gate, Near, Madan Mahal Railway Station Rd,<br />
          Wright Town, Jabalpur,<br />
          Madhya Pradesh 482002
        </p>
      ),
    },
    {
      icon: Clock,
      label: 'Business Hours',
      gradient: 'from-coral/20 to-coral-light/30',
      iconBg: 'bg-coral-gradient',
      content: <p className="text-warmgray-600 text-sm">Open · Closes 8:30 pm</p>,
    },
    {
      icon: ExternalLink,
      label: 'Find Us',
      gradient: 'from-teal/20 to-teal-light/30',
      iconBg: 'bg-teal-gradient',
      content: (
        <a
          href="https://share.google/XioJr7mP1cx3w0768"
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal hover:text-teal-dark underline text-sm font-medium"
        >
          View on Google Maps
        </a>
      ),
    },
  ];

  return (
    <Layout>
      <SEO
        title="Contact Us"
        description="Get in touch with TalkieToys. We're here to help with questions about speech therapy toys, orders, and child development resources."
        url="/contact"
      />
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-dark via-teal to-sky py-20 px-4">
        {/* Blobs */}
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '-10%', left: '-5%' }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-coral/20 blur-3xl pointer-events-none"
          animate={{ x: [0, -20, 0], y: [0, 25, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ bottom: '-10%', right: '10%' }}
        />
        <motion.div
          className="absolute w-48 h-48 rounded-full bg-sunshine/20 blur-2xl pointer-events-none"
          animate={{ x: [0, 15, -10, 0], y: [0, -15, 10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{ top: '20%', right: '20%' }}
        />

        {/* Floating icons */}
        {[MessageCircle, Mail, Sparkles].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute text-white/15 pointer-events-none"
            style={{ top: `${20 + i * 25}%`, left: `${5 + i * 30}%` }}
            animate={{ y: [0, -12, 0], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
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
            <MessageCircle className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-4xl md:text-5xl font-[var(--font-family-fun)] font-bold mb-4"
          >
            Get in <span className="text-sunshine">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-lg text-white/80 max-w-xl mx-auto"
          >
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </motion.p>

          {/* Wave divider */}
          <motion.div
            className="absolute bottom-0 left-0 right-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <path d="M0 48C240 16 480 0 720 0C960 0 1200 16 1440 48H0Z" fill="white" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-4">
              {infoCards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}
                  className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-5 border border-white/60 shadow-soft`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 ${card.iconBg} rounded-xl flex items-center justify-center shadow-soft`}>
                      <card.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-warmgray-800 mb-1">{card.label}</p>
                      {card.content}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Quick Response Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100 shadow-soft"
              >
                <p className="font-bold text-warmgray-800 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  Quick Response
                </p>
                <p className="text-warmgray-600 text-sm">
                  We typically respond within 24 hours on business days. For urgent queries, please call directly.
                </p>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft-xl border border-warmgray-100 p-8">
                <h2 className="text-2xl font-[var(--font-family-fun)] font-bold text-warmgray-800 mb-6 flex items-center gap-2">
                  <Send className="w-5 h-5 text-teal" />
                  Send us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-warmgray-700 mb-1.5">Name *</label>
                      <input
                        type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all bg-warmgray-50 focus:bg-white ${errors.name ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-warmgray-200 focus:border-teal focus:ring-teal/10'}`}
                        placeholder="Your name"
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-warmgray-700 mb-1.5">Email *</label>
                      <input
                        type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all bg-warmgray-50 focus:bg-white ${errors.email ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-warmgray-200 focus:border-teal focus:ring-teal/10'}`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-warmgray-700 mb-1.5">Phone (Optional)</label>
                      <input
                        type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all bg-warmgray-50 focus:bg-white ${errors.phone ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-warmgray-200 focus:border-teal focus:ring-teal/10'}`}
                        placeholder="9876543210"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-warmgray-700 mb-1.5">Subject *</label>
                      <select
                        id="subject" name="subject" value={formData.subject} onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all bg-warmgray-50 focus:bg-white ${errors.subject ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-warmgray-200 focus:border-teal focus:ring-teal/10'}`}
                      >
                        <option value="">Select a subject</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Product Question">Product Question</option>
                        <option value="Order Support">Order Support</option>
                        <option value="Shipping & Delivery">Shipping & Delivery</option>
                        <option value="Returns & Refunds">Returns & Refunds</option>
                        <option value="Therapy Consultation">Therapy Consultation</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-warmgray-700 mb-1.5">Message *</label>
                    <textarea
                      id="message" name="message" value={formData.message} onChange={handleChange} rows={5}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all bg-warmgray-50 focus:bg-white resize-none ${errors.message ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-warmgray-200 focus:border-teal focus:ring-teal/10'}`}
                      placeholder="Tell us more about your inquiry..."
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02, y: isSubmitting ? 0 : -2 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
                    className="w-full bg-gradient-to-r from-teal to-teal-dark text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-soft-lg hover:shadow-soft-xl transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
