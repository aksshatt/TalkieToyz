import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Bold, Italic, List, ListOrdered, Quote, Undo, Redo, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('Link URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border-2 border-warmgray-300 rounded-lg overflow-hidden">
      <div className="bg-warmgray-50 border-b-2 border-warmgray-300 p-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-warmgray-200 ${editor.isActive('bold') ? 'bg-warmgray-200' : ''}`}
        >
          <Bold className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-warmgray-200 ${editor.isActive('italic') ? 'bg-warmgray-200' : ''}`}
        >
          <Italic className="h-4 w-4" />
        </button>

        <div className="w-px bg-warmgray-300" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-warmgray-200 ${editor.isActive('bulletList') ? 'bg-warmgray-200' : ''}`}
        >
          <List className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-warmgray-200 ${editor.isActive('orderedList') ? 'bg-warmgray-200' : ''}`}
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-warmgray-200 ${editor.isActive('blockquote') ? 'bg-warmgray-200' : ''}`}
        >
          <Quote className="h-4 w-4" />
        </button>

        <div className="w-px bg-warmgray-300" />

        <button
          type="button"
          onClick={addLink}
          className={`p-2 rounded hover:bg-warmgray-200 ${editor.isActive('link') ? 'bg-warmgray-200' : ''}`}
        >
          <LinkIcon className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded hover:bg-warmgray-200"
        >
          <ImageIcon className="h-4 w-4" />
        </button>

        <div className="w-px bg-warmgray-300" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 rounded hover:bg-warmgray-200"
        >
          <Undo className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 rounded hover:bg-warmgray-200"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>

      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 min-h-[300px] focus:outline-none"
      />
    </div>
  );
};

export default TiptapEditor;
