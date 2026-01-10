namespace :categories do
  desc "Reorganize categories with hierarchical structure"
  task reorganize: :environment do
    # Check if already reorganized (look for hierarchical domains)
    if Category.exists?(slug: 'physical-domain')
      puts "✓ Categories already organized with hierarchical structure"
      return
    end

    # Check if old categories exist
    has_old_categories = Category.exists?(slug: 'articulation-toys')

    if has_old_categories
      puts "Reorganizing categories from old structure..."
      # Clear existing categories (keeping products intact with nullify)
      Category.destroy_all
    elsif Category.count > 0
      puts "⚠ Unknown category structure found, skipping reorganization"
      puts "Run 'rails categories:force_reorganize' to override"
      return
    else
      puts "Creating initial category structure..."
    end

    # Create top-level domains
    physical_domain = Category.create!(
      name: 'Physical Domain',
      slug: 'physical-domain',
      description: 'Toys that develop physical skills and body awareness',
      position: 1,
      active: true
    )

    cognitive_domain = Category.create!(
      name: 'Cognitive Domain',
      slug: 'cognitive-domain',
      description: 'Toys that enhance thinking, learning, and problem-solving skills',
      position: 2,
      active: true
    )

    speech_language_domain = Category.create!(
      name: 'Speech and Language Domain',
      slug: 'speech-language-domain',
      description: 'Toys that promote communication and language development',
      position: 3,
      active: true
    )

    social_emotional_domain = Category.create!(
      name: 'Social-Emotional Domain',
      slug: 'social-emotional-domain',
      description: 'Toys that build emotional intelligence and social skills',
      position: 4,
      active: true
    )

    adaptive_domain = Category.create!(
      name: 'Adaptive Domain',
      slug: 'adaptive-domain',
      description: 'Toys that support daily living and self-care skills',
      position: 5,
      active: true
    )

    sensory_domain = Category.create!(
      name: 'Sensory Integration Domain',
      slug: 'sensory-integration-domain',
      description: 'Toys that stimulate and integrate sensory processing',
      position: 6,
      active: true
    )

    # Create Physical Domain subcategories
    Category.create!(
      name: 'Fine Motor Skills',
      slug: 'fine-motor-skills',
      description: 'Develop precision and control of small muscles',
      parent: physical_domain,
      position: 1,
      active: true
    )

    Category.create!(
      name: 'Gross Motor Skills',
      slug: 'gross-motor-skills',
      description: 'Develop strength, balance, and coordination',
      parent: physical_domain,
      position: 2,
      active: true
    )

    # Create Sensory Integration Domain subcategories
    Category.create!(
      name: 'Proprioceptive Toys',
      slug: 'proprioceptive-toys',
      description: 'Stimulate body awareness and position sense',
      parent: sensory_domain,
      position: 1,
      active: true
    )

    Category.create!(
      name: 'Vestibular Toys',
      slug: 'vestibular-toys',
      description: 'Develop balance and spatial orientation',
      parent: sensory_domain,
      position: 2,
      active: true
    )

    Category.create!(
      name: 'Tactile Toys',
      slug: 'tactile-toys',
      description: 'Explore different textures and touch sensations',
      parent: sensory_domain,
      position: 3,
      active: true
    )

    Category.create!(
      name: 'Auditory Toys',
      slug: 'auditory-toys',
      description: 'Stimulate hearing and sound processing',
      parent: sensory_domain,
      position: 4,
      active: true
    )

    Category.create!(
      name: 'Oral Sensory Toys',
      slug: 'oral-sensory-toys',
      description: 'Support oral motor and sensory exploration',
      parent: sensory_domain,
      position: 5,
      active: true
    )

    Category.create!(
      name: 'Visual Toys',
      slug: 'visual-toys',
      description: 'Stimulate visual processing and perception',
      parent: sensory_domain,
      position: 6,
      active: true
    )

    Category.create!(
      name: 'Olfactory Toys',
      slug: 'olfactory-toys',
      description: 'Explore scents and smell sensations',
      parent: sensory_domain,
      position: 7,
      active: true
    )

    puts "Categories reorganized successfully!"
    puts "Created #{Category.where(parent_id: nil).count} top-level domains"
    puts "Created #{Category.where.not(parent_id: nil).count} subcategories"
  end
end
