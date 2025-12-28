import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { blogService } from '../../services/blogService';
import type { BlogPostSummary } from '../../types/blog';

const BlogManagement = () => {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await blogService.admin.getBlogPosts();
      setPosts(response.data);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (window.confirm('Are you sure?')) {
      try {
        await blogService.admin.deleteBlogPost(slug);
        loadPosts();
      } catch (err) {
        console.error('Failed to delete:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-cream-light py-12">
      <div className="container-talkie">
        <div className="flex items-center justify-between mb-8">
          <h1 className="heading-talkie">Blog Management</h1>
          <Link to="/admin/blog/new" className="btn-primary-talkie flex items-center gap-2">
            <Plus className="h-5 w-5" />
            New Post
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto"></div>
          </div>
        ) : (
          <div className="card-talkie overflow-hidden">
            <table className="w-full">
              <thead className="bg-warmgray-100">
                <tr>
                  <th className="text-left p-4">Title</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Published</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-t border-warmgray-200">
                    <td className="p-4">{post.title}</td>
                    <td className="p-4">{post.category_display_name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-pill text-xs ${
                        post.status === 'published' ? 'bg-teal-light text-teal' : 'bg-warmgray-200'
                      }`}>
                        {post.status_display_name}
                      </span>
                    </td>
                    <td className="p-4">{new Date(post.published_at).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/blog/edit/${post.slug}`} className="p-2 hover:bg-warmgray-100 rounded">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button onClick={() => handleDelete(post.slug)} className="p-2 hover:bg-warmgray-100 rounded text-coral">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;
