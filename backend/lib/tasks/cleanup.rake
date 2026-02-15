namespace :db do
  desc "Remove all dummy/seed data except admin user and keep categories/speech goals"
  task cleanup: :environment do
    puts "Cleaning up dummy data..."

    # Remove all sample data
    puts "Removing reviews..."
    Review.destroy_all

    puts "Removing order items..."
    OrderItem.destroy_all

    puts "Removing orders..."
    Order.destroy_all

    puts "Removing cart items..."
    CartItem.destroy_all

    puts "Removing carts..."
    Cart.destroy_all

    puts "Removing product speech goals..."
    ProductSpeechGoal.destroy_all

    puts "Removing products..."
    Product.destroy_all

    puts "Removing addresses..."
    Address.destroy_all

    puts "Removing blog post comments..."
    BlogComment.destroy_all if defined?(BlogComment)

    puts "Removing blog posts..."
    BlogPost.destroy_all

    puts "Removing resources..."
    Resource.destroy_all if defined?(Resource)

    puts "Removing resource categories..."
    ResourceCategory.destroy_all if defined?(ResourceCategory)

    puts "Removing assessment results..."
    AssessmentResult.destroy_all if defined?(AssessmentResult)

    puts "Removing assessments..."
    Assessment.destroy_all if defined?(Assessment)

    puts "Removing milestones..."
    Milestone.destroy_all if defined?(Milestone)

    puts "Removing site contents..."
    SiteContent.destroy_all if defined?(SiteContent)

    puts "Removing FAQs..."
    Faq.destroy_all if defined?(Faq)

    puts "Removing contact submissions..."
    ContactSubmission.destroy_all if defined?(ContactSubmission)

    puts "Removing appointments..."
    Appointment.destroy_all if defined?(Appointment)

    puts "Removing newsletter subscriptions..."
    NewsletterSubscription.destroy_all if defined?(NewsletterSubscription)

    puts "Removing coupons..."
    Coupon.destroy_all if defined?(Coupon)

    # Remove all non-admin users
    puts "Removing non-admin users..."
    User.where.not(role: :admin).destroy_all

    puts ""
    puts "Cleanup complete!"
    puts "Remaining: #{User.count} admin user(s), #{Category.count} categories, #{SpeechGoal.count} speech goals"
  end
end
