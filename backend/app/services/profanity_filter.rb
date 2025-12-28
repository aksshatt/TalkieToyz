class ProfanityFilter
  # Basic profanity word list - can be expanded or replaced with obscenity gem
  PROFANITY_WORDS = %w[
    damn
    hell
    crap
    stupid
    idiot
    dumb
  ].freeze

  def self.contains_profanity?(text)
    return false if text.blank?

    normalized_text = text.downcase
    PROFANITY_WORDS.any? { |word| normalized_text.match?(/\b#{Regexp.escape(word)}\b/) }
  end

  def self.sanitize(text)
    return text if text.blank?

    sanitized = text.dup
    PROFANITY_WORDS.each do |word|
      pattern = /\b#{Regexp.escape(word)}\b/i
      sanitized.gsub!(pattern, '*' * word.length)
    end
    sanitized
  end
end
