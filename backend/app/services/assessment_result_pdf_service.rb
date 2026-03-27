class AssessmentResultPdfService
  require 'prawn'
  require 'prawn/table'

  def initialize(assessment_result)
    @assessment_result = assessment_result
    @assessment = assessment_result.assessment
  end

  def generate
    Prawn::Document.new(page_size: 'A4', margin: 50) do |pdf|
      # Header
      pdf.font 'Helvetica'
      pdf.text 'TalkieToys', size: 24, style: :bold, color: '00897B'
      pdf.text 'Speech & Language Development Assessment Report', size: 14, color: '5D4037'
      pdf.move_down 20

      # Child Information Section
      pdf.stroke_horizontal_rule
      pdf.move_down 10
      pdf.text 'Child Information', size: 16, style: :bold, color: '00897B'
      pdf.move_down 10

      child_age_years = @assessment_result.child_age_months / 12
      child_age_months_rem = @assessment_result.child_age_months % 12
      age_display = child_age_months_rem > 0 ? "#{child_age_years} years #{child_age_months_rem} months" : "#{child_age_years} years"

      child_info = [
        ['Name:', @assessment_result.child_name],
        ['Age:', age_display],
        ['Mother Tongue:', @assessment_result.mother_tongue.presence || 'Not specified'],
        ['Assessment:', @assessment.title],
        ['Completed:', @assessment_result.completed_at.strftime('%B %d, %Y at %I:%M %p')]
      ]

      pdf.table(child_info, cell_style: { borders: [], padding: [5, 10] }, column_widths: [130, 340]) do
        column(0).font_style = :bold
      end

      pdf.move_down 20

      # Overall Score Section
      pdf.stroke_horizontal_rule
      pdf.move_down 10
      pdf.text 'Overall Performance', size: 16, style: :bold, color: '00897B'
      pdf.move_down 10

      score_level = get_score_level(@assessment_result.percentage_score)

      box_top = pdf.cursor
      box_height = 110

      pdf.fill_color score_level[:color]
      pdf.fill_rectangle [0, box_top], 495, box_height

      pdf.bounding_box([0, box_top], width: 495, height: box_height) do
        pdf.fill_color 'FFFFFF'
        pdf.move_down 10
        pdf.text "#{@assessment_result.percentage_score.round}%", size: 36, style: :bold, align: :center
        pdf.move_down 5
        pdf.text score_level[:label], size: 18, style: :bold, align: :center
        pdf.move_down 5
        pdf.text score_level[:message], size: 12, align: :center
      end

      pdf.fill_color '000000'
      pdf.move_down 10

      max_total_score = @assessment_result.category_max_scores.values.sum
      pdf.text "Total Score: #{@assessment_result.total_score} / #{max_total_score} points",
               size: 12, align: :center, color: '616161'
      pdf.move_down 20

      # Skill Area Breakdown
      if @assessment_result.scores.present? && @assessment_result.scores.any?
        pdf.stroke_horizontal_rule
        pdf.move_down 10
        pdf.text 'Skill Area Breakdown', size: 16, style: :bold, color: '00897B'
        pdf.move_down 10

        category_max = @assessment_result.category_max_scores
        skill_data = [['Skill Area', 'Score', 'Performance']]
        @assessment_result.scores.each do |category, score|
          max = (category_max[category.to_s] || category_max[category] || 10).to_f
          percentage = (score.to_f / max) * 100
          performance = case percentage
                       when 80..100 then 'Excellent'
                       when 60...80 then 'Good'
                       when 40...60 then 'Fair'
                       else 'Needs Focus'
                       end
          skill_data << [category.to_s.split('_').map(&:capitalize).join(' '), "#{score}/#{max.to_i}", performance]
        end

        pdf.table(skill_data, header: true, width: 495,
                  cell_style: { padding: [8, 10], borders: [:bottom], border_color: 'CCCCCC' }) do
          row(0).font_style = :bold
          row(0).background_color = 'E0F2F1'
          row(0).text_color = '00897B'
          column(1).align = :center
          column(2).align = :center
        end

        pdf.move_down 20
      end

      # Recommendations
      if @assessment_result.recommendations.present?
        pdf.stroke_horizontal_rule
        pdf.move_down 10
        pdf.text 'Personalized Recommendations', size: 16, style: :bold, color: '00897B'
        pdf.move_down 10

        if @assessment_result.recommendations['message'].present?
          pdf.text @assessment_result.recommendations['message'], size: 12, leading: 5
          pdf.move_down 10
        end

        if @assessment_result.recommendations['tips'].present? && @assessment_result.recommendations['tips'].any?
          pdf.text 'Actionable Tips for Progress:', size: 14, style: :bold, color: '5D4037'
          pdf.move_down 5

          @assessment_result.recommendations['tips'].each_with_index do |tip, index|
            pdf.text "#{index + 1}. #{tip}", size: 11, leading: 4
            pdf.move_down 5
          end
        end
      end

      pdf.move_down 20

      # Note / Disclaimer Section
      pdf.stroke_horizontal_rule
      pdf.move_down 10
      pdf.text 'Important Note', size: 14, style: :bold, color: '5D4037'
      pdf.move_down 8

      notes = [
        'For a more detailed and scientific assessment, please book an appointment.',
        'You may also contact us through our website or the Book Appointment feature.',
        'Or consult your nearest RCI-certified Audiologist & Speech Language Pathologist.',
        'Always seek assessment from a qualified professional for accurate diagnosis.'
      ]

      notes.each do |note|
        pdf.text "• #{note}", size: 11, leading: 4, color: '424242'
        pdf.move_down 4
      end

      pdf.move_down 10

      # Book Appointment CTA
      pdf.fill_color 'E0F2F1'
      cta_top = pdf.cursor
      pdf.fill_rectangle [0, cta_top], 495, 55
      pdf.bounding_box([0, cta_top], width: 495, height: 55) do
        pdf.fill_color '00897B'
        pdf.move_down 10
        pdf.text 'Book an Appointment', size: 14, style: :bold, align: :center
        pdf.move_down 4
        pdf.text 'Visit: https://talkietoyz.shop  |  Or use the Book Appointment button in our app',
                 size: 10, align: :center, color: '004D40'
      end
      pdf.fill_color '000000'

      pdf.move_down 20

      # Footer
      pdf.stroke_horizontal_rule
      pdf.move_down 10
      pdf.text 'Swekchaa Tamrakar', size: 12, style: :bold, align: :center, color: '00897B'
      pdf.text 'Audiologist & Speech Therapist', size: 11, align: :center, color: '424242'
      pdf.text 'BASLP, M.Sc. Audiology (Mumbai)', size: 10, align: :center, color: '616161'
      pdf.move_down 6
      pdf.text 'This report was generated by TalkieToys Assessment Platform', size: 9, align: :center, color: '9E9E9E'

      # Page numbers
      options = {
        at: [pdf.bounds.right - 100, 0],
        width: 100,
        align: :right,
        size: 9,
        color: '9E9E9E'
      }
      pdf.number_pages 'Page <page> of <total>', options
    end
  end

  private

  def get_score_level(percentage)
    if percentage >= 80
      { label: 'Excellent Progress', color: '00897B', message: 'Outstanding! Your child is showing great progress.' }
    elsif percentage >= 60
      { label: 'Good Progress', color: '0288D1', message: 'Great work! Your child is developing well.' }
    elsif percentage >= 40
      { label: 'Making Progress', color: 'FFA726', message: 'Your child is on the right track with room to grow.' }
    else
      { label: 'Needs Support', color: 'EF5350', message: 'With the right support, your child can make great progress.' }
    end
  end
end
