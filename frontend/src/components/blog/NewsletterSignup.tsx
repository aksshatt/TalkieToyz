import { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import type { NewsletterSubscription } from '../../types/blog';

interface NewsletterSignupProps {
  onSubmit: (subscription: NewsletterSubscription) => Promise<void>;
}

const NewsletterSignup = ({ onSubmit }: NewsletterSignupProps) => {
  const [formData, setFormData] = useState<NewsletterSubscription>({
    email: '',
    name: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setIsSubmitted(true);
      setFormData({ email: '', name: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="card-talkie p-8 text-center bg-teal-light/30">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-gradient rounded-full mb-4">
          <Check className="h-8 w-8 text-white" />
        </div>
        <h3 className="font-[var(--font-family-fun)] font-bold text-2xl text-warmgray-900 mb-2">
          Almost There!
        </h3>
        <p className="text-warmgray-700">
          Please check your email to confirm your subscription.
        </p>
      </div>
    );
  }

  return (
    <div className="card-talkie p-8 bg-gradient-to-br from-teal-light/30 to-sky-light/30">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-teal-gradient rounded-full">
          <Mail className="h-6 w-6 text-white" />
        </div>
        <h3 className="font-[var(--font-family-fun)] font-bold text-2xl text-warmgray-900">
          Join Our Newsletter
        </h3>
      </div>

      <p className="text-warmgray-700 mb-6">
        Get expert tips, resources, and updates delivered to your inbox weekly!
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20"
          />
        </div>

        <div>
          <input
            type="email"
            required
            placeholder="Your email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary-talkie w-full"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
        </button>

        <p className="text-xs text-warmgray-500 text-center">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </form>
    </div>
  );
};

export default NewsletterSignup;
