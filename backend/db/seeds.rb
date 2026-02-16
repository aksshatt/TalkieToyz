# frozen_string_literal: true

puts '🌱 Seeding database...'

# Create Categories (Developmental Domains with subcategories)
puts '📁 Creating categories...'

parent_categories = [
  {
    name: 'Physical Domain',
    slug: 'physical-domain',
    description: 'Toys for developing fine and gross motor skills',
    position: 1,
    subcategories: [
      { name: 'Fine Motor Skills', slug: 'fine-motor-skills', description: 'Toys for developing small muscle control and hand-eye coordination', position: 1 },
      { name: 'Gross Motor Skills', slug: 'gross-motor-skills', description: 'Toys for building large muscle movement and coordination', position: 2 },
    ]
  },
  {
    name: 'Cognitive Domain',
    slug: 'cognitive-domain',
    description: 'Toys for enhancing thinking, learning, and problem-solving abilities',
    position: 2,
    subcategories: []
  },
  {
    name: 'Speech and Language Domain',
    slug: 'speech-language-domain',
    description: 'Toys designed to support speech production, language comprehension, and communication skills',
    position: 3,
    subcategories: []
  },
  {
    name: 'Social-Emotional Domain',
    slug: 'social-emotional-domain',
    description: 'Toys that promote social skills, emotional awareness, and interpersonal interactions',
    position: 4,
    subcategories: []
  },
  {
    name: 'Adaptive Domain',
    slug: 'adaptive-domain',
    description: 'Toys that support daily living skills, self-care, and adaptive behavior',
    position: 5,
    subcategories: []
  },
  {
    name: 'Sensory Integration Domain',
    slug: 'sensory-integration-domain',
    description: 'Sensory-focused toys that support development through multi-sensory experiences',
    position: 6,
    subcategories: [
      { name: 'Proprioceptive Toys', slug: 'proprioceptive-toys', description: 'Toys that provide deep pressure and body awareness input', position: 1 },
      { name: 'Vestibular Toys', slug: 'vestibular-toys', description: 'Toys that stimulate balance and movement sense', position: 2 },
      { name: 'Tactile Toys', slug: 'tactile-toys', description: 'Toys with varied textures for touch exploration', position: 3 },
      { name: 'Auditory Toys', slug: 'auditory-toys', description: 'Toys that develop auditory processing and listening skills', position: 4 },
      { name: 'Oral Sensory Toys', slug: 'oral-sensory-toys', description: 'Toys that support oral motor and sensory development', position: 5 },
      { name: 'Visual Toys', slug: 'visual-toys', description: 'Toys that stimulate visual tracking and perception', position: 6 },
      { name: 'Olfactory Toys', slug: 'olfactory-toys', description: 'Toys that engage the sense of smell for sensory development', position: 7 },
    ]
  }
]

parent_categories.each do |cat_attrs|
  subs = cat_attrs.delete(:subcategories)
  parent = Category.find_or_create_by!(slug: cat_attrs[:slug]) do |c|
    c.assign_attributes(cat_attrs.merge(active: true))
  end
  puts "  ✓ Category: #{parent.name}"

  subs.each do |sub_attrs|
    Category.find_or_create_by!(slug: sub_attrs[:slug]) do |c|
      c.assign_attributes(sub_attrs.merge(active: true, parent_id: parent.id))
    end
    puts "    ✓ Subcategory: #{sub_attrs[:name]}"
  end
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
  SpeechGoal.find_or_create_by!(slug: goal_attrs[:slug]) do |g|
    g.assign_attributes(goal_attrs)
  end
  puts "  ✓ Speech goal: #{goal_attrs[:name]}"
end

# Create Admin User
puts '👤 Creating admin user...'
admin_password = ENV.fetch('ADMIN_PASSWORD') { raise 'ADMIN_PASSWORD environment variable is required' }
admin = User.find_or_create_by!(email: 'talkietoyz@gmail.com') do |user|
  user.name = 'Swekchaa'
  user.password = admin_password
  user.password_confirmation = admin_password
  user.role = :admin
end
puts "  ✓ Admin user: #{admin.email}"

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
puts "  Assessments: #{Assessment.count}"
puts "  Milestones: #{Milestone.count}"
puts "  Blog Posts: #{BlogPost.count}"
puts "  Resource Categories: #{ResourceCategory.count}"
puts "  Resources: #{Resource.count}"
puts "  Site Contents: #{SiteContent.count}"
puts ''
puts '🔐 Admin: talkietoyz@gmail.com'
