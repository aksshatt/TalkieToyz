# frozen_string_literal: true

puts '🛎️  Seeding services...'

services = [
  {
    slug: 'speech-language-assessment',
    name: 'Speech & Language Assessment',
    description: 'Comprehensive evaluation of speech articulation, language comprehension, expression, and social communication. Includes detailed written report with recommendations.',
    price: 2500.00,
    duration_minutes: 60,
    display_order: 1,
    icon: 'clipboard-check',
    active: true
  },
  {
    slug: 'speech-therapy-session',
    name: 'Speech Therapy Session',
    description: 'One-on-one therapy session targeting articulation, fluency, voice, or language goals set by your therapist. Parent guidance included.',
    price: 1200.00,
    duration_minutes: 45,
    display_order: 2,
    icon: 'message-circle',
    active: true
  },
  {
    slug: 'occupational-therapy-session',
    name: 'Occupational Therapy Session',
    description: 'Activity-based therapy for fine motor, sensory integration, and daily-living skills. Tailored to each child\'s developmental profile.',
    price: 1200.00,
    duration_minutes: 45,
    display_order: 3,
    icon: 'hand',
    active: true
  },
  {
    slug: 'developmental-screening',
    name: 'Developmental Screening',
    description: 'Quick screening across speech, motor, cognitive, and social-emotional domains to flag areas that may benefit from a full assessment.',
    price: 1500.00,
    duration_minutes: 30,
    display_order: 4,
    icon: 'activity',
    active: true
  },
  {
    slug: 'parent-counselling',
    name: 'Parent Counselling & Home Program',
    description: 'Guided consultation for parents — strategies to support your child at home, plus a personalised home-practice plan.',
    price: 800.00,
    duration_minutes: 45,
    display_order: 5,
    icon: 'users',
    active: true
  },
  {
    slug: 'group-social-skills',
    name: 'Group Social Skills Session',
    description: 'Small-group session (3–5 children) focused on turn-taking, peer interaction, and conversational skills in a playful setting.',
    price: 900.00,
    duration_minutes: 60,
    display_order: 6,
    icon: 'users-round',
    active: true
  },
  {
    slug: 'online-consultation',
    name: 'Online Consultation',
    description: 'Video consultation with a certified therapist — ideal for follow-ups, progress reviews, or families outside our in-person catchment.',
    price: 1000.00,
    duration_minutes: 30,
    display_order: 7,
    icon: 'video',
    active: true
  },
  {
    slug: 'school-readiness-program',
    name: 'School Readiness Program',
    description: 'Structured multi-session program preparing pre-schoolers for classroom routines, early literacy, and peer communication.',
    price: 5000.00,
    duration_minutes: 45,
    display_order: 8,
    icon: 'graduation-cap',
    active: true
  }
]

services.each do |attrs|
  service = Service.find_or_initialize_by(slug: attrs[:slug])
  # Only set fields on new records so admin edits in production aren't overwritten on reseed
  if service.new_record?
    service.assign_attributes(attrs)
    service.save!
    puts "  ✓ Created service: #{service.name}"
  else
    puts "  ↻ Skipped (already exists, admin-editable): #{service.name}"
  end
end

puts "  Services total: #{Service.count}"
