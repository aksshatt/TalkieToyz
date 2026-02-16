namespace :db do
  desc "Seed assessments, milestones, blog posts, resources, and site content (idempotent)"
  task reseed_content: :environment do
    puts "Seeding content..."
    load Rails.root.join('db', 'seeds', 'assessments_seed.rb')
    load Rails.root.join('db', 'seeds', 'milestones_seed.rb')
    load Rails.root.join('db', 'seeds', 'blog_posts_seed.rb')
    load Rails.root.join('db', 'seeds', 'resources_seed.rb')
    load Rails.root.join('db', 'seeds', 'site_content_seed.rb')

    puts ""
    puts "Seed complete!"
    puts "Assessments: #{Assessment.count}" if defined?(Assessment)
    puts "Milestones: #{Milestone.count}" if defined?(Milestone)
    puts "Blog Posts: #{BlogPost.count}" if defined?(BlogPost)
    puts "Resources: #{Resource.count}" if defined?(Resource)
    puts "Site Contents: #{SiteContent.count}" if defined?(SiteContent)
  end
end
