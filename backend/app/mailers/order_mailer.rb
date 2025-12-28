class OrderMailer < ApplicationMailer
  # Send order confirmation email
  def order_confirmation(order_id)
    @order = Order.includes(:order_items, :user).find(order_id)
    @user = @order.user

    mail(
      to: @user.email,
      subject: "Order Confirmation - #{@order.order_number}"
    )
  end

  # Send order shipped notification
  def order_shipped(order_id)
    @order = Order.includes(:order_items, :user).find(order_id)
    @user = @order.user

    mail(
      to: @user.email,
      subject: "Your Order Has Been Shipped - #{@order.order_number}"
    )
  end

  # Send order delivered notification
  def order_delivered(order_id)
    @order = Order.includes(:order_items, :user).find(order_id)
    @user = @order.user

    mail(
      to: @user.email,
      subject: "Your Order Has Been Delivered - #{@order.order_number}"
    )
  end

  # Send order cancelled notification
  def order_cancelled(order_id)
    @order = Order.includes(:order_items, :user).find(order_id)
    @user = @order.user

    mail(
      to: @user.email,
      subject: "Order Cancelled - #{@order.order_number}"
    )
  end
end
