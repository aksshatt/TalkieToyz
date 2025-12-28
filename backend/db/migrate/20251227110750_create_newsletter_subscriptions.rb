class CreateNewsletterSubscriptions < ActiveRecord::Migration[7.1]
  def change
    create_table :newsletter_subscriptions do |t|
      t.string :email, null: false
      t.string :name
      t.string :status, default: 'pending', null: false
      t.string :subscription_token
      t.datetime :confirmed_at
      t.datetime :unsubscribed_at
      t.jsonb :preferences, default: {}

      t.timestamps
    end

    add_index :newsletter_subscriptions, :email, unique: true
    add_index :newsletter_subscriptions, :status
    add_index :newsletter_subscriptions, :subscription_token, unique: true
  end
end
