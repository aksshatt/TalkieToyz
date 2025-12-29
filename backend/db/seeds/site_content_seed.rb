# Site Content Seeds - About Page
# This seed file creates all editable content for the About page

puts "🌱 Seeding Site Content for About Page..."

# Header Section
SiteContent.find_or_create_by!(page: 'about', key: 'hero_title') do |content|
  content.content_type = 'text'
  content.value = 'About Us'
  content.label = 'Page Hero Title'
  content.description = 'Main title shown at the top of the About page'
  content.display_order = 1
end

SiteContent.find_or_create_by!(page: 'about', key: 'hero_icon') do |content|
  content.content_type = 'text'
  content.value = 'heart'
  content.label = 'Hero Icon'
  content.description = 'Lucide icon name for hero section (e.g., heart, sparkles, target)'
  content.display_order = 2
end

# Main Content Section
SiteContent.find_or_create_by!(page: 'about', key: 'main_heading') do |content|
  content.content_type = 'text'
  content.value = 'Meet the Mind Behind Talkie Toyz'
  content.label = 'Main Section Heading'
  content.description = 'Heading for the founder story section'
  content.display_order = 3
end

# Founder Information
SiteContent.find_or_create_by!(page: 'about', key: 'founder_name') do |content|
  content.content_type = 'text'
  content.value = 'Swekchaa Tamrakar'
  content.label = 'Founder Name'
  content.description = 'Full name of the founder'
  content.display_order = 4
end

SiteContent.find_or_create_by!(page: 'about', key: 'founder_title') do |content|
  content.content_type = 'text'
  content.value = 'Founder & Speech Therapist'
  content.label = 'Founder Professional Title'
  content.description = 'Title/role displayed under founder name'
  content.display_order = 5
end

SiteContent.find_or_create_by!(page: 'about', key: 'founder_image') do |content|
  content.content_type = 'image'
  content.value = '/swekchaa-tamrakar.jpg'
  content.label = 'Founder Photo'
  content.description = 'Path to founder photo (recommended: 400x500px, portrait orientation)'
  content.display_order = 6
  content.metadata = {
    alt: 'Swekchaa Tamrakar - Founder of Talkie Toyz',
    width: 400,
    height: 500
  }
end

# Founder Bio Paragraphs
SiteContent.find_or_create_by!(page: 'about', key: 'founder_bio_1') do |content|
  content.content_type = 'textarea'
  content.value = "I'm Swekchaa Tamrakar, a speech and hearing professional, founder of Talkie Toyz and Madhuram Multi Rehabilitation Centre, and a passionate believer in learning through play. While working closely with children and parents, I saw how the right toys can make a powerful difference in a child's communication journey."
  content.label = 'Founder Bio - Paragraph 1'
  content.description = 'First paragraph of founder bio'
  content.display_order = 7
end

SiteContent.find_or_create_by!(page: 'about', key: 'founder_bio_2') do |content|
  content.content_type = 'textarea'
  content.value = "That's how Talkie Toyz was born—to create toys that don't just entertain, but educate, empower, and encourage communication. Every product is inspired by real therapy needs and designed with love, care, and clinical understanding."
  content.label = 'Founder Bio - Paragraph 2'
  content.description = 'Second paragraph of founder bio'
  content.display_order = 8
end

# Vision Cards (Mission, Values, Promise)
SiteContent.find_or_create_by!(page: 'about', key: 'vision_cards') do |content|
  content.content_type = 'json'
  content.value = JSON.generate([
    {
      icon: 'target',
      title: 'Our Mission',
      description: 'To bridge the gap between therapy and play, making communication development fun and accessible for every child.',
      color: 'teal'
    },
    {
      icon: 'heart',
      title: 'Our Values',
      description: 'Clinical expertise meets creative play. Every toy is thoughtfully designed with therapeutic benefits in mind.',
      color: 'coral'
    },
    {
      icon: 'sparkles',
      title: 'Our Promise',
      description: "Quality toys backed by professional insight, designed to make every child's learning journey joyful and effective.",
      color: 'sunshine'
    }
  ])
  content.label = 'Vision Cards (Mission, Values, Promise)'
  content.description = 'Three vision cards with icon, title, and description. Icons must be valid Lucide icon names.'
  content.display_order = 9
end

# Professional Background Section
SiteContent.find_or_create_by!(page: 'about', key: 'credentials_heading') do |content|
  content.content_type = 'text'
  content.value = 'Professional Background'
  content.label = 'Credentials Section Heading'
  content.description = 'Heading for professional credentials section'
  content.display_order = 10
end

SiteContent.find_or_create_by!(page: 'about', key: 'talkie_toyz_title') do |content|
  content.content_type = 'text'
  content.value = 'Talkie Toyz'
  content.label = 'Talkie Toyz Title'
  content.description = 'Title for Talkie Toyz credential'
  content.display_order = 11
end

SiteContent.find_or_create_by!(page: 'about', key: 'talkie_toyz_description') do |content|
  content.content_type = 'textarea'
  content.value = 'Founder & Creator of therapeutic toys designed specifically for speech and communication development.'
  content.label = 'Talkie Toyz Description'
  content.description = 'Description of Talkie Toyz role'
  content.display_order = 12
end

SiteContent.find_or_create_by!(page: 'about', key: 'madhuram_title') do |content|
  content.content_type = 'text'
  content.value = 'Madhuram Multi Rehabilitation Centre'
  content.label = 'Madhuram Centre Title'
  content.description = 'Title for Madhuram credential'
  content.display_order = 13
end

SiteContent.find_or_create_by!(page: 'about', key: 'madhuram_description') do |content|
  content.content_type = 'textarea'
  content.value = 'Founder & Speech-Hearing Professional providing comprehensive therapy services for children.'
  content.label = 'Madhuram Description'
  content.description = 'Description of Madhuram role'
  content.display_order = 14
end

# Call-to-Action Section
SiteContent.find_or_create_by!(page: 'about', key: 'cta_text') do |content|
  content.content_type = 'text'
  content.value = 'Join us in making communication development fun, effective, and accessible for every child.'
  content.label = 'CTA Text'
  content.description = 'Call-to-action text at the bottom of page'
  content.display_order = 15
end

SiteContent.find_or_create_by!(page: 'about', key: 'cta_button_1_text') do |content|
  content.content_type = 'text'
  content.value = 'Explore Our Toys'
  content.label = 'Primary CTA Button Text'
  content.description = 'Text for primary call-to-action button'
  content.display_order = 16
end

SiteContent.find_or_create_by!(page: 'about', key: 'cta_button_1_link') do |content|
  content.content_type = 'url'
  content.value = '/products'
  content.label = 'Primary CTA Button Link'
  content.description = 'URL for primary button'
  content.display_order = 17
end

SiteContent.find_or_create_by!(page: 'about', key: 'cta_button_2_text') do |content|
  content.content_type = 'text'
  content.value = 'Get in Touch'
  content.label = 'Secondary CTA Button Text'
  content.description = 'Text for secondary call-to-action button'
  content.display_order = 18
end

SiteContent.find_or_create_by!(page: 'about', key: 'cta_button_2_link') do |content|
  content.content_type = 'url'
  content.value = '/contact'
  content.label = 'Secondary CTA Button Link'
  content.description = 'URL for secondary button'
  content.display_order = 19
end

puts "✅ Site Content seeded successfully for About page!"
puts "   Total About page content items: #{SiteContent.by_page('about').count}"
