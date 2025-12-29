# TalkieToys CMS (Content Management System)

## Overview

This CMS allows you to edit all website content from the admin dashboard without touching code. Every text, image, and section can be managed dynamically.

---

## How It Works

### Database Structure

**Table**: `site_contents`

| Field | Type | Description |
|-------|------|-------------|
| `key` | string | Unique identifier (e.g., 'about_title') |
| `page` | string | Page name (e.g., 'about', 'home') |
| `content_type` | string | Type of content (text, textarea, html, image, url, json) |
| `value` | text | The actual content |
| `label` | string | Human-readable label for admin UI |
| `description` | text | Help text for editors |
| `active` | boolean | Whether content is published |
| `display_order` | integer | Order for display |
| `metadata` | jsonb | Additional data |

---

## Content Types

| Type | Use For | Example |
|------|---------|---------|
| `text` | Short text (headings, titles) | "About Us" |
| `textarea` | Long text (paragraphs) | "Our mission is..." |
| `html` | Rich formatted text | `<p>Welcome to <strong>TalkieToys</strong></p>` |
| `image` | Image URLs/paths | "/images/founder.jpg" |
| `url` | Links | "https://example.com" |
| `json` | Structured data (lists, objects) | `{"items": ["a", "b"]}` |

---

## Pages Currently Supported

- `home` - Homepage
- `about` - About Us page
- `contact` - Contact page
- `faq` - FAQ page
- `header` - Header/Navigation
- `footer` - Footer content

---

## Implementation Guide

### Step 1: Define Content Keys

For each page, define all editable content:

**Example - About Page**:
```ruby
# backend/db/seeds/site_content_seed.rb

# About Page Content
SiteContent.find_or_create_by!(page: 'about', key: 'hero_title') do |content|
  content.content_type = 'text'
  content.value = 'About Us'
  content.label = 'Hero Title'
  content.description = 'Main heading on About page'
  content.display_order = 1
end

SiteContent.find_or_create_by!(page: 'about', key: 'founder_name') do |content|
  content.content_type = 'text'
  content.value = 'Swekchaa Tamrakar'
  content.label = 'Founder Name'
  content.display_order = 2
end

SiteContent.find_or_create_by!(page: 'about', key: 'founder_bio_1') do |content|
  content.content_type = 'textarea'
  content.value = "I'm Swekchaa Tamrakar, a speech and hearing professional..."
  content.label = 'Founder Bio - Paragraph 1'
  content.display_order = 3
end

SiteContent.find_or_create_by!(page: 'about', key: 'founder_image') do |content|
  content.content_type = 'image'
  content.value = '/swekchaa-tamrakar.jpg'
  content.label = 'Founder Photo'
  content.description = 'Upload founder photo (recommended: 600x800px)'
  content.display_order = 4
end
```

### Step 2: Create API Endpoints

**Public API** (`app/controllers/api/v1/site_contents_controller.rb`):
```ruby
module Api
  module V1
    class SiteContentsController < BaseController
      # GET /api/v1/site_contents/:page
      def show
        @contents = SiteContent.active.by_page(params[:page]).ordered

        render_success(
          ActiveModelSerializers::SerializableResource.new(
            @contents,
            each_serializer: SiteContentSerializer
          ).as_json,
          'Content retrieved successfully'
        )
      end

      # GET /api/v1/site_contents/:page/keys
      def keys
        contents = SiteContent.get_page_contents(params[:page])
        render_success(contents, 'Content retrieved successfully')
      end
    end
  end
end
```

**Admin API** (`app/controllers/api/v1/admin/site_contents_controller.rb`):
```ruby
module Api
  module V1
    module Admin
      class SiteContentsController < BaseController
        # Full CRUD operations
        # index, show, create, update, destroy
      end
    end
  end
end
```

### Step 3: Create Frontend Service

**File**: `frontend/src/services/siteContentService.ts`

```typescript
import api from '../config/axios';

export interface SiteContent {
  id: number;
  key: string;
  page: string;
  content_type: string;
  value: string;
  label: string;
  description: string;
  active: boolean;
  display_order: number;
}

export const siteContentService = {
  // Get all content for a page
  getPageContent: async (page: string) => {
    const response = await api.get(`/site_contents/${page}`);
    return response.data;
  },

  // Get content as key-value pairs
  getPageContentKeys: async (page: string) => {
    const response = await api.get(`/site_contents/${page}/keys`);
    return response.data;
  },

  // Admin: Get all content
  getAllContent: async () => {
    const response = await api.get('/admin/site_contents');
    return response.data;
  },

  // Admin: Update content
  updateContent: async (id: number, data: Partial<SiteContent>) => {
    const response = await api.patch(`/admin/site_contents/${id}`, { site_content: data });
    return response.data;
  },

  // Admin: Create content
  createContent: async (data: Partial<SiteContent>) => {
    const response = await api.post('/admin/site_contents', { site_content: data });
    return response.data;
  },

  // Admin: Delete content
  deleteContent: async (id: number) => {
    const response = await api.delete(`/admin/site_contents/${id}`);
    return response.data;
  }
};
```

### Step 4: Update Frontend Page

**Before** (hardcoded):
```typescript
<h1>About Us</h1>
<p>I'm Swekchaa Tamrakar...</p>
```

**After** (dynamic):
```typescript
import { useEffect, useState } from 'react';
import { siteContentService } from '../services/siteContentService';

const About = () => {
  const [content, setContent] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await siteContentService.getPageContentKeys('about');
      if (response.success) {
        setContent(response.data);
      }
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <Layout>
      <h1>{content.hero_title || 'About Us'}</h1>
      <h2>{content.founder_name || 'Swekchaa Tamrakar'}</h2>
      <img src={content.founder_image || '/default.jpg'} alt="Founder" />
      <p>{content.founder_bio_1 || 'Loading...'}</p>
      <p>{content.founder_bio_2 || ''}</p>
    </Layout>
  );
};
```

### Step 5: Create Admin UI

**File**: `frontend/src/pages/admin/ContentManagement.tsx`

```typescript
import { useState, useEffect } from 'react';
import { siteContentService, SiteContent } from '../../services/siteContentService';

const ContentManagement = () => {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [selectedPage, setSelectedPage] = useState('about');
  const [editingContent, setEditingContent] = useState<SiteContent | null>(null);

  const handleUpdate = async (id: number, value: string) => {
    try {
      await siteContentService.updateContent(id, { value });
      toast.success('Content updated successfully');
      loadContents();
    } catch (error) {
      toast.error('Failed to update content');
    }
  };

  return (
    <div className="p-6">
      <h1>Content Management</h1>

      {/* Page selector */}
      <select value={selectedPage} onChange={(e) => setSelectedPage(e.target.value)}>
        <option value="home">Home</option>
        <option value="about">About</option>
        <option value="contact">Contact</option>
        <option value="faq">FAQ</option>
      </select>

      {/* Content editor */}
      <div className="grid gap-4">
        {contents.map((content) => (
          <div key={content.id} className="card-talkie">
            <label className="font-bold">{content.label}</label>
            <p className="text-sm text-gray-600">{content.description}</p>

            {content.content_type === 'textarea' ? (
              <textarea
                value={content.value}
                onChange={(e) => handleUpdate(content.id, e.target.value)}
                className="input-talkie"
                rows={5}
              />
            ) : (
              <input
                type="text"
                value={content.value}
                onChange={(e) => handleUpdate(content.id, e.target.value)}
                className="input-talkie"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## Adding a New Editable Page

### Example: Making Home Page Editable

**1. Define Content Keys** (`db/seeds/site_content_seed.rb`):
```ruby
# Hero Section
SiteContent.create!(
  page: 'home',
  key: 'hero_title',
  content_type: 'text',
  value: 'Where Fun Meets Learning!',
  label: 'Hero Title',
  display_order: 1
)

SiteContent.create!(
  page: 'home',
  key: 'hero_subtitle',
  content_type: 'textarea',
  value: 'Quality educational toys for children aged 2-8',
  label: 'Hero Subtitle',
  display_order: 2
)

# Features Section
SiteContent.create!(
  page: 'home',
  key: 'features_list',
  content_type: 'json',
  value: JSON.generate([
    { title: 'Speech Development', description: 'Toys designed for speech therapy' },
    { title: 'Expert Curated', description: 'Selected by professionals' }
  ]),
  label: 'Features List',
  display_order: 3
)
```

**2. Run Seeds**:
```bash
rails db:seed
```

**3. Update Frontend**:
```typescript
// Fetch and use dynamic content
const [content, setContent] = useState({});

useEffect(() => {
  siteContentService.getPageContentKeys('home').then(setContent);
}, []);

return (
  <h1>{content.hero_title}</h1>
  <p>{content.hero_subtitle}</p>
);
```

---

## Content Management Workflow

### For Editors (Admin Users):

1. **Login to Admin Dashboard**
2. **Go to "Content Management"**
3. **Select Page** (About, Home, Contact, etc.)
4. **Edit Content**:
   - Click on any field
   - Make changes
   - Auto-saves on blur
5. **Preview Changes** (if preview mode enabled)
6. **Publish** (toggle active status)

### For Developers:

1. **Define new content keys** in seed file
2. **Run `rails db:seed`**
3. **Update frontend** to use dynamic content
4. **Deploy changes**

---

## Best Practices

### 1. Content Keys Naming
- Use snake_case
- Be descriptive
- Include section name
- Examples:
  - `about_hero_title`
  - `home_features_title`
  - `footer_copyright_text`

### 2. Labels & Descriptions
- **Label**: Clear, short (e.g., "Hero Title")
- **Description**: Help text for editors (e.g., "Main heading, max 60 characters")

### 3. Default Values
- Always provide fallback values in frontend
- Example: `{content.title || 'Default Title'}`

### 4. Image Handling
- Store path/URL in value field
- Use metadata for alt text, caption
- Example:
  ```json
  {
    "value": "/images/founder.jpg",
    "metadata": {
      "alt": "Swekchaa Tamrakar",
      "caption": "Founder of Talkie Toyz"
    }
  }
  ```

### 5. Structured Content (JSON)
- Use for lists, objects, complex data
- Example - Mission cards:
  ```json
  [
    {
      "icon": "target",
      "title": "Our Mission",
      "description": "To bridge the gap..."
    },
    {
      "icon": "heart",
      "title": "Our Values",
      "description": "Clinical expertise..."
    }
  ]
  ```

---

## Implementation Status

### ✅ Completed
- [x] Database migration
- [x] SiteContent model
- [x] Model validations & scopes

### 🚧 In Progress (Need to Complete)
- [ ] Serializer
- [ ] Public API controller
- [ ] Admin API controller
- [ ] Routes
- [ ] Seed data for About page
- [ ] Frontend service
- [ ] Update About page to use CMS
- [ ] Admin UI for content management
- [ ] Add to admin navigation

### 📋 Future Enhancements
- [ ] Rich text editor (TipTap/Quill)
- [ ] Image upload directly from admin
- [ ] Version history (content revisions)
- [ ] Multi-language support
- [ ] Content scheduling (publish at specific time)
- [ ] Preview mode (see changes before publishing)
- [ ] Bulk import/export
- [ ] Content templates

---

## Quick Start (Implementation)

To complete the CMS system:

1. **Create remaining files** (see Implementation Guide)
2. **Run migrations**: `rails db:migrate`
3. **Create seed data**: `rails db:seed`
4. **Test API**: Visit `/api/v1/site_contents/about`
5. **Update frontend pages** to use dynamic content
6. **Create admin UI** for content management

---

## Example: Complete About Page CMS

See `ABOUT_PAGE_CMS_EXAMPLE.md` for a complete, working example of making the About page fully editable.

---

**Note**: This is a powerful system. Once implemented, non-technical users can edit all website content without developer assistance!
