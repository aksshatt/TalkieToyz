FactoryBot.define do
  factory :site_content do
    key { "MyString" }
    content_type { "MyString" }
    value { "MyText" }
    page { "MyString" }
    metadata { "" }
    active { false }
    display_order { 1 }
  end
end
