class CreateProgressLogs < ActiveRecord::Migration[7.1]
  def change
    create_table :progress_logs do |t|
      t.references :user, null: false, foreign_key: true
      t.string :child_name, null: false
      t.integer :child_age_months, null: false
      t.date :log_date, null: false
      t.string :category, null: false
      t.text :notes
      t.jsonb :metrics, default: {}
      t.jsonb :achievements, default: []
      t.references :milestone, foreign_key: true
      t.references :product, foreign_key: true
      t.datetime :deleted_at

      t.timestamps
    end

    add_index :progress_logs, :child_name
    add_index :progress_logs, :log_date
    add_index :progress_logs, :category
    add_index :progress_logs, [:user_id, :child_name, :log_date]
    add_index :progress_logs, :metrics, using: :gin
    add_index :progress_logs, :deleted_at
  end
end
