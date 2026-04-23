class AddServiceFieldsToAppointments < ActiveRecord::Migration[7.1]
  def change
    add_reference :appointments, :service, foreign_key: true, null: true
    add_column :appointments, :preferred_date, :datetime
    add_column :appointments, :child_name, :string
    add_column :appointments, :child_age, :string
  end
end
