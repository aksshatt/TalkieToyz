require 'prawn'
require 'prawn/table'

class ProgressReportPdf
  def initialize(user, progress_logs, child_name)
    @user = user
    @progress_logs = progress_logs
    @child_name = child_name
  end

  def generate
    pdf = Prawn::Document.new(page_size: 'LETTER', margin: 50)

    # Header
    pdf.text 'TalkieToys', size: 24, style: :bold, color: '4A5568'
    pdf.text 'Speech Development Progress Report', size: 16, color: '718096'
    pdf.move_down 20

    # Child and Parent Info
    pdf.text "Child: #{@child_name}", size: 14, style: :bold
    pdf.text "Parent/Guardian: #{@user.name}", size: 12
    pdf.text "Report Date: #{Date.current.strftime('%B %d, %Y')}", size: 12
    pdf.text "Total Logs: #{@progress_logs.count}", size: 12
    pdf.move_down 20

    # Summary Statistics
    add_summary_section(pdf)

    # Progress Logs
    add_progress_logs_section(pdf)

    # Footer
    pdf.number_pages "Page <page> of <total>", at: [pdf.bounds.right - 100, 0], align: :right, size: 10

    pdf.render
  end

  private

  def add_summary_section(pdf)
    pdf.text 'Progress Summary', size: 16, style: :bold, color: '2D3748'
    pdf.move_down 10

    # Category breakdown
    category_counts = @progress_logs.group(:category).count

    if category_counts.any?
      table_data = [['Category', 'Log Count']]
      category_counts.each do |category, count|
        table_data << [category.to_s.titleize, count.to_s]
      end

      pdf.table(table_data,
        header: true,
        row_colors: ['F7FAFC', 'FFFFFF'],
        cell_style: {
          borders: [:bottom],
          border_color: 'E2E8F0',
          padding: [8, 12]
        },
        column_widths: [300, 100]
      )
    end

    pdf.move_down 20
  end

  def add_progress_logs_section(pdf)
    pdf.text 'Detailed Progress Logs', size: 16, style: :bold, color: '2D3748'
    pdf.move_down 10

    @progress_logs.each_with_index do |log, index|
      # Start new page if needed
      pdf.start_new_page if pdf.cursor < 200 && index > 0

      # Log header
      pdf.text "#{log.log_date.strftime('%B %d, %Y')} - #{log.category.to_s.titleize}",
        size: 12, style: :bold, color: '4A5568'
      pdf.move_down 5

      # Age at log
      pdf.text "Child Age: #{log.age_display}", size: 10, color: '718096'
      pdf.move_down 5

      # Notes
      if log.notes.present?
        pdf.text 'Notes:', size: 10, style: :bold
        pdf.text log.notes, size: 10
        pdf.move_down 5
      end

      # Achievements
      if log.achievements.present? && log.achievements.any?
        pdf.text 'Achievements:', size: 10, style: :bold
        log.achievements.each do |achievement|
          pdf.text "• #{achievement}", size: 10, indent_paragraphs: 10
        end
        pdf.move_down 5
      end

      # Metrics
      if log.metrics.present? && log.metrics.any?
        pdf.text 'Metrics:', size: 10, style: :bold
        log.metrics.each do |key, value|
          pdf.text "• #{key.to_s.titleize}: #{value}", size: 10, indent_paragraphs: 10
        end
      end

      # Separator
      pdf.stroke_horizontal_rule
      pdf.move_down 15
    end
  end
end
