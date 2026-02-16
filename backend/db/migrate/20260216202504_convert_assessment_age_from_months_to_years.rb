class ConvertAssessmentAgeFromMonthsToYears < ActiveRecord::Migration[7.1]
  def up
    # Convert existing assessment min_age/max_age from months to years
    execute <<-SQL
      UPDATE assessments
      SET min_age = ROUND(min_age / 12.0),
          max_age = ROUND(max_age / 12.0)
      WHERE min_age IS NOT NULL OR max_age IS NOT NULL
    SQL
  end

  def down
    # Convert back from years to months
    execute <<-SQL
      UPDATE assessments
      SET min_age = min_age * 12,
          max_age = max_age * 12
      WHERE min_age IS NOT NULL OR max_age IS NOT NULL
    SQL
  end
end
