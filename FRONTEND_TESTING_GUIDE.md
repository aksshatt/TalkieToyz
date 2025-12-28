# Frontend Testing Guide

## Quick Start

1. **Start Backend Server** (in one terminal)
   ```bash
   cd /home/rails/talkietoys/backend
   rails server
   ```
   Backend will run on: http://localhost:3000

2. **Start Frontend Server** (in another terminal)
   ```bash
   cd /home/rails/talkietoys/frontend
   npm run dev
   ```
   Frontend will run on: http://localhost:5173 or :5174

## Test User Credentials

```
Admin: admin@talkietoys.com / password123
Therapist: therapist@example.com / password123
Parent: parent@example.com / password123
```

## Feature URLs

### 📋 Assessments
- **List:** `/assessments`
- **Take Assessment:** `/assessments/speech-development-12-24-months`
- **Results:** `/assessment/results/:id` (after submission)

**Test Flow:**
1. Go to /assessments
2. Click on an assessment
3. Fill in child name and age
4. Answer all questions
5. Submit and view results

### 🎯 Milestones
- **Browse:** `/milestones`

**Test Flow:**
1. Go to /milestones
2. Filter by category
3. View milestone details

### 📊 Progress Tracking (Login Required)
- **Dashboard:** `/progress`
- **New Log:** `/progress/log/new`
- **View Log:** `/progress/log/:id`
- **Edit Log:** `/progress/log/:id/edit`

**Test Flow:**
1. Login as parent@example.com
2. Go to /progress
3. Click "New Progress Log"
4. Fill in details and save
5. View in dashboard
6. Export PDF

### 📝 Blog
- **List:** `/blog`
- **Post:** `/blog/10-speech-therapy-exercises-at-home`

**Test Flow:**
1. Browse blog list
2. Click on a post
3. Read content
4. Try social sharing
5. Add comment (if logged in)
6. Subscribe to newsletter

### 📚 Resources
- **Browse:** `/resources`

**Test Flow:**
1. Go to /resources
2. Filter by category
3. Download a resource

### 👨‍💼 Admin (Login as admin@talkietoys.com)
- **Blog Management:** `/admin/blog`
- **New Post:** `/admin/blog/new`
- **Edit Post:** `/admin/blog/edit/:slug`
- **Resources:** `/admin/resources`
- **New Resource:** `/admin/resources/new`

**Test Flow:**
1. Login as admin
2. Go to /admin/blog
3. Click "New Post"
4. Use Tiptap editor
5. Add formatting (bold, italic, lists, links)
6. Save and publish

## API Testing (Optional)

### Test Assessments API
```bash
# Get all assessments
curl http://localhost:3000/api/v1/assessments

# Get specific assessment
curl http://localhost:3000/api/v1/assessments/speech-development-12-24-months

# Submit assessment (requires auth)
curl -X POST http://localhost:3000/api/v1/assessments/speech-development-12-24-months/submit \
  -H "Content-Type: application/json" \
  -d '{
    "child_name": "Test Child",
    "child_age_months": 18,
    "answers": {
      "q1": "yes",
      "q2": "yes",
      "q3": "6-10"
    }
  }'
```

### Test Milestones API
```bash
# Get all milestones
curl http://localhost:3000/api/v1/milestones

# Filter by category
curl "http://localhost:3000/api/v1/milestones?category=expressive_language"

# Filter by age
curl "http://localhost:3000/api/v1/milestones?age=18"
```

### Test Blog API
```bash
# Get all blog posts
curl http://localhost:3000/api/v1/blog_posts

# Get specific post
curl http://localhost:3000/api/v1/blog_posts/10-speech-therapy-exercises-at-home

# Search posts
curl "http://localhost:3000/api/v1/blog_posts?search=therapy"

# Filter by category
curl "http://localhost:3000/api/v1/blog_posts?category=therapy_tips"
```

### Test Resources API
```bash
# Get all resources
curl http://localhost:3000/api/v1/resources

# Get specific resource
curl http://localhost:3000/api/v1/resources/articulation-r-sound-worksheets

# Get categories
curl http://localhost:3000/api/v1/resource_categories

# Download resource (increments count)
curl http://localhost:3000/api/v1/resources/articulation-r-sound-worksheets/download
```

## Common Issues & Solutions

### Issue: 404 Not Found
**Solution:** Make sure both backend and frontend servers are running

### Issue: CORS Error
**Solution:** Check that backend CORS is configured for http://localhost:5173 and :5174

### Issue: Authentication Required
**Solution:** Login first at `/login` with test credentials

### Issue: Blank Pages
**Solution:**
1. Check browser console for errors
2. Verify API endpoints are returning data
3. Check network tab in DevTools

### Issue: Tiptap Editor Not Working
**Solution:** Make sure @tiptap packages are installed: `npm install`

### Issue: Images Not Loading
**Solution:** This is expected - seed data doesn't include actual image files. Add via admin interface or use placeholder URLs.

## Browser DevTools Tips

1. **Console Tab:** Check for JavaScript errors
2. **Network Tab:** Verify API calls are successful (200 status)
3. **React DevTools:** Inspect component state and props
4. **Redux DevTools:** (if using) Check Redux state

## Performance Testing

1. **Large Data Sets:**
   - Run seeds multiple times to create more data
   - Test pagination and filtering

2. **Rich Text Content:**
   - Create blog posts with lots of formatting
   - Test HTML rendering

3. **Image Uploads:**
   - Upload images via admin interface
   - Test different file sizes

## Next Steps After Testing

1. **Report Bugs:** Note any issues found during testing
2. **UI/UX Feedback:** Suggest improvements
3. **Mobile Testing:** Test on mobile devices
4. **Accessibility:** Test with screen readers
5. **Browser Compatibility:** Test in Chrome, Firefox, Safari

## Quick Reference

| Feature | Public URL | Admin URL | Protected |
|---------|-----------|-----------|-----------|
| Assessments | `/assessments` | - | No |
| Milestones | `/milestones` | - | No |
| Progress | `/progress` | - | Yes (login required) |
| Blog | `/blog` | `/admin/blog` | Partial |
| Resources | `/resources` | `/admin/resources` | No |

---

**Happy Testing! 🎉**
