class CreateAssessmentResults < ActiveRecord::Migration[7.1]
  def change
    create_table :assessment_results do |t|
      t.references :user, null: false, foreign_key: true
      t.references :assessment, null: false, foreign_key: true
      t.string :child_name
      t.integer :child_age_months
      t.jsonb :answers, default: {}, null: false
      t.jsonb :scores, default: {}
      t.integer :total_score, default: 0
      t.jsonb :recommendations, default: {}
      t.datetime :completed_at

      t.timestamps
    end

    add_index :assessment_results, :completed_at
    add_index :assessment_results, :answers, using: :gin
    add_index :assessment_results, [:user_id, :created_at]
  end
end
