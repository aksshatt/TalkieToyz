import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import BlogPostCard from '../components/blog/BlogPostCard';
import NewsletterSignup from '../components/blog/NewsletterSignup';
import { blogService } from '../services/blogService';
import type { BlogPostSummary } from '../types/blog';
import Layout from '../components/layout/Layout';

const BlogList = () => {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await blogService.getBlogPosts();
      setPosts(response.data);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletterSubmit = async (data: any) => {
    await blogService.subscribeNewsletter(data);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-cream-light py-12">
        <div className="container-talkie">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-gradient rounded-full mb-4">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="heading-talkie mb-4">Blog & Resources</h1>
            <p className="text-warmgray-600 max-w-2xl mx-auto">
              Expert tips, guides, and insights for speech development.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>

            <div>
              <NewsletterSignup onSubmit={handleNewsletterSubmit} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogList;
