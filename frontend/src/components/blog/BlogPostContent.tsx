interface BlogPostContentProps {
  content: string;
}

const BlogPostContent = ({ content }: BlogPostContentProps) => {
  return (
    <div
      className="prose prose-lg max-w-none
        prose-headings:font-[var(--font-family-fun)] prose-headings:text-warmgray-900
        prose-p:text-warmgray-700 prose-p:leading-relaxed
        prose-a:text-teal prose-a:no-underline hover:prose-a:underline
        prose-strong:text-warmgray-900 prose-strong:font-bold
        prose-ul:list-disc prose-ul:pl-6
        prose-ol:list-decimal prose-ol:pl-6
        prose-li:text-warmgray-700
        prose-img:rounded-lg prose-img:shadow-soft
        prose-blockquote:border-l-4 prose-blockquote:border-teal prose-blockquote:bg-teal-light/30 prose-blockquote:p-4 prose-blockquote:rounded-r-lg"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default BlogPostContent;
