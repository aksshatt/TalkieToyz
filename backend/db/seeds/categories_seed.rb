# Categories Seed Data (idempotent)
puts "Creating categories..."

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
  puts "  Category: #{parent.name}"

  subs.each do |sub_attrs|
    Category.find_or_create_by!(slug: sub_attrs[:slug]) do |c|
      c.assign_attributes(sub_attrs.merge(active: true, parent_id: parent.id))
    end
    puts "    Subcategory: #{sub_attrs[:name]}"
  end
end

puts "Categories: #{Category.count}"
