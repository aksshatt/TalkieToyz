# TalkieToys - Speech Therapy Toys E-commerce Platform

## 🎯 Project Overview
An e-commerce platform for speech therapy toys with features designed for parents and speech therapists.

## 🏗️ Architecture
- **Backend**: Ruby on Rails 7+ API (PostgreSQL, Redis, Sidekiq)
- **Frontend**: React 18+ with TypeScript (Vite, TailwindCSS)

## 📁 Project Structure
```
talkietoys/
├── backend/              # Rails API
├── frontend/             # React App
├── docker-compose.yml
└── docs/
```

## 🚀 Quick Start

### Prerequisites
- Ruby 3.2+
- Node.js 18+
- PostgreSQL 15+
- Redis 7+

### Complete Setup

```bash
# Option 1: Using Make
make setup

# Option 2: Using NPM
npm run setup

# Option 3: Manual setup
cd backend && bundle install && rails db:create db:migrate db:seed
cd frontend && npm install
```

## 🎮 Running the Application

### Method 1: Single Command (Recommended) 🌟

**Using NPM (runs both FE + BE in one terminal):**
```bash
# First time: install concurrently
npm install

# Run both frontend and backend
npm run dev

# Run frontend + backend + sidekiq
npm run dev:all
```

**Using Bash Script:**
```bash
./dev.sh
```

**Using Make:**
```bash
make dev
```

### Method 2: Docker (All Services) 🐳

```bash
# Start all services (backend, frontend, postgres, redis, sidekiq)
docker-compose up

# Or rebuild and start
make docker-build
```

### Method 3: Separate Terminals

**Terminal 1 - Backend:**
```bash
cd backend
rails server
# Runs on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

**Terminal 3 - Sidekiq (Optional):**
```bash
cd backend
bundle exec sidekiq
```

## 🌐 Access URLs

After starting the services:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **API Endpoints**: http://localhost:3000/api/v1/*

## 📚 Documentation
See `/docs` folder for detailed documentation.

## 🛠️ Available Commands

### Using Make
```bash
make help           # Show all available commands
make install        # Install all dependencies
make setup          # Complete setup (install + DB)
make dev            # Run frontend + backend
make dev-all        # Run frontend + backend + sidekiq
make docker-up      # Start with Docker
make docker-down    # Stop Docker services
make clean          # Clean temporary files
make test-backend   # Run backend tests
make lint-backend   # Run backend linter
make db-migrate     # Run migrations
make db-reset       # Reset database
```

### Using NPM
```bash
npm run dev              # Run frontend + backend
npm run dev:all          # Run frontend + backend + sidekiq
npm run dev:backend      # Run only backend
npm run dev:frontend     # Run only frontend
npm run dev:sidekiq      # Run only sidekiq
npm run install:all      # Install all dependencies
npm run setup            # Complete setup
npm run docker:up        # Start Docker services
npm run docker:down      # Stop Docker services
```

## 🧪 Testing
```bash
# Backend
make test-backend
# or
cd backend && bundle exec rspec

# Frontend
cd frontend && npm run test
```

## 🎨 Code Quality
```bash
# Backend (RuboCop)
make lint-backend
# or
cd backend && bundle exec rubocop

# Frontend (ESLint)
cd frontend && npm run lint
```

## 📦 Deployment
See deployment documentation in `/docs/deployment.md`

## 🐛 Troubleshooting

**Services not starting?**
- Make sure PostgreSQL is running: `brew services start postgresql` (macOS) or `sudo systemctl start postgresql` (Linux)
- Make sure Redis is running: `redis-server`
- Check if ports 3000 and 5173 are available

**Database issues?**
```bash
make db-reset
# or
cd backend && rails db:drop db:create db:migrate db:seed
```
