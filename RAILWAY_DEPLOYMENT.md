# 🚂 Railway Deployment Guide (100% FREE)

## Prerequisites
- GitHub account (free)
- Railway account (free)
- Your code pushed to GitHub

## Step 1: Setup Railway Account
1. Go to: https://railway.app
2. Click "Start a New Project"
3. Sign in with GitHub (free)
4. ✅ You get $5/month free credit (renewable)

## Step 2: Deploy Backend (Rails API)

### A. Create New Project
1. Click "+ New Project"
2. Select "Deploy from GitHub repo"
3. Select your `talkietoys/backend` folder
4. Railway auto-detects it's a Rails app

### B. Add PostgreSQL Database
1. Click "+ New" → "Database" → "Add PostgreSQL"
2. Railway creates FREE database automatically
3. Database URL is auto-set in environment variables

### C. Configure Environment Variables
Click on your Rails service → "Variables" tab:

```bash
# Rails Configuration
RAILS_ENV=production
RAILS_SERVE_STATIC_FILES=true
RAILS_LOG_TO_STDOUT=true
SECRET_KEY_BASE=<generate using: rails secret>

# Database (automatically set by Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Frontend URL (add after deploying frontend)
FRONTEND_URL=https://your-frontend.vercel.app

# JWT Secret
DEVISE_JWT_SECRET_KEY=<generate using: rails secret>

# Communication
WHATSAPP_NUMBER=919876543210
CONTACT_EMAIL=support@talkietoys.com

# Gmail SMTP (FREE)
SMTP_ADDRESS=smtp.gmail.com
SMTP_PORT=587
SMTP_DOMAIN=gmail.com
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
DEFAULT_EMAIL_FROM=TalkieToys <noreply@talkietoys.com>

# Razorpay (Test Mode - FREE)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret
```

### D. Set Custom Domain (Optional)
1. Go to "Settings" → "Domains"
2. Click "Generate Domain" for free subdomain
   - Example: `talkietoys-api.up.railway.app`
3. Or add custom domain: `api.yourdomain.com`
   - Add CNAME record in your domain DNS

### E. Deploy!
1. Push code to GitHub
2. Railway auto-deploys
3. Run migrations: Click "Deploy" → "Console" → Run:
   ```bash
   rails db:migrate
   rails db:seed
   ```

## Step 3: Deploy Frontend (React)

### Option A: Vercel (Recommended for React)

1. Go to: https://vercel.com
2. Sign in with GitHub
3. Click "Add New Project"
4. Select your repository
5. Configure:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```

6. Add Environment Variables:
   ```bash
   VITE_API_URL=https://your-backend.up.railway.app/api/v1
   VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
   VITE_WHATSAPP_NUMBER=919876543210
   VITE_TAWK_TO_PROPERTY_ID=your_property_id
   VITE_TAWK_TO_WIDGET_ID=your_widget_id
   ```

7. Click "Deploy"
8. Your app is live at: `your-app.vercel.app`

### Option B: Netlify (Alternative)

1. Go to: https://netlify.com
2. Sign in with GitHub
3. "Add new site" → "Import from Git"
4. Configure:
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

5. Add environment variables (same as above)
6. Deploy!

## Step 4: Connect Custom Domain

### On Vercel (Frontend):
1. Go to Project Settings → Domains
2. Add your domain: `www.yourdomain.com`
3. Add DNS records (Vercel provides):
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### On Railway (Backend):
1. Settings → Domains
2. Add custom domain: `api.yourdomain.com`
3. Add CNAME record:
   ```
   Type: CNAME
   Name: api
   Value: your-app.up.railway.app
   ```

## Step 5: Update CORS

Update `backend/config/initializers/cors.rb`:
```ruby
origins ENV.fetch('FRONTEND_URL', 'http://localhost:5173').split(',')
```

## 💰 Cost Breakdown

| Service | Cost |
|---------|------|
| Railway (Backend + DB) | **₹0** ($5 free/month) |
| Vercel (Frontend) | **₹0** (100% free) |
| PostgreSQL Database | **₹0** (included) |
| SSL Certificate | **₹0** (auto-included) |
| Custom Domain | **₹99/year** (.in domain) |
| **TOTAL** | **₹99/year** = **₹8/month** |

## 🎯 What You Get (FREE):

✅ Rails API backend
✅ React frontend
✅ PostgreSQL database
✅ Automatic deployments
✅ Free SSL (HTTPS)
✅ 500GB bandwidth
✅ Email delivery (Gmail SMTP)
✅ Payment gateway (Razorpay test)
✅ Live chat (Tawk.to)
✅ WhatsApp integration

## 📊 Free Tier Limits:

**Railway:**
- $5/month credit (≈ ₹415)
- 500GB bandwidth
- Unlimited requests
- Good for 10,000+ visitors/month

**Vercel:**
- 100GB bandwidth/month
- Unlimited websites
- Automatic scaling
- Good for 100,000+ page views

## 🔄 Deployment Workflow:

1. Make changes locally
2. Test on localhost
3. `git add .`
4. `git commit -m "your changes"`
5. `git push origin main`
6. ✨ Railway + Vercel auto-deploy!
7. Live in 2-3 minutes

## 🆘 Troubleshooting:

### If deployment fails:
1. Check Railway logs: Click on service → "Logs"
2. Check build command succeeded
3. Verify all environment variables are set
4. Check database migrations ran

### Common issues:
- **Assets not loading**: Add `RAILS_SERVE_STATIC_FILES=true`
- **CORS errors**: Update FRONTEND_URL in Railway
- **Database error**: Check DATABASE_URL is set
- **502 Error**: App might be sleeping (Railway free tier)

## 📚 Useful Commands:

### Railway CLI:
```bash
# Install
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up

# View logs
railway logs

# Run console
railway run rails console
```

## ✅ Checklist:

- [ ] GitHub repository created
- [ ] Railway account setup
- [ ] PostgreSQL database added
- [ ] Environment variables configured
- [ ] Backend deployed on Railway
- [ ] Frontend deployed on Vercel
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Database migrated and seeded
- [ ] Test all features work

---

**Total Time**: 30-45 minutes
**Total Cost**: ₹0 - ₹99/year (domain only)

🎉 Your app is now live and FREE!
