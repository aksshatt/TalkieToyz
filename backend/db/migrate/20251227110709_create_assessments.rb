class CreateAssessments < ActiveRecord::Migration[7.1]
  def change
    create_table :assessments do |t|
      t.string :title, null: false
      t.text :description
      t.string :slug, null: false
      t.integer :min_age
      t.integer :max_age
      t.jsonb :questions, default: [], null: false
      t.jsonb :scoring_rules, default: {}
      t.jsonb :recommendations, default: {}
      t.boolean :active, default: true
      t.integer :version, default: 1
      t.datetime :deleted_at

      t.timestamps
    end

    add_index :assessments, :slug, unique: true
    add_index :assessments, :active
    add_index :assessments, :min_age
    add_index :assessments, :max_age
    add_index :assessments, :questions, using: :gin
    add_index :assessments, :deleted_at
  end
end
