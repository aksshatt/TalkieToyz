# 🚀 Quick Start Guide - TalkieToys

## Ek Command Se Dono Chalao! ⚡

### Sabse Aasan Tarika (Single Terminal)

#### Option 1: NPM Use Karo (Recommended)
```bash
# Pehli baar: Install karo
npm install

# Frontend aur Backend dono ek saath chalao
npm run dev
```

#### Option 2: Bash Script Use Karo
```bash
# Script ko run karo
./dev.sh
```

#### Option 3: Make Use Karo
```bash
# Ek command se sab kuch
make dev
```

### Sidekiq Bhi Chahiye? (Background Jobs)
```bash
# Teeno ek saath (Frontend + Backend + Sidekiq)
npm run dev:all
```

### Docker Se Sab Kuch (Fully Isolated)
```bash
# Sab services ek saath start (Postgres, Redis, Backend, Frontend, Sidekiq)
docker-compose up
```

---

## 📋 Complete Setup (Pehli Baar)

### 1. Dependencies Install Karo
```bash
# Option 1: Make se
make setup

# Option 2: NPM se
npm run setup

# Option 3: Manual
cd backend && bundle install && rails db:create db:migrate db:seed
cd ../frontend && npm install
```

### 2. Environment Variables Set Karo
```bash
# Backend ke liye
cd backend
cp .env.example .env
# Ab .env file me apne values dalo

cd ..
```

### 3. Services Check Karo
```bash
# PostgreSQL running hai?
# macOS:
brew services start postgresql

# Linux:
sudo systemctl start postgresql

# Redis running hai?
redis-server --daemonize yes
```

### 4. Ab Chalao!
```bash
# Ek hi command se dono chalao
npm run dev
```

---

## 🌐 URLs (Jab Services Chal Rahe Ho)

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

---

## 🛑 Band Karne Ke Liye

**NPM/Script use kiya?**
- Press `Ctrl + C` terminal me

**Docker use kiya?**
```bash
docker-compose down
# ya
make docker-down
```

---

## 🔧 Common Commands

```bash
# Dono chalao (Frontend + Backend)
npm run dev

# Sirf Backend
npm run dev:backend

# Sirf Frontend
npm run dev:frontend

# Sirf Sidekiq
npm run dev:sidekiq

# Database reset
make db-reset

# Tests run karo
make test-backend

# Code lint karo
make lint-backend
```

---

## ⚡ Pro Tips

1. **Pehli baar setup kar rahe ho?**
   ```bash
   make setup && npm run dev
   ```

2. **Database me problem hai?**
   ```bash
   make db-reset
   ```

3. **Clean start chahiye?**
   ```bash
   make clean && npm run dev
   ```

4. **Production jaise environment chahiye?**
   ```bash
   docker-compose up --build
   ```

---

## 🐛 Problems?

**Port already in use?**
- Koi aur service 3000 ya 5173 port pe chal rahi hai
- Band karo ya port change karo

**Database connect nahi ho rahi?**
- PostgreSQL running check karo
- `.env` file me `DATABASE_URL` check karo

**Redis error aa rahi hai?**
- Redis start karo: `redis-server`

**Gems install nahi ho rahe?**
```bash
cd backend
bundle install
```

**NPM packages install nahi ho rahe?**
```bash
cd frontend
rm -rf node_modules
npm install
```

---

## 📞 Help Chahiye?

1. Check README.md for detailed docs
2. Check backend/README.md for backend specific info
3. Run `make help` to see all available commands

Happy Coding! 🎉
