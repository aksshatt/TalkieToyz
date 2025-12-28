# 🔗 TalkieToys Test Links - Complete Guide

## ✅ Test Data Created

- **Assessments:** 3
- **Assessment Results:** 1
- **Milestones:** 24
- **Progress Logs:** 3
- **Blog Posts:** 6
- **Resources:** 13
- **Newsletter Subscriptions:** 3

---

## 🌐 Frontend Server
**URL:** http://localhost:5174/

## 🔐 Test Credentials

```
Admin:     admin@talkietoys.com / password123
Therapist: therapist@example.com / password123
Parent:    parent@example.com / password123
```

---

## 📋 ASSESSMENT FEATURES

### 1. View All Assessments
**URL:** http://localhost:5174/assessments

**What to test:**
- See 3 assessment cards
- Age ranges displayed correctly
- Question counts shown
- Click on any card to start

### 2. Take Assessments (Try all 3!)

**Assessment 1 - Toddlers (12-24 months)**
**URL:** http://localhost:5174/assessments/speech-development-12-24-months

Test flow:
- Enter child name: "Emma"
- Enter age: 18 months
- Answer 10 questions (yes/no, multiple choice, scale)
- Submit and see results

**Assessment 2 - Preschoolers (3-5 years)**
**URL:** http://localhost:5174/assessments/language-skills-3-5-years

Test flow:
- Enter child name: "Liam"
- Enter age: 48 months (4 years)
- Answer 12 questions
- View personalized recommendations

**Assessment 3 - School Age (5-8 years)**
**URL:** http://localhost:5174/assessments/articulation-5-8-years

Test flow:
- Enter child name: "Sophia"
- Enter age: 72 months (6 years)
- Answer 12 articulation questions
- Get speech therapy recommendations

### 3. View Assessment Results
**URL:** http://localhost:5174/assessment/results/1

**What to test:**
- Score breakdown by category
- Total score and level (on track/needs attention)
- Product recommendations
- Tips for parents
- Print/export functionality (if implemented)

---

## 🎯 MILESTONE FEATURES

### 1. Browse All Milestones
**URL:** http://localhost:5174/milestones

**What to test:**
- See 24 milestone cards
- Age ranges displayed (0-96 months)
- Different categories visible

### 2. Filter by Category
Same URL, use filter buttons:
- **Expressive Language** (8 milestones)
- **Receptive Language** (4 milestones)
- **Social Communication** (3 milestones)
- **Articulation** (3 milestones)
- **Fluency** (2 milestones)
- **Voice** (1 milestone)

**What to test:**
- Click category filter buttons
- Milestones update instantly
- Can clear filters
- Indicators and tips display correctly

### 3. Sample Milestones to Check

- **First Words (10-14 months)**
  - Category: Expressive Language
  - Should show indicators and tips

- **Two-Word Combinations (18-24 months)**
  - Category: Expressive Language
  - Critical milestone marker

- **Clear Speech to Strangers (48-60 months)**
  - Category: Articulation
  - Shows developmental progress

---

## 📊 PROGRESS TRACKING (Login Required)

**⚠️ Login first:** http://localhost:5174/login
**Credentials:** parent@example.com / password123

### 1. Progress Dashboard
**URL:** http://localhost:5174/progress

**What to test:**
- View progress chart (3 existing logs)
- Summary statistics
- List of progress entries
- Export PDF button

**Existing test data:**
- 3 progress logs for "Emma"
- Ages 18, 19, 20 months
- Expressive language category
- Word count metrics: 25, 35, 45 words
- Clarity: 60%, 65%, 70%

### 2. View Single Progress Log
**URL:** http://localhost:5174/progress/log/1

**What to test:**
- Child details display
- Metrics shown correctly
- Achievements list
- Notes readable
- Edit and Delete buttons

### 3. Create New Progress Log
**URL:** http://localhost:5174/progress/log/new

**What to test:**
- Fill in form:
  - Child name: "Emma"
  - Age: 21 months
  - Date: today
  - Category: expressive_language
  - Notes: "Emma said her first 3-word sentence!"
  - Metrics: {"word_count": 50, "clarity_percentage": 75}
  - Achievements: ["First 3-word sentence", "Asking 'what' questions"]
- Save and redirect to dashboard
- New log appears in list

### 4. Edit Progress Log
**URL:** http://localhost:5174/progress/log/1/edit

**What to test:**
- Form pre-filled with existing data
- Update notes or metrics
- Save changes
- Redirect to updated log

### 5. Export Progress Report (PDF)
**URL:** http://localhost:5174/progress (click Export PDF button)

**What to test:**
- Generates PDF report
- Includes child name
- Shows progress chart
- Lists all metrics and achievements
- Downloads automatically

---

## 📝 BLOG FEATURES

### 1. Blog List Page
**URL:** http://localhost:5174/blog

**What to test:**
- See all 6 blog posts
- Featured posts highlighted
- Newsletter signup form on sidebar
- Post excerpts and metadata visible
- Reading time estimates shown

### 2. Read Individual Blog Posts

**Post 1 - Therapy Tips** ⭐ Featured
**URL:** http://localhost:5174/blog/10-speech-therapy-exercises-at-home

Content: 10 practical exercises parents can do at home
Comments: 2 approved comments
Test:
- Read full HTML content
- View comments
- Try social share buttons
- Add new comment (if logged in)

**Post 2 - Product Guide** ⭐ Featured
**URL:** http://localhost:5174/blog/choosing-speech-therapy-toys-guide

Content: Buying guide organized by age
Test:
- Rich formatting (headings, lists, bold)
- Product recommendations
- No comments yet

**Post 3 - Milestones**
**URL:** http://localhost:5174/blog/speech-milestones-birth-to-five

Content: Complete milestone guide
Most viewed: 312 views
Test:
- Extensive content (10-minute read)
- Age-by-age breakdown
- Red flags section
- 1 comment

**Post 4 - Parent Resources**
**URL:** http://localhost:5174/blog/screen-time-and-speech-development

Content: Screen time research and guidelines
Test:
- Scientific content
- AAP recommendations
- Practical tips

**Post 5 - Success Story** 🔥 Most Popular
**URL:** http://localhost:5174/blog/emmas-speech-development-journey

Content: Inspiring parent testimonial
428 views, 2 comments
Test:
- Personal storytelling
- Emotional engagement
- Lots of comments

**Post 6 - Therapy Tips**
**URL:** http://localhost:5174/blog/picky-eating-speech-development-connection

Content: Oral motor skills and feeding
Test:
- Clinical information
- Practical strategies
- Related to products

### 3. Social Sharing
Test on any blog post:
- Facebook share button
- Instagram share button
- Twitter share button
- Copy link button

### 4. Newsletter Subscription
Test on blog list page:
- Enter email: test@example.com
- Enter name: "Test User"
- Submit form
- See success message
- Check confirmation email (if email configured)

### 5. Add Blog Comment (Login Required)
Login first, then:
- Go to any blog post
- Scroll to comments section
- Fill in comment form
- Submit comment
- See "awaiting moderation" message

---

## 📚 RESOURCE LIBRARY

### 1. Browse All Resources
**URL:** http://localhost:5174/resources

**What to test:**
- See all 13 resources
- 4 category tabs
- Download counts visible
- Resource type icons

### 2. Filter by Category

**Worksheets (3 resources)**
- Articulation Practice: /R/ Sound (342 downloads)
- Following Directions Worksheets (567 downloads) ⭐ Most popular in category
- Vocabulary: Seasonal Words (423 downloads)

**Parent Guides (3 resources)**
- Complete Guide to Late Talkers (1,234 downloads) 🔥 Most popular overall!
- Stuttering in Young Children (456 downloads)
- Bilingual Language Development (789 downloads)

**Checklists (3 resources)**
- Development Checklist Birth-5 (2,345 downloads) 🏆 Highest downloads!
- Articulation Sounds Checklist (987 downloads)
- Pre-Reading Skills Checklist (1,123 downloads)

**Activity Ideas (4 resources)**
- 50 Activities with Household Items (1,876 downloads)
- Seasonal Speech Activities (1,432 downloads)
- Car Ride Language Games (2,109 downloads)
- Mealtime Language Strategies (1,654 downloads)

### 3. Download Resource
Click any resource:
- Download button appears
- Clicking increments download count
- File download starts (note: actual files not included in seed data)

### 4. View Resource Details
Each resource shows:
- Title and description
- Resource type (PDF, worksheet, guide, etc.)
- File size and page count
- Download count
- Tags

---

## 👨‍💼 ADMIN FEATURES

**⚠️ Login as admin first:** http://localhost:5174/login
**Credentials:** admin@talkietoys.com / password123

### 1. Admin Dashboard
**URL:** http://localhost:5174/admin

**What to test:**
- Overview of all admin sections
- Quick stats
- Navigation to different admin areas

### 2. Blog Management
**URL:** http://localhost:5174/admin/blog

**What to test:**
- Table of all 6 blog posts
- View status (published/draft)
- View/edit/delete buttons
- Create new post button

### 3. Create New Blog Post
**URL:** http://localhost:5174/admin/blog/new

**What to test:**
1. Fill in blog post form:
   - Title: "Test Blog Post"
   - Excerpt: "This is a test post"
   - Category: therapy_tips
   - Featured image URL
   - Tags: ["test", "demo"]
   - Status: published

2. Use Tiptap Editor:
   - Add headings (H2, H3)
   - Bold and italic text
   - Create bullet lists
   - Create numbered lists
   - Add blockquotes
   - Insert links
   - Insert images (URL)
   - Undo/redo functionality

3. Save and publish
4. View new post on blog list

### 4. Edit Existing Blog Post
**URL:** http://localhost:5174/admin/blog/edit/10-speech-therapy-exercises-at-home

**What to test:**
- Form pre-filled with content
- Tiptap editor shows rich content
- Update title, content, or tags
- Save changes
- View updated post

### 5. Delete Blog Post
From blog management page:
- Click delete on a test post
- Confirm deletion
- Post removed from list

### 6. Moderate Comments
**URL:** http://localhost:5174/admin/blog (future feature)

Expected functionality:
- See pending comments
- Approve or reject
- Edit comment text

### 7. Resource Management
**URL:** http://localhost:5174/admin/resources

**What to test:**
- Table of all 13 resources
- Download counts visible
- Edit/delete buttons
- Create new resource button

### 8. Create New Resource
**URL:** http://localhost:5174/admin/resources/new

**What to test:**
1. Fill in form:
   - Title: "Test Resource"
   - Category: select from dropdown (Worksheets, Guides, etc.)
   - Description: "This is a test resource"
   - Resource type: PDF
   - Tags: ["test"]
   - File upload (if implemented)

2. Save resource
3. View in resources list

### 9. Edit Resource
**URL:** http://localhost:5174/admin/resources/edit/articulation-r-sound-worksheets

**What to test:**
- Form pre-filled
- Update title or description
- Change category
- Save changes

### 10. Delete Resource
From resource management:
- Delete test resource
- Confirm deletion
- Resource removed

---

## 🧪 API TESTING (Optional)

If you want to test the backend API directly:

### Assessments API
```bash
# Get all assessments
curl http://localhost:3000/api/v1/assessments

# Get specific assessment
curl http://localhost:3000/api/v1/assessments/speech-development-12-24-months

# Get assessment questions
curl http://localhost:3000/api/v1/assessments/speech-development-12-24-months | json_pp
```

### Milestones API
```bash
# Get all milestones
curl http://localhost:3000/api/v1/milestones

# Filter by category
curl "http://localhost:3000/api/v1/milestones?category=expressive_language"

# Filter by age (18 months)
curl "http://localhost:3000/api/v1/milestones?age=18"
```

### Blog API
```bash
# Get all blog posts
curl http://localhost:3000/api/v1/blog_posts

# Get specific post
curl http://localhost:3000/api/v1/blog_posts/10-speech-therapy-exercises-at-home

# Filter by category
curl "http://localhost:3000/api/v1/blog_posts?category=therapy_tips"

# Search posts
curl "http://localhost:3000/api/v1/blog_posts?search=therapy"
```

### Resources API
```bash
# Get all resources
curl http://localhost:3000/api/v1/resources

# Get categories
curl http://localhost:3000/api/v1/resource_categories

# Download resource (increments count)
curl http://localhost:3000/api/v1/resources/articulation-r-sound-worksheets/download
```

### Progress API (Requires Auth Token)
```bash
# Get user's progress logs
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/v1/progress_logs

# Get progress summary
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/v1/progress_logs/summary
```

---

## 📱 Mobile Testing

Test on mobile devices or browser DevTools mobile view:
- http://localhost:5174/assessments
- http://localhost:5174/blog
- http://localhost:5174/resources
- http://localhost:5174/milestones

Check:
- Responsive layouts
- Touch targets
- Mobile navigation
- Form inputs on mobile

---

## ✅ Testing Checklist

### Public Features (No Login)
- [ ] View assessments list
- [ ] Take all 3 assessments
- [ ] View assessment results
- [ ] Browse 24 milestones
- [ ] Filter milestones by category
- [ ] Read 6 blog posts
- [ ] Test social sharing
- [ ] Subscribe to newsletter
- [ ] Browse 13 resources
- [ ] Filter resources by 4 categories
- [ ] Test download functionality

### Protected Features (Login as parent@example.com)
- [ ] View progress dashboard
- [ ] See progress chart with 3 logs
- [ ] View individual progress log
- [ ] Create new progress log
- [ ] Edit existing progress log
- [ ] Delete progress log
- [ ] Export progress PDF
- [ ] Add comment to blog post

### Admin Features (Login as admin@talkietoys.com)
- [ ] View blog management table
- [ ] Create new blog post with Tiptap
- [ ] Edit existing blog post
- [ ] Delete blog post
- [ ] View resource management table
- [ ] Create new resource
- [ ] Edit existing resource
- [ ] Delete resource

---

## 🐛 Common Issues & Solutions

**Issue:** 404 Not Found
- **Solution:** Verify both servers are running (backend :3000, frontend :5174)

**Issue:** Blank page
- **Solution:** Check browser console for errors, verify API is responding

**Issue:** Can't login
- **Solution:** Use exact credentials: admin@talkietoys.com / password123

**Issue:** No data showing
- **Solution:** Run `rails db:seed` again

**Issue:** Tiptap editor not loading
- **Solution:** Run `npm install` in frontend directory

---

## 🎉 Happy Testing!

Start with the simplest features first:
1. **Blog:** http://localhost:5174/blog (easiest to test)
2. **Resources:** http://localhost:5174/resources
3. **Milestones:** http://localhost:5174/milestones
4. **Assessments:** http://localhost:5174/assessments
5. **Progress:** http://localhost:5174/progress (requires login)
6. **Admin:** http://localhost:5174/admin (requires admin login)

Report any bugs or issues you find!
