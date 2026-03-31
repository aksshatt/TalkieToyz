# Local Testing Guide - CORS Fix

## Quick Check: Is Your Backend Running?

1. **Check if backend is running:**
   ```bash
   curl http://localhost:3000/health
   ```
   Should return: `{"status":"ok"}`

2. **Check CORS headers:**
   ```bash
   curl -H "Origin: http://localhost:5173" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        http://localhost:3000/api/v1/auth/login \
        -v
   ```
   Look for `Access-Control-Allow-Origin: http://localhost:5173` in the response headers.

## Step-by-Step Local Setup

### 1. Start Backend (Terminal 1)
```bash
cd backend
bundle exec rails server
```

You should see:
```
=> Booting Puma
=> Rails 7.1.6 application starting in development
=> Run `bin/rails server --help` for more startup options
Puma starting in single mode...
* Listening on http://127.0.0.1:3000
```

### 2. Verify Frontend is Using Local Backend

Check your `frontend/.env` or `frontend/.env.local` file:
```env
VITE_API_URL=http://localhost:3000/api/v1
```

**If this file doesn't exist or has production URL, create it:**
```bash
cd frontend
echo "VITE_API_URL=http://localhost:3000/api/v1" > .env.local
```

### 3. Restart Frontend (Terminal 2)
```bash
cd frontend
# Stop the current dev server (Ctrl+C if running)
npm run dev
```

**Important:** After changing `.env` files, you MUST restart the Vite dev server!

### 4. Test CORS

Open browser console and check:
- No CORS errors in console
- Network tab shows requests to `http://localhost:3000/api/v1/...`
- Response headers include `Access-Control-Allow-Origin: http://localhost:5173`

## Troubleshooting

### Issue: Still seeing CORS errors

**Solution 1: Restart Backend**
```bash
# Stop backend (Ctrl+C)
cd backend
bundle exec rails server
```

**Solution 2: Check Rails Environment**
Make sure backend is running in development mode:
```bash
cd backend
echo $RAILS_ENV  # Should be empty or "development"
rails server     # This runs in development by default
```

**Solution 3: Verify CORS Gem is Installed**
```bash
cd backend
bundle list | grep rack-cors
# Should show: rack-cors (3.0.0)
```

**Solution 4: Check CORS Initializer is Loaded**
```bash
cd backend
rails runner "puts Rails.application.config.middleware.to_a.grep(/Cors/)"
# Should show: Rack::Cors
```

### Issue: Frontend still connecting to production

**Check:**
1. Frontend `.env.local` has correct URL
2. Restarted Vite dev server after changing `.env`
3. Browser cache cleared (hard refresh: Ctrl+Shift+R)

### Issue: Backend not starting

**Check:**
1. PostgreSQL is running:
   ```bash
   # macOS
   brew services list | grep postgresql
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Database exists:
   ```bash
   cd backend
   rails db:create
   rails db:migrate
   ```

3. Dependencies installed:
   ```bash
   cd backend
   bundle install
   ```

## Quick Test Commands

### Test Backend Health
```bash
curl http://localhost:3000/health
```

### Test CORS Preflight
```bash
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:3000/api/v1/auth/login \
     -i
```

Look for these headers in response:
- `Access-Control-Allow-Origin: http://localhost:5173`
- `Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD`
- `Access-Control-Allow-Credentials: true`

### Test Login Endpoint
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -H "Origin: http://localhost:5173" \
     -d '{"user":{"email":"test@example.com","password":"password"}}' \
     -i
```

## Expected Behavior

✅ **Working:**
- No CORS errors in browser console
- API requests succeed
- Response headers include CORS headers
- Login works without network errors

❌ **Not Working:**
- CORS errors in console
- "Network Error" messages
- 401/403 errors (different from CORS)
- Requests going to production URL instead of localhost

## Still Having Issues?

1. **Check backend logs** for CORS middleware:
   ```bash
   # In backend terminal, look for:
   # Started OPTIONS "/api/v1/auth/login" for 127.0.0.1
   ```

2. **Check frontend network tab:**
   - Request URL should be `http://localhost:3000/api/v1/...`
   - Response should have CORS headers

3. **Verify both services are running:**
   - Backend: http://localhost:3000/health
   - Frontend: http://localhost:5173
