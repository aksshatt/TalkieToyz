services = [
  {
    name: 'Speech Therapy',
    description: 'We help children improve speech clarity, language development, communication skills, and social interaction. Therapy is customized to each child’s needs.',
    price: 800,
    duration_minutes: 45,
    display_order: 1,
    image_url: '/services/speech-therapy.png',
    icon: 'message-circle'
  },
  {
    name: 'Occupational Therapy',
    description: 'Focused on improving fine motor skills, sensory processing, attention, and daily living activities to make children more independent.',
    price: 900,
    duration_minutes: 45,
    display_order: 2,
    image_url: '/services/occupational-therapy.png',
    icon: 'hand-metal'
  },
  {
    name: 'Physiotherapy',
    description: 'Helps improve strength, balance, coordination, and overall physical development in children with motor delays or neurological conditions.',
    price: 900,
    duration_minutes: 45,
    display_order: 3,
    image_url: '/services/physiotherapy.png',
    icon: 'activity'
  },
  {
    name: 'Special Education',
    description: 'Individualized teaching strategies support children with learning difficulties, helping them improve academic and cognitive skills.',
    price: 700,
    duration_minutes: 60,
    display_order: 4,
    image_url: '/services/special-education.png',
    icon: 'book-open'
  },
  {
    name: 'Psychological Assessment',
    description: 'Detailed assessments understand a child’s cognitive, emotional, and behavioral profile for accurate diagnosis and intervention planning.',
    price: 2500,
    duration_minutes: 90,
    display_order: 5,
    image_url: '/services/psychological-assessment.png',
    icon: 'brain'
  },
  {
    name: 'Behaviour Management',
    description: 'We reduce challenging behaviors and promote positive behaviors using structured, child-friendly techniques.',
    price: 850,
    duration_minutes: 45,
    display_order: 6,
    image_url: '/services/behaviour-management.png',
    icon: 'sparkles'
  },
  {
    name: 'Child Counselling',
    description: 'Support for children dealing with emotional, social, and behavioral concerns in a safe and supportive environment.',
    price: 1000,
    duration_minutes: 50,
    display_order: 7,
    image_url: '/services/child-counselling.png',
    icon: 'heart'
  },
  {
    name: 'Parent Counselling',
    description: 'Guidance and training for parents to understand their child’s needs better and continue therapy strategies at home.',
    price: 1200,
    duration_minutes: 60,
    display_order: 8,
    image_url: '/services/parent-counselling.png',
    icon: 'users'
  }
]

services.each do |attrs|
  svc = Service.find_or_initialize_by(slug: attrs[:name].parameterize)
  svc.assign_attributes(attrs.merge(active: true))
  svc.save!
end

puts "Seeded #{Service.count} services."
