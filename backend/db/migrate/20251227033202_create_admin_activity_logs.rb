class CreateAdminActivityLogs < ActiveRecord::Migration[7.1]
  def change
    create_table :admin_activity_logs do |t|
      t.references :user, null: false, foreign_key: true
      t.string :action, null: false
      t.string :resource_type
      t.integer :resource_id
      t.jsonb :details, default: {}
      t.string :ip_address
      t.string :user_agent

      t.timestamps
    end

    add_index :admin_activity_logs, :action
    add_index :admin_activity_logs, :resource_type
    add_index :admin_activity_logs, [:resource_type, :resource_id]
    add_index :admin_activity_logs, :created_at
  end
end
