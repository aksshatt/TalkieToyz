# TalkieToys - Quick Setup Guide

## 🚀 Quick Start (Development)

### 1. Clone & Install
```bash
# Clone repository
git clone <your-repo-url>
cd talkietoys

# Backend setup
cd backend
bundle install
cp .env.example .env

# Frontend setup
cd ../frontend
npm install
cp .env.example .env
```

### 2. Environment Variables Quick Setup

#### Backend (.env) - Minimum Required
```bash
# Database (Local PostgreSQL)
DATABASE_URL=postgresql://talkietoys:password@localhost:5432/talkietoys_development

# JWT Secret (Generate with: bundle exec rails secret)
DEVISE_JWT_SECRET_KEY=<run: bundle exec rails secret>

# Email (Gmail - for development)
SMTP_USERNAME=your.email@gmail.com
SMTP_PASSWORD=<16-char app password from Google>
DEFAULT_EMAIL_FROM=TalkieToys <your.email@gmail.com>

# Razorpay (Test mode)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_test_secret

# Communication
WHATSAPP_NUMBER=919876543210
CONTACT_EMAIL=support@talkietoys.com
```

#### Frontend (.env) - Minimum Required
```bash
# API URL
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_API_URL=http://localhost:3000/api/v1

# Razorpay
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx

# Communication (Optional for now)
VITE_WHATSAPP_NUMBER=919876543210
VITE_TAWK_TO_PROPERTY_ID=your_property_id
VITE_TAWK_TO_WIDGET_ID=your_widget_id
```

### 3. Database Setup
```bash
cd backend

# Create database
rails db:create

# Run migrations
rails db:migrate

# Seed sample data (optional)
rails db:seed
```

### 4. Start Servers
```bash
# Terminal 1 - Backend
cd backend
rails server

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 5. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api/v1

---

## 📝 Third-Party Services Setup (Step-by-Step)

### 1. Razorpay (Payment Gateway)

**Time**: 15 minutes (Test mode) | 2-3 days (Live mode with verification)

**Steps**:
1. Go to https://razorpay.com
2. Click "Sign Up" → Enter business details
3. Verify email and phone
4. Go to Settings → API Keys
5. Click "Generate Test Keys"
6. Copy Key ID and Secret
7. Add to `.env` files (both backend and frontend)

**For Live Mode (Production)**:
1. Complete KYC (PAN, GST, Bank details)
2. Submit business documents
3. Wait for approval (2-3 days)
4. Generate Live Keys
5. Update production `.env` with live keys

**Cost**: 2% per transaction, No setup fee

---

### 2. Gmail SMTP (Email Sending)

**Time**: 5 minutes

**Steps**:
1. Use existing Gmail or create new: noreply.talkietoys@gmail.com
2. Enable 2-Step Verification:
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification
3. Generate App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "TalkieToys App"
   - Copy the 16-character password
4. Add to backend `.env`:
   ```bash
   SMTP_USERNAME=your.email@gmail.com
   SMTP_PASSWORD=abcd efgh ijkl mnop  # 16 chars
   ```

**Limits**: 500 emails/day (free)

**For Production**: Consider SendGrid (see below)

---

### 3. SendGrid (Production Email - Optional)

**Time**: 10 minutes

**Steps**:
1. Go to https://sendgrid.com
2. Sign up (Free tier: 100 emails/day)
3. Verify email address
4. Go to Settings → API Keys
5. Click "Create API Key"
6. Name: "TalkieToys Production"
7. Permissions: "Full Access" or "Mail Send"
8. Copy API Key (shown only once!)
9. Update backend `.env`:
   ```bash
   SMTP_ADDRESS=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USERNAME=apikey
   SMTP_PASSWORD=<your-sendgrid-api-key>
   ```

**Cost**:
- Free: 100 emails/day
- Essentials: $19.95/month (50,000 emails)

---

### 4. Tawk.to (Live Chat - Free Forever)

**Time**: 5 minutes

**Steps**:
1. Go to https://www.tawk.to
2. Sign up for free account
3. Click "Add Property" → Enter website name
4. Go to Administration → Channels → Chat Widget
5. Copy the JavaScript code snippet
6. Find these values in the code:
   ```javascript
   var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
   (function(){
   var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
   s1.async=true;
   s1.src='https://embed.tawk.to/<PROPERTY_ID>/<WIDGET_ID>';
   //                                ^^^^^^^^^^^    ^^^^^^^^^
   })();
   ```
7. Add to frontend `.env`:
   ```bash
   VITE_TAWK_TO_PROPERTY_ID=<PROPERTY_ID>
   VITE_TAWK_TO_WIDGET_ID=<WIDGET_ID>
   ```

**Cost**: FREE (Unlimited chats, agents, websites)

---

### 5. AWS S3 (File Storage - Production Only)

**Time**: 15 minutes

**Steps**:
1. Create AWS Account: https://aws.amazon.com
2. Go to IAM → Users → Add User
3. User name: "talkietoys-s3"
4. Access type: "Programmatic access"
5. Permissions: "AmazonS3FullAccess"
6. Save Access Key ID and Secret Key
7. Go to S3 → Create Bucket
8. Bucket name: "talkietoys-production"
9. Region: "ap-south-1" (Mumbai)
10. Uncheck "Block all public access" (for product images)
11. Add to backend `.env`:
    ```bash
    AWS_ACCESS_KEY_ID=AKIA...
    AWS_SECRET_ACCESS_KEY=...
    AWS_REGION=ap-south-1
    AWS_BUCKET=talkietoys-production
    ```

**Cost**:
- Free tier: 5GB storage, 20,000 GET requests/month
- After: ~₹150-500/month for small app

---

### 6. PostgreSQL (Database)

**Ubuntu/Debian**:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres psql

# In PostgreSQL shell:
CREATE USER talkietoys WITH PASSWORD 'your_secure_password';
CREATE DATABASE talkietoys_development OWNER talkietoys;
\q
```

**macOS**:
```bash
brew install postgresql
brew services start postgresql
createuser -s talkietoys
createdb talkietoys_development -O talkietoys
```

**Windows**:
1. Download from: https://www.postgresql.org/download/windows/
2. Run installer
3. Use pgAdmin to create user and database

---

### 7. Redis (Caching - Optional for Development)

**Ubuntu/Debian**:
```bash
sudo apt install redis-server
sudo systemctl start redis-server
redis-cli ping  # Should return "PONG"
```

**macOS**:
```bash
brew install redis
brew services start redis
redis-cli ping  # Should return "PONG"
```

---

## 🔑 Environment Variables Checklist

### ✅ Must Have (Development)
- [ ] DATABASE_URL
- [ ] DEVISE_JWT_SECRET_KEY
- [ ] SMTP_USERNAME & SMTP_PASSWORD
- [ ] RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET (Test mode)
- [ ] VITE_API_BASE_URL
- [ ] VITE_RAZORPAY_KEY_ID

### 📋 Good to Have (Development)
- [ ] WHATSAPP_NUMBER
- [ ] CONTACT_EMAIL
- [ ] TAWK_TO_PROPERTY_ID & WIDGET_ID

### 🚀 Must Have (Production)
- [ ] All Development variables
- [ ] AWS S3 credentials
- [ ] FRONTEND_URL (your domain)
- [ ] REDIS_URL
- [ ] Production Razorpay keys (Live mode)
- [ ] Production email service (SendGrid/Mailgun)

---

## 🧪 Testing the Setup

### 1. Test Backend
```bash
cd backend
rails console

# Test database
User.count

# Test email (won't send, just validates config)
ContactMailer.user_confirmation(1).deliver_now
```

### 2. Test Frontend
```bash
cd frontend
npm run build  # Should complete without errors
```

### 3. Test API
```bash
# Get products
curl http://localhost:3000/api/v1/products

# Should return JSON with products
```

---

## 🐛 Common Issues & Solutions

### Issue: Database connection failed
**Solution**:
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check credentials in .env match database
rails db:setup
```

### Issue: Cannot generate JWT token
**Solution**:
```bash
# Generate new secret
bundle exec rails secret

# Copy to DEVISE_JWT_SECRET_KEY in .env
# Restart server
```

### Issue: Email not sending
**Solution**:
- Verify Gmail App Password is correct (no spaces)
- Check 2-Step Verification is enabled
- Use exact 16-character password from Google

### Issue: Razorpay payment fails
**Solution**:
- Ensure using TEST keys for development
- Check RAZORPAY_KEY_ID in both backend and frontend .env
- Verify test mode is enabled in Razorpay dashboard

### Issue: Images not uploading
**Solution**:
```bash
# Development (local storage)
# No S3 needed, images saved to storage/

# Check Active Storage is configured
rails active_storage:install
rails db:migrate
```

---

## 📚 Quick Commands Reference

```bash
# Backend
rails server                 # Start server
rails console               # Open Rails console
rails db:migrate           # Run migrations
rails db:seed              # Seed database
rails routes               # View all routes
bundle exec rails secret   # Generate secret key

# Frontend
npm run dev                # Start dev server
npm run build             # Build for production
npm run preview           # Preview production build

# Database
rails db:create           # Create database
rails db:drop             # Drop database
rails db:reset            # Drop, create, migrate, seed

# Testing
rails test                # Run backend tests
npm run test              # Run frontend tests
```

---

## 🎯 Next Steps After Setup

1. **Create Admin User**:
   ```ruby
   # In rails console
   User.create!(
     email: 'admin@talkietoys.com',
     password: 'Admin@123',
     password_confirmation: 'Admin@123',
     name: 'Admin User',
     role: 'admin',
     phone: '9876543210'
   )
   ```

2. **Add Sample Products**:
   - Login to admin panel: http://localhost:5173/admin
   - Go to Products → Add Product

3. **Test Checkout Flow**:
   - Add product to cart
   - Proceed to checkout
   - Use Razorpay test cards:
     - Card: 4111 1111 1111 1111
     - CVV: Any 3 digits
     - Expiry: Any future date

4. **Configure Communication**:
   - Set up WhatsApp Business number
   - Configure Tawk.to widget
   - Test contact form

---

## 💡 Pro Tips

1. **Use .env.local for sensitive data** (never commit)
2. **Keep separate .env for production** with different keys
3. **Test in incognito mode** to verify auth flows
4. **Check browser console** for frontend errors
5. **Check rails server logs** for backend errors
6. **Use Postman** to test API endpoints
7. **Enable CORS** in development for API testing

---

## 📞 Need Help?

- Check `OPTIMIZATION_GUIDE.md` for performance tips
- Check `PROJECT_SUMMARY.md` for complete feature list
- Rails logs: `tail -f backend/log/development.log`
- Frontend console: Browser Developer Tools (F12)

---

**Setup Time**: ~30-45 minutes (with all services)
**Minimal Setup**: ~15 minutes (database + basic config only)

---

*Last Updated: December 27, 2025*
