class AddApprovalStatusToUsers < ActiveRecord::Migration[7.1]
  def change
    unless column_exists?(:users, :approval_status)
      add_column :users, :approval_status, :string, default: 'approved'
    end

    unless index_exists?(:users, :approval_status)
      add_index :users, :approval_status
    end

    # All existing therapists are pre-approved
    execute("UPDATE users SET approval_status = 'approved' WHERE role = 1") if column_exists?(:users, :approval_status)
  end
end
