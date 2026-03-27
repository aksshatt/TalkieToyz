class AddMotherTongueAndPdfDownloadCountToAssessmentResults < ActiveRecord::Migration[7.1]
  def change
    add_column :assessment_results, :mother_tongue, :string
    add_column :assessment_results, :pdf_download_count, :integer, default: 0, null: false
  end
end
