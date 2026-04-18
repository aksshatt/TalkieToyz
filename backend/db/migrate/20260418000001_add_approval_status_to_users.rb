class AddApprovalStatusToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :approval_status, :string, default: 'approved'
    add_index :users, :approval_status

    # All existing therapists are pre-approved
    User.where(role: 1).update_all(approval_status: 'approved') if User.table_exists?
  end
end
