result = AssessmentResult.first
result.answers_will_change!
result.save!

result.reload
puts "Total Score: #{result.total_score} / 125"
puts "Percentage Score: #{result.percentage_score}%"
puts "Scores by category:"
result.scores.each do |category, score|
  puts "  #{category}: #{score}"
end
puts ""
puts "Recommendation level: #{result.recommendations['level']}"
puts "Message: #{result.recommendations['message']}"
