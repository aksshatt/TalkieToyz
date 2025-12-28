class ApplicationService
  # Base service class for business logic
  # All services should inherit from this class
  #
  # Example usage:
  # class CreateToy < ApplicationService
  #   def initialize(params)
  #     @params = params
  #   end
  #
  #   def call
  #     # Service logic here
  #   end
  # end
  #
  # Call with: CreateToy.call(params)

  def self.call(*args, &block)
    new(*args, &block).call
  end
end
