class CreateAppointments < ActiveRecord::Migration[7.1]
  def change
    create_table :appointments do |t|
      t.string :name
      t.string :email
      t.string :phone
      t.text :message
      t.string :preferred_language
      t.string :status
      t.references :user, null: true, foreign_key: true

      t.timestamps
    end
  end
end
