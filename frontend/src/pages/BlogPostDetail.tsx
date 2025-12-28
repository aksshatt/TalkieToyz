import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import BlogPostContent from '../components/blog/BlogPostContent';
import BlogCommentList from '../components/blog/BlogCommentList';
import BlogCommentForm from '../components/blog/BlogCommentForm';
import SocialShareButtons from '../components/blog/SocialShareButtons';
import { blogService } from '../services/blogService';
import type { BlogPost } from '../types/blog';

const BlogPostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) loadPost();
  }, [slug]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const response = await blogService.getBlogPost(slug!);
      setPost(response.data);
    } catch (err) {
      console.error('Failed to load post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (comment: any) => {
    try {
      await blogService.addComment(slug!, comment);
    } catch (err) {
      console.error('Failed to submit comment:', err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-cream-light flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal"></div>
        </div>
      </Layout>
    );
  }

  if (!post) return <div>Post not found</div>;

  return (
    <Layout>
      <div className="min-h-screen bg-cream-light py-12">
        <div className="container-talkie max-w-4xl">
          <Link to="/blog" className="btn-secondary-talkie mb-6 inline-flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            Back to Blog
          </Link>
          <div className="card-talkie p-8 mb-6">
            {post.featured_image_url && (
              <img src={post.featured_image_url} alt={post.title} className="w-full h-64 object-cover rounded-lg mb-6" />
            )}
            <h1 className="heading-talkie mb-4">{post.title}</h1>
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-warmgray-200">
              <div className="flex items-center gap-4 text-sm text-warmgray-600">
                <span>By {post.author.name}</span>
                <span>•</span>
                <span>{new Date(post.published_at).toLocaleDateString()}</span>
                <span>•</span>
                <span>{post.reading_time_minutes} min read</span>
              </div>
              <SocialShareButtons url={window.location.href} title={post.title} />
            </div>
            <BlogPostContent content={post.content_html} />
          </div>
          {post.allow_comments && (
            <>
              <div className="mb-6">
                <BlogCommentList comments={post.approved_comments} />
              </div>
              <BlogCommentForm onSubmit={handleCommentSubmit} />
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BlogPostDetail;
