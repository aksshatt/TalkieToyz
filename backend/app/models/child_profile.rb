class ChildProfile < ApplicationRecord
  belongs_to :user
  has_many :milestone_achievements, dependent: :destroy

  validates :name, presence: true, length: { minimum: 2, maximum: 100 }
  validates :date_of_birth, presence: true

  def age_in_months
    return nil unless date_of_birth
    ((Time.current.to_date - date_of_birth).to_f / 30.44).floor
  end

  def age_in_years
    return nil unless date_of_birth
    ((Time.current.to_date - date_of_birth).to_f / 365.25).floor
  end

  def age_display
    months = age_in_months
    return 'Unknown' unless months
    years = months / 12
    remaining_months = months % 12
    if years == 0
      "#{remaining_months} months"
    elsif remaining_months == 0
      "#{years} year#{'s' if years > 1}"
    else
      "#{years}y #{remaining_months}m"
    end
  end
end
