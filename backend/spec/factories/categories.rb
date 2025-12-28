FactoryBot.define do
  factory :category do
    sequence(:name) { |n| "Category #{n}" }
    description { "Description for #{name}" }
    slug { name.parameterize }
    position { 1 }
    active { true }
    image_url { nil }
  end
end
