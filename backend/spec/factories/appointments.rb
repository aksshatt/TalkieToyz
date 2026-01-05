FactoryBot.define do
  factory :appointment do
    name { "MyString" }
    email { "MyString" }
    phone { "MyString" }
    message { "MyText" }
    preferred_language { "MyString" }
    status { "MyString" }
    user { nil }
  end
end
