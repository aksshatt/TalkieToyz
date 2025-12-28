module Api
  module V1
    class CartsController < BaseController
      before_action :set_cart, only: [:show, :add_item, :update_item, :remove_item, :clear]

      # GET /api/v1/cart
      def show
        render_success(
          CartSerializer.new(@cart, include: ['cart_items', 'cart_items.product', 'cart_items.product_variant']).as_json,
          'Cart retrieved successfully'
        )
      end

      # POST /api/v1/cart/items
      def add_item
        product = Product.active.find(params[:product_id])
        product_variant = nil

        # Check for product variant if specified
        if params[:product_variant_id].present?
          product_variant = product.variants.find(params[:product_variant_id])

          unless product_variant.active? && product_variant.stock_quantity > 0
            return render_error('Product variant is out of stock or inactive', nil, status: :unprocessable_entity)
          end

          available_stock = product_variant.stock_quantity
        else
          unless product.in_stock?
            return render_error('Product is out of stock', nil, status: :unprocessable_entity)
          end

          available_stock = product.stock_quantity
        end

        quantity = params[:quantity]&.to_i || 1

        if quantity > available_stock
          return render_error(
            'Requested quantity exceeds available stock',
            { available: available_stock },
            status: :unprocessable_entity
          )
        end

        cart_item = @cart.add_item(product, quantity, product_variant)

        if cart_item.persisted?
          render_success(
            CartSerializer.new(@cart.reload, include: ['cart_items', 'cart_items.product', 'cart_items.product_variant']).as_json,
            'Item added to cart successfully'
          )
        else
          render_error('Failed to add item to cart', cart_item.errors.full_messages)
        end
      rescue ActiveRecord::RecordNotFound
        render_error('Product or variant not found', nil, status: :not_found)
      end

      # PATCH /api/v1/cart/items/:id
      def update_item
        cart_item = @cart.cart_items.find(params[:id])
        quantity = params[:quantity].to_i

        if quantity <= 0
          return render_error('Quantity must be greater than 0', nil, status: :unprocessable_entity)
        end

        available_stock = cart_item.available_stock

        if quantity > available_stock
          return render_error(
            'Requested quantity exceeds available stock',
            { available: available_stock },
            status: :unprocessable_entity
          )
        end

        if cart_item.update(quantity: quantity)
          render_success(
            CartSerializer.new(@cart.reload, include: ['cart_items', 'cart_items.product', 'cart_items.product_variant']).as_json,
            'Cart item updated successfully'
          )
        else
          render_error('Failed to update cart item', cart_item.errors.full_messages)
        end
      rescue ActiveRecord::RecordNotFound
        render_error('Cart item not found', nil, status: :not_found)
      end

      # DELETE /api/v1/cart/items/:id
      def remove_item
        cart_item = @cart.cart_items.find(params[:id])
        cart_item.destroy

        render_success(
          CartSerializer.new(@cart.reload, include: ['cart_items', 'cart_items.product', 'cart_items.product_variant']).as_json,
          'Item removed from cart successfully'
        )
      rescue ActiveRecord::RecordNotFound
        render_error('Cart item not found', nil, status: :not_found)
      end

      # DELETE /api/v1/cart/clear
      def clear
        @cart.clear

        render_success(
          CartSerializer.new(@cart.reload, include: ['cart_items', 'cart_items.product', 'cart_items.product_variant']).as_json,
          'Cart cleared successfully'
        )
      end

      private

      def set_cart
        @cart = current_user.cart
      end
    end
  end
end
