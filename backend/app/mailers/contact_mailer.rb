class ContactMailer < ApplicationMailer
  # Send notification to admin
  def admin_notification(contact_submission_id)
    @submission = ContactSubmission.find(contact_submission_id)

    mail(
      to: ENV['CONTACT_EMAIL'] || ENV['DEFAULT_EMAIL_FROM'],
      subject: "New Contact Form Submission - #{@submission.subject}"
    )
  end

  # Send confirmation to user
  def user_confirmation(contact_submission_id)
    @submission = ContactSubmission.find(contact_submission_id)

    mail(
      to: @submission.email,
      subject: "We've received your message - TalkieToys"
    )
  end
end
