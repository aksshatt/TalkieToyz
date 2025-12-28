class CreateMilestones < ActiveRecord::Migration[7.1]
  def change
    create_table :milestones do |t|
      t.string :title, null: false
      t.text :description
      t.string :category, null: false
      t.integer :age_months_min, null: false
      t.integer :age_months_max, null: false
      t.integer :position, default: 0
      t.jsonb :indicators, default: []
      t.jsonb :tips, default: []
      t.boolean :active, default: true

      t.timestamps
    end

    add_index :milestones, :category
    add_index :milestones, :age_months_min
    add_index :milestones, :age_months_max
    add_index :milestones, [:age_months_min, :age_months_max]
    add_index :milestones, :position
  end
end
