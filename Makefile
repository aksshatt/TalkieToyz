.PHONY: help install setup dev dev-all docker-up docker-down docker-build clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install all dependencies (frontend + backend)
	@echo "📦 Installing backend dependencies..."
	cd backend && bundle install
	@echo "📦 Installing frontend dependencies..."
	cd frontend && npm install
	@echo "✅ All dependencies installed!"

setup: install ## Complete setup (install + database setup)
	@echo "🗄️  Setting up database..."
	cd backend && rails db:create db:migrate db:seed
	@echo "✅ Setup complete!"

dev: ## Run frontend and backend (requires npm package)
	npm run dev

dev-all: ## Run frontend, backend, and sidekiq (requires npm package)
	npm run dev:all

dev-script: ## Run frontend and backend using bash script
	chmod +x dev.sh && ./dev.sh

docker-up: ## Start all services with Docker
	docker-compose up

docker-down: ## Stop all Docker services
	docker-compose down

docker-build: ## Build and start all services with Docker
	docker-compose up --build

clean: ## Clean temporary files and logs
	@echo "🧹 Cleaning temporary files..."
	rm -rf backend/tmp/cache/*
	rm -rf backend/log/*.log
	rm -rf frontend/node_modules/.vite
	@echo "✅ Cleanup complete!"

backend: ## Run only backend
	cd backend && bundle exec rails server

frontend: ## Run only frontend
	cd frontend && npm run dev

sidekiq: ## Run only sidekiq
	cd backend && bundle exec sidekiq

test-backend: ## Run backend tests
	cd backend && bundle exec rspec

lint-backend: ## Run backend linter
	cd backend && bundle exec rubocop

lint-frontend: ## Run frontend linter
	cd frontend && npm run lint

db-migrate: ## Run database migrations
	cd backend && rails db:migrate

db-rollback: ## Rollback last migration
	cd backend && rails db:rollback

db-reset: ## Reset database
	cd backend && rails db:drop db:create db:migrate db:seed
