import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Star, Trash2, Search } from 'lucide-react';
import { adminService, type AdminSuccessStory } from '../../services/adminService';
import toast from 'react-hot-toast';

type Filter = 'all' | 'pending' | 'approved' | 'featured';

export default function SuccessStories() {
  const [stories, setStories] = useState<AdminSuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('pending');
  const [search, setSearch] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      const filters: Record<string, any> = { per_page: 50 };
      if (filter === 'pending') filters.approved = false;
      if (filter === 'approved') filters.approved = true;
      if (filter === 'featured') filters.featured = true;
      if (search.trim()) filters.q = search.trim();

      const res = await adminService.getSuccessStories(filters);
      setStories(res.data.success_stories);
      setTotalCount(res.data.meta?.total_count ?? res.data.success_stories.length);
    } catch {
      toast.error('Failed to load success stories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); load(); };

  const handleApprove = async (id: number) => {
    try {
      await adminService.approveStory(id);
      toast.success('Story approved');
      load();
    } catch {
      toast.error('Failed to approve story');
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm('Reject this story? It will be hidden from the public.')) return;
    try {
      await adminService.rejectStory(id);
      toast.success('Story rejected');
      load();
    } catch {
      toast.error('Failed to reject story');
    }
  };

  const handleFeature = async (story: AdminSuccessStory) => {
    try {
      await adminService.featureStory(story.id);
      toast.success(story.featured ? 'Story unfeatured' : 'Story featured');
      load();
    } catch {
      toast.error('Failed to update story');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this story permanently?')) return;
    try {
      await adminService.deleteStory(id);
      toast.success('Story deleted');
      load();
    } catch {
      toast.error('Failed to delete story');
    }
  };

  const tabs: { key: Filter; label: string }[] = [
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'featured', label: 'Featured' },
    { key: 'all', label: 'All' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-warmgray-800">Success Stories</h1>
          <p className="text-sm text-warmgray-500 mt-1">{totalCount} total stories</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stories or users..."
            className="px-3 py-2 border border-warmgray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <button
            type="submit"
            className="p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filter === t.key
                ? 'bg-teal-500 text-white'
                : 'bg-white text-warmgray-600 border border-warmgray-200 hover:bg-warmgray-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : stories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-warmgray-200">
          <p className="text-warmgray-500">No stories found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {stories.map((story) => (
            <div key={story.id} className="bg-white rounded-xl border border-warmgray-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-warmgray-800">{story.child_name}</span>
                    <span className="text-sm text-warmgray-500">
                      · {Math.floor(story.age_months / 12)}y {story.age_months % 12}m
                    </span>
                    {story.speech_goal && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        {story.speech_goal}
                      </span>
                    )}
                    {story.approved && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Approved</span>
                    )}
                    {story.featured && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="h-3 w-3" /> Featured
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-warmgray-500 mb-3">
                    Submitted by <span className="font-medium">{story.user.name}</span> ({story.user.email})
                    {story.product && <> · Product: <span className="font-medium">{story.product.name}</span></>}
                  </p>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-red-700 mb-1">Before</p>
                      <p className="text-sm text-warmgray-700">{story.before_text}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-green-700 mb-1">After</p>
                      <p className="text-sm text-warmgray-700">{story.after_text}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  {!story.approved && (
                    <button
                      onClick={() => handleApprove(story.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <CheckCircle className="h-3.5 w-3.5" /> Approve
                    </button>
                  )}
                  {story.approved && (
                    <button
                      onClick={() => handleReject(story.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white text-xs font-semibold rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Unpublish
                    </button>
                  )}
                  <button
                    onClick={() => handleFeature(story)}
                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      story.featured
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        : 'bg-gray-100 text-warmgray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Star className="h-3.5 w-3.5" />
                    {story.featured ? 'Unfeature' : 'Feature'}
                  </button>
                  <button
                    onClick={() => handleDelete(story.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
