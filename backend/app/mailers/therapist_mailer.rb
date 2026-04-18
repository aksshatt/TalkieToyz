class TherapistMailer < ApplicationMailer
  def approval_pending(therapist)
    @therapist = therapist
    @admin_email = ENV.fetch('ADMIN_EMAIL', 'admin@talkietoyz.shop')
    mail(to: @therapist.email, subject: 'Your TalkieToys therapist application has been received')
  end

  def approved(therapist)
    @therapist = therapist
    @login_url = "#{ENV.fetch('FRONTEND_URL', 'https://talkietoyz.shop')}/login"
    mail(to: @therapist.email, subject: 'You have been approved as a TalkieToys Therapist!')
  end

  def rejected(therapist, reason = nil)
    @therapist = therapist
    @reason = reason
    @contact_url = "#{ENV.fetch('FRONTEND_URL', 'https://talkietoyz.shop')}/contact"
    mail(to: @therapist.email, subject: 'Update on your TalkieToys therapist application')
  end

  def patient_assigned(therapist, patient)
    @therapist = therapist
    @patient = patient
    @dashboard_url = "#{ENV.fetch('FRONTEND_URL', 'https://talkietoyz.shop')}/therapist/patients"
    mail(to: @therapist.email, subject: "New patient assigned: #{patient.name}")
  end

  def new_message_notification(therapist, conversation, message)
    @therapist    = therapist
    @conversation = conversation
    @message      = message
    @patient      = conversation.patient
    @chat_url     = "#{ENV.fetch('FRONTEND_URL', 'https://talkietoyz.shop')}/therapist/patients/#{@patient.id}"
    mail(to: @therapist.email, subject: "New message from #{@patient.name}")
  end

  # Notify admin when any message is sent
  def admin_message_notification(admin, conversation, message)
    @admin        = admin
    @conversation = conversation
    @message      = message
    @sender       = message.sender
    @monitor_url  = "#{ENV.fetch('FRONTEND_URL', 'https://talkietoyz.shop')}/admin/conversations"
    mail(to: @admin.email, subject: "[TalkieToys] New chat message — #{@sender.name} → #{conversation.patient.name}")
  end
end
