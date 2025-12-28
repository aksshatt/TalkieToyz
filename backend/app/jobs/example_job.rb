class ExampleJob < ApplicationJob
  queue_as :default

  # Example job
  # Usage: ExampleJob.perform_later(arg1, arg2)
  # Usage: ExampleJob.perform_now(arg1, arg2)

  def perform(*args)
    # Job logic here
    Rails.logger.info "ExampleJob executed with args: #{args}"
  end
end
