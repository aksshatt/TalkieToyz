import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BlogPostForm from '../../components/admin/BlogPostForm';
import { blogService } from '../../services/blogService';
import type { BlogPostFormData } from '../../types/blog';

const BlogPostFormPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  const handleSubmit = async (data: BlogPostFormData) => {
    try {
      if (slug) {
        await blogService.admin.updateBlogPost(slug, data);
      } else {
        await blogService.admin.createBlogPost(data);
      }
      navigate('/admin/blog');
    } catch (err) {
      console.error('Failed to save post:', err);
    }
  };

  return (
    <div className="min-h-screen bg-cream-light py-12">
      <div className="container-talkie max-w-4xl">
        <button onClick={() => navigate('/admin/blog')} className="btn-secondary-talkie mb-6 flex items-center gap-2">
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        <div className="card-talkie p-8">
          <h1 className="heading-talkie mb-6">{slug ? 'Edit' : 'New'} Blog Post</h1>
          <BlogPostForm onSubmit={handleSubmit} onCancel={() => navigate('/admin/blog')} />
        </div>
      </div>
    </div>
  );
};

export default BlogPostFormPage;
