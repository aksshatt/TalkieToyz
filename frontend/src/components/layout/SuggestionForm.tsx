import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from '../../config/axios';

const SuggestionForm: React.FC = () => {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      await axios.post('/suggestions', { suggestion: { message, email } });
      toast.success('Thanks for sharing your suggestion!');
      setMessage('');
      setEmail('');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={submit}>
      <textarea
        rows={3}
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your suggestion..."
        className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-warmgray-400 focus:outline-none focus:ring-2 focus:ring-teal-light transition-all resize-none"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email (optional)"
        className="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-warmgray-400 focus:outline-none focus:ring-2 focus:ring-teal-light transition-all"
      />
      <motion.button
        type="submit"
        disabled={submitting}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="w-full bg-teal-gradient text-white font-bold py-3 rounded-full hover:shadow-soft-lg transition-all disabled:opacity-60"
      >
        {submitting ? 'Sending...' : 'Send Suggestion'}
      </motion.button>
    </form>
  );
};

export default SuggestionForm;
