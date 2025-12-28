import { Download, FileText, Star } from 'lucide-react';
import type { Resource } from '../../types/blog';

interface ResourceCardProps {
  resource: Resource;
  onDownload?: (slug: string) => void;
}

const ResourceCard = ({ resource, onDownload }: ResourceCardProps) => {
  const typeIcons: Record<string, string> = {
    pdf: '📄',
    worksheet: '📝',
    guide: '📖',
    checklist: '✅',
    template: '📋',
    infographic: '📊',
    video: '🎥',
    audio: '🎵',
  };

  const typeIcon = typeIcons[resource.resource_type] || '📄';

  return (
    <div className="card-talkie p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{typeIcon}</div>
          <div>
            <h3 className="font-[var(--font-family-fun)] font-bold text-lg text-warmgray-900 line-clamp-2">
              {resource.title}
            </h3>
            <span className="text-xs text-warmgray-500">{resource.file_size_display}</span>
          </div>
        </div>

        {resource.premium && (
          <span className="bg-sunshine-gradient text-warmgray-900 text-xs font-bold px-2 py-1 rounded-pill shadow-soft flex items-center gap-1">
            <Star className="h-3 w-3" />
            Premium
          </span>
        )}
      </div>

      <p className="text-sm text-warmgray-600 mb-4 line-clamp-3">{resource.description}</p>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="bg-teal-gradient text-white text-xs font-bold px-3 py-1 rounded-pill shadow-soft">
          {resource.resource_category.name}
        </span>
        {resource.tags && resource.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="bg-warmgray-100 text-warmgray-700 text-xs font-semibold px-2 py-1 rounded-pill">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-warmgray-200">
        <div className="flex items-center gap-1 text-xs text-warmgray-500">
          <Download className="h-3 w-3" />
          {resource.download_count} downloads
        </div>

        <button
          onClick={() => onDownload?.(resource.slug)}
          className="btn-primary-talkie text-sm flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Download
        </button>
      </div>
    </div>
  );
};

export default ResourceCard;
