# frozen_string_literal: true

puts '🌱 Seeding database...'

# Clear existing data (optional - comment out in production)
puts '🗑️  Clearing existing data...'
Review.destroy_all
OrderItem.destroy_all
Order.destroy_all
CartItem.destroy_all
Cart.destroy_all
ProductSpeechGoal.destroy_all
Product.destroy_all
Address.destroy_all
User.where.not(email: 'admin@talkietoys.com').destroy_all
Category.destroy_all
SpeechGoal.destroy_all

# Create Categories
puts '📁 Creating categories...'
categories = [
  {
    name: 'Articulation Toys',
    slug: 'articulation-toys',
    description: 'Toys designed to help children practice correct pronunciation and sound production',
    position: 1,
    active: true
  },
  {
    name: 'Language Development',
    slug: 'language-development',
    description: 'Interactive toys that encourage vocabulary building and language comprehension',
    position: 2,
    active: true
  },
  {
    name: 'Social Communication',
    slug: 'social-communication',
    description: 'Games and activities that promote social skills and conversational abilities',
    position: 3,
    active: true
  },
  {
    name: 'Fluency Tools',
    slug: 'fluency-tools',
    description: 'Resources to support children working on speech fluency and rhythm',
    position: 4,
    active: true
  },
  {
    name: 'Oral Motor Skills',
    slug: 'oral-motor-skills',
    description: 'Toys that strengthen mouth and tongue muscles for better speech production',
    position: 5,
    active: true
  },
  {
    name: 'Sensory Integration',
    slug: 'sensory-integration',
    description: 'Sensory-friendly toys that support speech development through multi-sensory experiences',
    position: 6,
    active: true
  }
]

categories.each do |cat_attrs|
  Category.create!(cat_attrs)
  puts "  ✓ Created category: #{cat_attrs[:name]}"
end

# Create Speech Goals
puts '🎯 Creating speech goals...'
speech_goals = [
  {
    name: 'Attention & Concentration',
    slug: 'attention-concentration',
    description: 'Developing focus and sustained attention skills',
    color: '#3B82F6',
    icon: 'focus',
    active: true
  },
  {
    name: 'Language & Vocabulary',
    slug: 'language-vocabulary',
    description: 'Building language skills and expanding vocabulary',
    color: '#10B981',
    icon: 'book-open',
    active: true
  },
  {
    name: 'Fine Motor Skills',
    slug: 'fine-motor-skills',
    description: 'Developing small muscle control and hand-eye coordination',
    color: '#F59E0B',
    icon: 'hand',
    active: true
  },
  {
    name: 'Cognitive Skills',
    slug: 'cognitive-skills',
    description: 'Enhancing thinking, learning, and problem-solving abilities',
    color: '#8B5CF6',
    icon: 'brain',
    active: true
  },
  {
    name: 'Social Interaction',
    slug: 'social-interaction',
    description: 'Promoting social engagement and peer interaction',
    color: '#EC4899',
    icon: 'users',
    active: true
  },
  {
    name: 'Emotional Development',
    slug: 'emotional-development',
    description: 'Supporting emotional awareness and regulation',
    color: '#6366F1',
    icon: 'heart',
    active: true
  },
  {
    name: 'Listening Skills',
    slug: 'listening-skills',
    description: 'Improving auditory attention and comprehension',
    color: '#14B8A6',
    icon: 'ear',
    active: true
  },
  {
    name: 'Gross Motor Skills',
    slug: 'gross-motor-skills',
    description: 'Building large muscle movement and coordination',
    color: '#EF4444',
    icon: 'activity',
    active: true
  },
  {
    name: 'Sensory Processing',
    slug: 'sensory-processing',
    description: 'Developing sensory integration and awareness',
    color: '#06B6D4',
    icon: 'zap',
    active: true
  },
  {
    name: 'Daily Living Skills',
    slug: 'daily-living-skills',
    description: 'Learning practical skills for everyday activities',
    color: '#84CC16',
    icon: 'home',
    active: true
  }
]

speech_goals.each do |goal_attrs|
  SpeechGoal.create!(goal_attrs)
  puts "  ✓ Created speech goal: #{goal_attrs[:name]}"
end

# Create Admin User
puts '👤 Creating admin user...'
admin = User.find_or_create_by!(email: 'admin@talkietoys.com') do |user|
  user.name = 'Admin User'
  user.password = 'password123'
  user.password_confirmation = 'password123'
  user.role = :admin
  user.phone = '+1234567890'
end
puts "  ✓ Created admin user: #{admin.email}"

# Create Sample Therapist User
puts '👨‍⚕️ Creating therapist user...'
therapist = User.find_or_create_by!(email: 'therapist@example.com') do |user|
  user.name = 'Sarah Johnson'
  user.password = 'password123'
  user.password_confirmation = 'password123'
  user.role = :therapist
  user.phone = '+1987654321'
  user.bio = 'Speech-Language Pathologist with 10 years of experience'
end
puts "  ✓ Created therapist user: #{therapist.email}"

# Create Sample Customer Users
puts '👥 Creating customer users...'
customer1 = User.find_or_create_by!(email: 'parent@example.com') do |user|
  user.name = 'John Smith'
  user.password = 'password123'
  user.password_confirmation = 'password123'
  user.role = :customer
  user.phone = '+1555123456'
end
puts "  ✓ Created customer user: #{customer1.email}"

customer2 = User.find_or_create_by!(email: 'parent2@example.com') do |user|
  user.name = 'Emily Davis'
  user.password = 'password123'
  user.password_confirmation = 'password123'
  user.role = :customer
  user.phone = '+1555654321'
end
puts "  ✓ Created customer user: #{customer2.email}"

# Create Sample Products
puts '🧸 Creating sample products...'

articulation_category = Category.find_by(slug: 'articulation-toys')
language_category = Category.find_by(slug: 'language-development')
social_category = Category.find_by(slug: 'social-communication')
oral_motor_category = Category.find_by(slug: 'oral-motor-skills')

products_data = [
  {
    name: 'Sound Sorting Game',
    description: 'Interactive card game for practicing initial and final sounds',
    long_description: 'This engaging card game helps children practice identifying and producing sounds in different word positions. Includes 50 colorful cards with pictures representing common words.',
    price: 29.99,
    compare_at_price: 39.99,
    stock_quantity: 50,
    category: articulation_category,
    min_age: 4,
    max_age: 8,
    featured: true,
    speech_goals: ['Language & Vocabulary', 'Listening Skills'],
    specifications: {
      'Number of Cards' => '50',
      'Material' => 'Laminated cardstock',
      'Dimensions' => '3.5" x 2.5" per card',
      'Storage' => 'Includes storage box'
    }
  },
  {
    name: 'Vocabulary Builder Flashcards',
    description: 'Comprehensive flashcard set with 200 common nouns and verbs',
    long_description: 'Build vocabulary with this extensive flashcard collection featuring vivid photographs and clear labels. Perfect for home practice or therapy sessions.',
    price: 24.99,
    stock_quantity: 100,
    category: language_category,
    min_age: 3,
    max_age: 10,
    featured: true,
    speech_goals: ['Language & Vocabulary', 'Cognitive Skills'],
    specifications: {
      'Number of Cards' => '200',
      'Material' => 'Durable cardstock',
      'Categories' => 'Nouns, Verbs, Adjectives',
      'Double-sided' => 'Yes'
    }
  },
  {
    name: 'Conversation Starter Board Game',
    description: 'Fun board game that encourages turn-taking and conversation',
    long_description: 'This exciting board game promotes social communication skills through engaging conversation prompts and turn-taking activities. Suitable for groups of 2-4 players.',
    price: 34.99,
    compare_at_price: 44.99,
    stock_quantity: 30,
    category: social_category,
    min_age: 6,
    max_age: 12,
    featured: false,
    speech_goals: ['Social Interaction', 'Attention & Concentration'],
    specifications: {
      'Players' => '2-4',
      'Game Duration' => '20-30 minutes',
      'Components' => 'Game board, cards, tokens, dice',
      'Skill Level' => 'Beginner to Intermediate'
    }
  },
  {
    name: 'Chewy Tubes Set',
    description: 'Oral motor therapy tools in various textures',
    long_description: 'Professional-grade chewy tubes designed to improve oral motor strength and coordination. Set includes 3 different textures for progressive therapy.',
    price: 19.99,
    stock_quantity: 75,
    category: oral_motor_category,
    min_age: 2,
    max_age: 99,
    featured: false,
    speech_goals: ['Fine Motor Skills'],
    specifications: {
      'Set Includes' => '3 tubes (soft, medium, hard)',
      'Material' => 'Medical-grade silicone',
      'BPA Free' => 'Yes',
      'Dishwasher Safe' => 'Yes',
      'Colors' => 'Red, Blue, Green'
    }
  },
  {
    name: 'Sequencing Story Cards',
    description: '4-step picture sequences for narrative skills',
    long_description: 'Help children develop sequencing and storytelling skills with these colorful picture card sets. Each set contains multiple 4-picture sequences showing everyday activities.',
    price: 27.99,
    stock_quantity: 40,
    category: language_category,
    min_age: 4,
    max_age: 9,
    featured: false,
    speech_goals: ['Cognitive Skills', 'Attention & Concentration', 'Language & Vocabulary'],
    specifications: {
      'Number of Sequences' => '15',
      'Cards per Sequence' => '4',
      'Total Cards' => '60',
      'Material' => 'Laminated',
      'Size' => '4" x 4"'
    }
  }
]

products_data.each do |product_data|
  speech_goal_names = product_data.delete(:speech_goals)
  product = Product.create!(product_data.except(:speech_goals))

  # Associate speech goals
  speech_goal_names.each do |goal_name|
    goal = SpeechGoal.find_by(name: goal_name)
    product.speech_goals << goal if goal
  end

  puts "  ✓ Created product: #{product.name}"
end

# Create Sample Addresses
puts '📍 Creating sample addresses...'
Address.create!([
  {
    user: customer1,
    label: 'Home',
    full_name: 'John Smith',
    phone: '+1555123456',
    address_line_1: '123 Main Street',
    city: 'Springfield',
    state_province: 'IL',
    postal_code: '62701',
    country: 'US',
    is_default: true,
    is_shipping: true,
    is_billing: true
  },
  {
    user: customer2,
    label: 'Home',
    full_name: 'Emily Davis',
    phone: '+1555654321',
    address_line_1: '456 Oak Avenue',
    address_line_2: 'Apt 2B',
    city: 'Portland',
    state_province: 'OR',
    postal_code: '97201',
    country: 'US',
    is_default: true,
    is_shipping: true
  }
])
puts "  ✓ Created #{Address.count} addresses"

# Load additional seed files
puts '📚 Loading assessment and content seed data...'
load Rails.root.join('db', 'seeds', 'assessments_seed.rb')
load Rails.root.join('db', 'seeds', 'milestones_seed.rb')
load Rails.root.join('db', 'seeds', 'blog_posts_seed.rb')
load Rails.root.join('db', 'seeds', 'resources_seed.rb')
load Rails.root.join('db', 'seeds', 'site_content_seed.rb')

puts '✅ Database seeded successfully!'
puts ''
puts '📊 Summary:'
puts "  Categories: #{Category.count}"
puts "  Speech Goals: #{SpeechGoal.count}"
puts "  Products: #{Product.count}"
puts "  Users: #{User.count}"
puts "  Addresses: #{Address.count}"
puts "  Assessments: #{Assessment.count}"
puts "  Milestones: #{Milestone.count}"
puts "  Blog Posts: #{BlogPost.count}"
puts "  Resource Categories: #{ResourceCategory.count}"
puts "  Resources: #{Resource.count}"
puts "  Site Contents: #{SiteContent.count}"
puts ''
puts '🔐 Test Credentials:'
puts '  Admin: admin@talkietoys.com / password123'
puts '  Therapist: therapist@example.com / password123'
puts '  Customer: parent@example.com / password123'
