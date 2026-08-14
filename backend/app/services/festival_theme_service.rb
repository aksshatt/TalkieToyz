class FestivalThemeService
  FESTIVALS = YAML.load_file(Rails.root.join('config/festivals.yml'))['festivals'].freeze

  def self.today
    active_on(Date.current)
  end

  def self.active_on(date)
    date_str = date.to_s
    FESTIVALS.find { |f| f['date'] == date_str }
  end

  def self.upcoming(days: 30)
    cutoff = Date.current + days
    FESTIVALS
      .select { |f| (Date.current..cutoff).cover?(Date.parse(f['date'])) }
      .sort_by { |f| f['date'] }
  end
end
