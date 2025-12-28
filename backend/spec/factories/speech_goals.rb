FactoryBot.define do
  factory :speech_goal do
    sequence(:name) { |n| "Speech Goal #{n}" }
    description { "Description for #{name}" }
    slug { name.parameterize }
    color { "#3B82F6" }
    icon { "message-circle" }
    active { true }
  end
end
