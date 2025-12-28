# Create additional test data
puts "Creating test data..."

# Create sample assessment results
user = User.find_by(email: 'parent@example.com')
assessment = Assessment.find_by(slug: 'speech-development-12-24-months')

result = AssessmentResult.create!(
  user: user,
  assessment: assessment,
  child_name: 'Emma',
  child_age_months: 18,
  answers: {
    'q1' => 'yes',
    'q2' => 'yes',
    'q3' => '11-20',
    'q4' => 'yes',
    'q5' => 'yes',
    'q6' => 4,
    'q7' => 'yes',
    'q8' => 'yes',
    'q9' => 'no',
    'q10' => 'yes'
  },
  scores: { expressive_language: 45, receptive_language: 30, social_communication: 15 },
  total_score: 90,
  recommendations: {
    level: 'on_track',
    message: 'Great job! Your child is on track.',
    product_categories: ['advanced-language-toys']
  },
  completed_at: Time.current
)
puts "✅ Created assessment result ID: #{result.id}"

# Create progress logs
3.times do |i|
  log = ProgressLog.create!(
    user: user,
    child_name: 'Emma',
    child_age_months: 18 + i,
    log_date: (30 * i).days.ago,
    category: 'expressive_language',
    notes: "Great progress this month! Emma is using more #{i + 2}-word combinations.",
    metrics: { word_count: 25 + (i * 10), clarity_percentage: 60 + (i * 5) },
    achievements: ['First 2-word combination!', 'Named 3 body parts', 'Responded to name consistently']
  )
  puts "✅ Created progress log ID: #{log.id}"
end

# Create newsletter subscriptions
['sarah@example.com', 'john@example.com', 'emily@example.com'].each do |email|
  sub = NewsletterSubscription.create!(
    email: email,
    name: email.split('@').first.capitalize,
    status: 'active',
    confirmed_at: Time.current,
    preferences: { frequency: 'weekly', topics: ['therapy_tips', 'milestones'] }
  )
  puts "✅ Created newsletter subscription: #{sub.email}"
end

puts "\n📊 Data Summary:"
puts "Assessments: #{Assessment.count}"
puts "Assessment Results: #{AssessmentResult.count}"
puts "Milestones: #{Milestone.count}"
puts "Progress Logs: #{ProgressLog.count}"
puts "Blog Posts: #{BlogPost.count}"
puts "Resources: #{Resource.count}"
puts "Newsletter Subscriptions: #{NewsletterSubscription.count}"
