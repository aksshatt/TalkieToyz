class AddAdminResponseToReviews < ActiveRecord::Migration[7.1]
  def change
    add_column :reviews, :admin_response, :text
    add_reference :reviews, :admin_responder, foreign_key: { to_table: :users }
    add_column :reviews, :admin_responded_at, :datetime

    add_index :reviews, :admin_responded_at
  end
end
