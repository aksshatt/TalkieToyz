class OrderCreationService
  Result = Struct.new(:success, :order, :error, keyword_init: true) do
    def success? = success
  end

  def self.call(user:, params:)
    new(user: user, params: params).call
  end

  def initialize(user:, params:)
    @user   = user
    @params = params
  end

  def call
    return Result.new(success: false, error: 'Cart is empty') if cart.empty?

    validation = validate_params
    return validation if validation

    coupon_result = resolve_coupon
    return coupon_result if coupon_result.is_a?(Result)

    order = build_order(coupon_result)
    order.update(customer_notes: @params[:customer_notes]) if @params[:customer_notes].present?

    confirm_cod_order(order) if order.payment_method == 'cod'

    Result.new(success: true, order: order)
  rescue StandardError => e
    Result.new(success: false, error: e.message)
  end

  private

  def cart
    @cart ||= @user.cart
  end

  def validate_params
    unless @params[:payment_method].present? && @params[:shipping_address].present?
      return Result.new(success: false, error: 'Payment method and shipping address are required')
    end

    shipping_cost = @params[:shipping_cost].to_f
    if @params[:shipping_cost].present? && shipping_cost < 0
      return Result.new(success: false, error: 'shipping_cost cannot be negative')
    end

    nil
  end

  def resolve_coupon
    return nil unless @params[:coupon_code].present?

    coupon = Coupon.find_by(code: @params[:coupon_code].upcase)

    unless coupon&.valid_for_order?(cart.subtotal)
      return Result.new(success: false, error: 'Invalid or expired coupon code')
    end

    already_used = @user.orders.where(coupon_id: coupon.id).where.not(status: :cancelled).exists?
    if already_used
      return Result.new(success: false, error: 'Coupon already used')
    end

    coupon
  end

  def permitted_address(raw)
    return nil unless raw.is_a?(ActionController::Parameters) || raw.is_a?(Hash)
    raw.to_unsafe_h.slice(
      'name', 'phone', 'address_line_1', 'address_line_2',
      'city', 'state', 'pincode', 'country', 'landmark'
    )
  end

  def build_order(coupon)
    shipping_cost = @params[:shipping_cost].present? ? @params[:shipping_cost].to_f : 0

    Order.create_from_cart(
      cart,
      payment_method: @params[:payment_method],
      shipping_address: permitted_address(@params[:shipping_address]),
      billing_address: permitted_address(@params[:billing_address]),
      coupon: coupon,
      clear_cart: @params[:payment_method] == 'cod',
      gift_wrap: @params[:gift_wrap] == true || @params[:gift_wrap] == 'true',
      gift_message: @params[:gift_message],
      shipping_cost: shipping_cost,
      selected_courier_id: @params[:selected_courier_id]
    )
  end

  def confirm_cod_order(order)
    Order.transaction do
      order.mark_as_confirmed
      points = order.total.to_i
      LoyaltyPoint.award(
        user: @user,
        source: 'purchase',
        points: points,
        reference: order,
        description: "Earned #{points} points for order ##{order.order_number}"
      )
    end
  end
end
