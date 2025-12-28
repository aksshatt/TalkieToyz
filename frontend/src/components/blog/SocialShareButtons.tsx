import { Facebook, Instagram, Twitter, Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';

interface SocialShareButtonsProps {
  url: string;
  title: string;
}

const SocialShareButtons = ({ url, title }: SocialShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-semibold text-warmgray-700">Share:</span>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-warmgray-100 rounded-full hover:bg-[#1877F2] hover:text-white transition-all"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-5 w-5" />
      </a>

      <a
        href={`https://www.instagram.com/`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-warmgray-100 rounded-full hover:bg-gradient-to-r hover:from-[#833AB4] hover:via-[#E1306C] hover:to-[#F56040] hover:text-white transition-all"
        aria-label="Share on Instagram"
      >
        <Instagram className="h-5 w-5" />
      </a>

      <a
        href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-warmgray-100 rounded-full hover:bg-[#1DA1F2] hover:text-white transition-all"
        aria-label="Share on Twitter"
      >
        <Twitter className="h-5 w-5" />
      </a>

      <button
        onClick={handleCopyLink}
        className="p-2 bg-warmgray-100 rounded-full hover:bg-teal hover:text-white transition-all relative"
        aria-label="Copy link"
      >
        <LinkIcon className="h-5 w-5" />
        {copied && (
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-warmgray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Copied!
          </span>
        )}
      </button>
    </div>
  );
};

export default SocialShareButtons;
