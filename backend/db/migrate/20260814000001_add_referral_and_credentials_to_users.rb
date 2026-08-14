class AddReferralAndCredentialsToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :referral_code, :string
    add_column :users, :referred_by_id, :bigint
    add_column :users, :certifications, :jsonb, default: []
    add_column :users, :experience_years, :integer
    add_column :users, :specializations, :text, array: true, default: []
    add_column :users, :languages_spoken, :text, array: true, default: []

    add_index :users, :referral_code, unique: true
    add_index :users, :referred_by_id
  end
end
