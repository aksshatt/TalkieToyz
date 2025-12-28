#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting TalkieToys Development Environment${NC}"
echo ""

# Check if Redis is running
if ! pgrep -x "redis-server" > /dev/null; then
    echo -e "${YELLOW}⚠️  Redis is not running. Starting Redis...${NC}"
    redis-server --daemonize yes
    sleep 1
fi

# Check if PostgreSQL is running
if ! pgrep -x "postgres" > /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL is not running. Please start PostgreSQL first.${NC}"
    echo -e "${YELLOW}   On macOS: brew services start postgresql${NC}"
    echo -e "${YELLOW}   On Linux: sudo systemctl start postgresql${NC}"
    exit 1
fi

# Function to cleanup background processes
cleanup() {
    echo -e "\n${RED}🛑 Stopping all services...${NC}"
    kill $(jobs -p) 2>/dev/null
    exit
}

# Trap SIGINT (Ctrl+C) and call cleanup
trap cleanup SIGINT

# Start Backend
echo -e "${BLUE}📦 Starting Backend (Rails)...${NC}"
cd backend
bundle exec rails server &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to initialize
sleep 3

# Start Frontend
echo -e "${BLUE}⚛️  Starting Frontend (React + Vite)...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Start Sidekiq (optional - uncomment if needed)
# echo -e "${BLUE}🔄 Starting Sidekiq...${NC}"
# cd backend
# bundle exec sidekiq &
# SIDEKIQ_PID=$!
# cd ..

echo ""
echo -e "${GREEN}✅ All services started!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🌐 Frontend: ${NC}http://localhost:5173"
echo -e "${BLUE}🔌 Backend:  ${NC}http://localhost:3000"
echo -e "${BLUE}💊 Health:   ${NC}http://localhost:3000/health"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Wait for all background processes
wait
