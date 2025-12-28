# TalkieToys Backend API

Rails 7 API backend for TalkieToys application.

## Ruby Version

- Ruby 3.2.8
- Rails 7.1.6

## System Dependencies

- PostgreSQL 12+
- Redis 6+
- ImageMagick (for image processing)

## Setup

1. Install dependencies:
```bash
bundle install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your local configuration

4. Setup database:
```bash
rails db:create
rails db:migrate
rails db:seed
```

## Running the Application

### Development Server
```bash
rails server
```

The API will be available at `http://localhost:3000`

### Sidekiq (Background Jobs)
```bash
bundle exec sidekiq
```

### Redis
```bash
redis-server
```

## API Structure

### Versioning
All API endpoints are versioned under `/api/v1` namespace.

Example: `GET /api/v1/toys`

### Authentication
Uses Devise with JWT for authentication.

### Response Format
All responses follow a consistent JSON structure:

**Success:**
```json
{
  "success": true,
  "message": "Optional message",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["List of errors"]
}
```

## Directory Structure

```
app/
├── controllers/
│   ├── application_controller.rb  # Base controller with error handling
│   ├── health_controller.rb       # Health check endpoint
│   └── api/
│       └── v1/
│           └── base_controller.rb # Base API controller
├── jobs/                           # Background jobs (Sidekiq)
├── models/                         # ActiveRecord models
├── policies/                       # Pundit authorization policies
├── serializers/                    # ActiveModel serializers
└── services/                       # Business logic services
```

## Key Features

### Error Handling
ApplicationController includes comprehensive error handling:
- `ActiveRecord::RecordNotFound` → 404
- `ActiveRecord::RecordInvalid` → 422
- `Pundit::NotAuthorizedError` → 403
- `ActionController::ParameterMissing` → 400

### Health Check
Endpoint: `GET /health`

Returns:
```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00Z",
  "services": {
    "database": { "status": "ok" },
    "redis": { "status": "ok" }
  }
}
```

### ActiveStorage
Configured for image uploads:
- **Development:** Local disk storage
- **Production:** Amazon S3

### Background Jobs
Sidekiq configured with queues:
- `default` - General background jobs
- `mailers` - Email sending
- `active_storage_analysis` - Image processing
- `active_storage_purge` - File cleanup

### CORS
Configured for:
- **Development:** localhost:5173, localhost:3000
- **Production:** Environment-based domains + talkietoys.com

## Code Quality

### RuboCop
Run linter:
```bash
rubocop
```

Auto-fix issues:
```bash
rubocop -A
```

## Testing

Run test suite:
```bash
rspec
```

## Architecture Patterns

### Services
Business logic should be extracted into service objects:

```ruby
class CreateToy < ApplicationService
  def initialize(params)
    @params = params
  end

  def call
    # Logic here
  end
end

# Usage
CreateToy.call(params)
```

### Policies
Authorization using Pundit:

```ruby
class ToyPolicy < ApplicationPolicy
  def update?
    user.admin? || record.user == user
  end
end

# Usage in controller
authorize @toy
```

### Serializers
JSON serialization using ActiveModel::Serializers:

```ruby
class ToySerializer < ApplicationSerializer
  attributes :id, :name, :description
  belongs_to :category
end
```

## Environment Variables

See `.env.example` for all required environment variables.

Key variables:
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_URL` - Redis connection
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` - S3 credentials
- `FRONTEND_URL` - CORS configuration
- `DEVISE_JWT_SECRET_KEY` - JWT secret

## Deployment

The application is containerized with Docker. See `Dockerfile` and `docker-compose.yml` in the root directory.

## API Documentation

API documentation will be available at `/api-docs` (to be implemented with Swagger/OpenAPI).
