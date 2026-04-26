#!/usr/bin/env bash
# exit on error
set -o errexit

bundle install

# Clear stale advisory lock from prior failed deploy
bundle exec rails runner "ActiveRecord::Base.connection.execute(\"SELECT pg_terminate_backend(pid) FROM pg_locks WHERE locktype='advisory' AND pid <> pg_backend_pid()\")" || true

bundle exec rake db:migrate
bundle exec rake db:reseed_content
