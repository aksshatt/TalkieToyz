#!/bin/sh
set -e

echo "Running database migrations..."
bundle exec rails db:migrate

echo "Checking if categories need reorganization..."
# Only run category reorganization if categories are in old format
# Check if we have the old "Articulation Toys" category or if we have no categories
if bundle exec rails runner "exit(Category.exists?(slug: 'articulation-toys') ? 0 : 1)" 2>/dev/null || \
   bundle exec rails runner "exit(Category.count == 0 ? 0 : 1)" 2>/dev/null; then
  echo "Reorganizing categories with hierarchical structure..."
  bundle exec rake categories:reorganize
else
  echo "Categories already in hierarchical format, skipping reorganization."
fi

echo "Starting Rails server..."
exec "$@"
