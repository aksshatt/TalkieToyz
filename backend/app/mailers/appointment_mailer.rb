class AppointmentMailer < ApplicationMailer
  SWEKCHAA_EMAIL = 'talkietoyz@gmail.com'.freeze

  # Email to the customer confirming their booking
  def customer_confirmation(appointment)
    @appointment = appointment
    mail(
      to: @appointment.email,
      subject: 'Your Appointment Request is Confirmed – TalkieToyz'
    )
  end

  # Email to Swekchaa with full appointment details
  def admin_notification(appointment)
    @appointment = appointment
    mail(
      to: SWEKCHAA_EMAIL,
      subject: "New Appointment Request from #{@appointment.name}"
    )
  end
end
