class CreateTherapistPatientAssignments < ActiveRecord::Migration[7.1]
  def change
    create_table :therapist_patient_assignments do |t|
      t.references :therapist, null: false, foreign_key: { to_table: :users }
      t.references :patient,   null: false, foreign_key: { to_table: :users }
      t.references :assigned_by, null: false, foreign_key: { to_table: :users }
      t.text :notes
      t.boolean :active, default: true, null: false
      t.timestamps
    end

    add_index :therapist_patient_assignments, [:therapist_id, :patient_id], unique: true, name: 'idx_tpa_therapist_patient'
  end
end
