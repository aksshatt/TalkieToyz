# Shiprocket Configuration
SHIPROCKET_CONFIG = {
  email: ENV.fetch('SHIPROCKET_EMAIL', ''),
  password: ENV.fetch('SHIPROCKET_PASSWORD', ''),
  api_url: ENV.fetch('SHIPROCKET_API_URL', 'https://apiv2.shiprocket.in/v1/external')
}.freeze

# Default shipping dimensions (in cm)
DEFAULT_SHIPPING_DIMENSIONS = {
  length: ENV.fetch('DEFAULT_LENGTH_CM', 10).to_f,
  breadth: ENV.fetch('DEFAULT_BREADTH_CM', 10).to_f,
  height: ENV.fetch('DEFAULT_HEIGHT_CM', 5).to_f
}.freeze

# Default weight (in kg)
DEFAULT_WEIGHT_KG = ENV.fetch('DEFAULT_WEIGHT_KG', 0.5).to_f
