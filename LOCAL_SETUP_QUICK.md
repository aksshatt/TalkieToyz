# 🚀 Quick Local Setup - Fix CORS Issues

## The Problem
Your frontend is trying to connect to production backend (`https://talkietoyz-production.up.railway.app`) instead of your local backend (`http://localhost:3000`).

## ✅ Solution (3 Steps)

### Step 1: Create `.env.local` file (Already Done!)
I've created `frontend/.env.local` with local backend URL. This file takes precedence over `.env`.

### Step 2: Start Your Local Backend
```bash
cd backend
bundle exec rails server
```

Wait until you see:
```
* Listening on http://127.0.0.1:3000
```

### Step 3: Restart Frontend (IMPORTANT!)
**You MUST restart the frontend after creating/updating `.env` files!**

```bash
# Stop current frontend (Ctrl+C if running)
cd frontend
npm run dev
```

## ✅ Verify It's Working

1. **Check browser console** - No CORS errors
2. **Check Network tab** - Requests should go to `http://localhost:3000/api/v1/...`
3. **Try logging in** - Should work without network errors

## 🔍 Quick Test

Open browser console and check:
```javascript
// Should show localhost URL
console.log(import.meta.env.VITE_API_URL)
// Expected: "http://localhost:3000/api/v1"
```

## 📝 Notes

- `.env.local` is for local development only (not committed to git)
- `.env` is for production/staging (committed to git)
- Vite loads `.env.local` first, then `.env`
- **Always restart Vite dev server after changing env files!**

## 🐛 Still Having Issues?

1. **Backend not running?**
   ```bash
   curl http://localhost:3000/health
   # Should return: {"status":"ok"}
   ```

2. **Frontend still using production URL?**
   - Check `frontend/.env.local` exists
   - Restart frontend dev server
   - Clear browser cache (Ctrl+Shift+R)

3. **CORS errors still appearing?**
   - Make sure backend is running in development mode
   - Check backend logs for CORS middleware
   - Verify `backend/config/initializers/cors.rb` is loaded
