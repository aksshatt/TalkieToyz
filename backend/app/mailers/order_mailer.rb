class OrderMailer < ApplicationMailer
  # Each mailer action accepts either an Order record or its id. Order /
  # user may have been deleted between enqueue and delivery; in that case
  # return early rather than raising (which would cause infinite job retries).

  def order_confirmation(order_or_id)
    return unless prepare(order_or_id)

    mail(to: @user.email, subject: "Order Confirmation - #{@order.order_number}")
  end

  def order_shipped(order_or_id)
    return unless prepare(order_or_id)

    mail(to: @user.email, subject: "Your Order Has Been Shipped - #{@order.order_number}")
  end

  def order_delivered(order_or_id)
    return unless prepare(order_or_id)

    mail(to: @user.email, subject: "Your Order Has Been Delivered - #{@order.order_number}")
  end

  def order_cancelled(order_or_id)
    return unless prepare(order_or_id)

    mail(to: @user.email, subject: "Order Cancelled - #{@order.order_number}")
  end

  def refund_processed(order_or_id)
    return unless prepare(order_or_id)

    mail(to: @user.email, subject: "Refund Processed - #{@order.order_number}")
  end

  private

  def prepare(order_or_id)
    @order = if order_or_id.is_a?(Order)
               order_or_id
             else
               Order.includes(:order_items, :user).find_by(id: order_or_id)
             end
    @user = @order&.user
    @user.present? && @user.email.present?
  end
end
