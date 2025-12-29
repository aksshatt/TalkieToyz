import { useEffect, useState } from 'react';
import { Heart, Sparkles, Target } from 'lucide-react';
import Layout from '../components/layout/Layout';
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

  // Parse vision cards from JSON
  const getVisionCards = () => {
    try {
      return content.vision_cards ? JSON.parse(content.vision_cards) : [];
    } catch {
      return [];
    }
  };

  const visionCards = getVisionCards();

  // Icon mapping
  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      heart: Heart,
      sparkles: Sparkles,
      target: Target
    };
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
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center text-red-600">{error}</div>
          </div>
        </div>
      </Layout>
    );
  }

  const HeroIcon = getIcon(content.hero_icon || 'heart');

  return (
    <Layout>
      <div className="min-h-screen py-12 bg-warmgray-50">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-teal-light/30 rounded-full mb-4">
              <HeroIcon className="h-12 w-12 text-teal" />
            </div>
            <h1 className="text-5xl font-[var(--font-family-fun)] font-bold mb-4">
              <span className="text-teal">{content.hero_title || 'About Us'}</span>
            </h1>
          </div>

          {/* Main Content Card with Image */}
          <div className="card-talkie mb-8">
            <h2 className="text-3xl font-[var(--font-family-fun)] font-bold text-warmgray-800 mb-6 text-center">
              {content.main_heading || 'Meet the Mind Behind Talkie Toyz'}
            </h2>

            <div className="grid md:grid-cols-3 gap-8 items-start">
              {/* Image Section */}
              <div className="md:col-span-1">
                <div className="relative rounded-2xl overflow-hidden shadow-soft-lg">
                  <img
                    src={content.founder_image || '/swekchaa-tamrakar.jpg'}
                    alt={`${content.founder_name || 'Swekchaa Tamrakar'} - Founder of Talkie Toyz`}
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image not found
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"%3E%3Crect width="400" height="500" fill="%2399d5d0"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="%23fff" text-anchor="middle" dominant-baseline="middle"%3E' + encodeURIComponent(content.founder_name || 'Founder') + '%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal/20 to-transparent"></div>
                </div>
                <p className="text-center text-sm text-warmgray-600 mt-3 font-medium">
                  {content.founder_name || 'Swekchaa Tamrakar'}
                  <br />
                  <span className="text-teal">{content.founder_title || 'Founder & Speech Therapist'}</span>
                </p>
              </div>

              {/* Text Content */}
              <div className="md:col-span-2 prose prose-lg max-w-none">
                <p className="text-lg text-warmgray-700 leading-relaxed mb-6">
                  {content.founder_bio_1 || "I'm Swekchaa Tamrakar, a speech and hearing professional..."}
                </p>

                {content.founder_bio_2 && (
                  <p className="text-lg text-warmgray-700 leading-relaxed mb-6">
                    {content.founder_bio_2}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Vision Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {visionCards.map((card: any, index: number) => {
              const CardIcon = getIcon(card.icon);
              const colorClasses = {
                teal: 'bg-teal-light/30 text-teal',
                coral: 'bg-coral-light/30 text-coral',
                sunshine: 'bg-sunshine-light/30 text-sunshine'
              };
              const colorClass = colorClasses[card.color as keyof typeof colorClasses] || colorClasses.teal;

              return (
                <div key={index} className="card-talkie text-center">
                  <div className={`inline-block p-3 ${colorClass.split(' ')[0]} rounded-full mb-4`}>
                    <CardIcon className={`h-8 w-8 ${colorClass.split(' ')[1]}`} />
                  </div>
                  <h3 className="text-xl font-bold text-warmgray-800 mb-3">{card.title}</h3>
                  <p className="text-warmgray-600">{card.description}</p>
                </div>
              );
            })}
          </div>

          {/* Credentials Section */}
          <div className="card-talkie bg-teal-light/20">
            <h3 className="text-2xl font-bold text-warmgray-800 mb-4 text-center">
              {content.credentials_heading || 'Professional Background'}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-lg text-teal mb-2">
                  {content.talkie_toyz_title || 'Talkie Toyz'}
                </h4>
                <p className="text-warmgray-700">
                  {content.talkie_toyz_description || 'Founder & Creator of therapeutic toys designed specifically for speech and communication development.'}
                </p>
              </div>
              <div>
                <h4 className="font-bold text-lg text-coral mb-2">
                  {content.madhuram_title || 'Madhuram Multi Rehabilitation Centre'}
                </h4>
                <p className="text-warmgray-700">
                  {content.madhuram_description || 'Founder & Speech-Hearing Professional providing comprehensive therapy services for children.'}
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-8">
            <p className="text-lg text-warmgray-600 mb-6">
              {content.cta_text || 'Join us in making communication development fun, effective, and accessible for every child.'}
            </p>
            <div className="flex gap-4 justify-center">
              <a href={content.cta_button_1_link || '/products'} className="btn-primary">
                {content.cta_button_1_text || 'Explore Our Toys'}
              </a>
              <a href={content.cta_button_2_link || '/contact'} className="btn-outline">
                {content.cta_button_2_text || 'Get in Touch'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
