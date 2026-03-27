import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BlogPostForm from '../../components/admin/BlogPostForm';
import { blogService } from '../../services/blogService';
import type { BlogPostFormData } from '../../types/blog';

const BlogPostFormPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [initialData, setInitialData] = useState<Partial<BlogPostFormData> | undefined>(undefined);
  const [loading, setLoading] = useState(!!slug);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slug) return;
    blogService.admin.getBlogPost(slug)
      .then((response) => {
        const post = response.data;
        setInitialData({
          title: post.title,
          excerpt: post.excerpt,
          content: post.content_html,
          category: post.category,
          status: post.status,
          featured_image_url: post.featured_image_url,
          tags: post.tags,
          allow_comments: post.allow_comments,
          featured: post.featured,
        });
      })
      .catch(() => setError('Failed to load blog post'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSubmit = async (data: BlogPostFormData) => {
    setError(null);
    setSaving(true);
    try {
      if (slug) {
        await blogService.admin.updateBlogPost(slug, data);
      } else {
        await blogService.admin.createBlogPost(data);
      }
      navigate('/admin/blog');
    } catch (err: any) {
      const msg =
        err?.response?.data?.errors?.join(', ') ||
        err?.response?.data?.message ||
        'Failed to save post';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-light py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-light py-12">
      <div className="container-talkie max-w-4xl">
        <button onClick={() => navigate('/admin/blog')} className="btn-secondary-talkie mb-6 flex items-center gap-2">
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        <div className="card-talkie p-8">
          <h1 className="heading-talkie mb-6">{slug ? 'Edit' : 'New'} Blog Post</h1>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          <BlogPostForm
            initialData={initialData}
            saving={saving}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/admin/blog')}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogPostFormPage;
