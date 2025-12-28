module Api
  module V1
    module Admin
      class ProductsController < BaseController
        before_action :set_product, only: [:show, :update, :destroy]

        # GET /api/v1/admin/products
        def index
          @products = Product.includes(:category, :speech_goals)
                            .order(created_at: :desc)

          # Apply filters
          @products = apply_filters(@products)

          # Pagination
          @products = @products.page(params[:page])
                              .per(params[:per_page] || 20)

          render_success(
            {
              products: @products.map { |p| admin_product_summary(p) },
              meta: pagination_meta(@products)
            },
            'Products retrieved successfully'
          )
        end

        # GET /api/v1/admin/products/:id
        def show
          render_success(
            admin_product_details(@product),
            'Product retrieved successfully'
          )
        end

        # POST /api/v1/admin/products
        def create
          @product = Product.new(product_params)

          if @product.save
            log_activity('create', 'Product', @product.id, { name: @product.name })
            render_success(
              admin_product_details(@product),
              'Product created successfully',
              status: :created
            )
          else
            render_error('Failed to create product', @product.errors.full_messages)
          end
        end

        # PATCH /api/v1/admin/products/:id
        def update
          if @product.update(product_params)
            log_activity('update', 'Product', @product.id, { name: @product.name })
            render_success(
              admin_product_details(@product),
              'Product updated successfully'
            )
          else
            render_error('Failed to update product', @product.errors.full_messages)
          end
        end

        # DELETE /api/v1/admin/products/:id
        def destroy
          @product.update(deleted_at: Time.current, active: false)
          log_activity('delete', 'Product', @product.id, { name: @product.name })

          render_success(nil, 'Product deleted successfully')
        end

        # POST /api/v1/admin/products/bulk_update
        def bulk_update
          product_ids = params[:product_ids] || []
          action = params[:action] # 'activate', 'deactivate', 'delete'

          case action
          when 'activate'
            Product.where(id: product_ids).update_all(active: true)
            message = 'Products activated successfully'
          when 'deactivate'
            Product.where(id: product_ids).update_all(active: false)
            message = 'Products deactivated successfully'
          when 'delete'
            Product.where(id: product_ids).update_all(deleted_at: Time.current, active: false)
            message = 'Products deleted successfully'
          else
            return render_error('Invalid action', nil, status: :bad_request)
          end

          log_activity('bulk_update', 'Product', nil, { action: action, count: product_ids.size })
          render_success(nil, message)
        end

        # GET /api/v1/admin/products/export
        def export
          @products = Product.includes(:category, :speech_goals)

          csv_data = generate_products_csv(@products)

          send_data csv_data,
                    filename: "products_#{Date.current}.csv",
                    type: 'text/csv',
                    disposition: 'attachment'
        end

        private

        def set_product
          @product = Product.find(params[:id])
        rescue ActiveRecord::RecordNotFound
          render_error('Product not found', nil, status: :not_found)
        end

        def product_params
          params.require(:product).permit(
            :name, :description, :long_description, :price, :compare_at_price,
            :stock_quantity, :sku, :min_age, :max_age, :category_id,
            :featured, :active, specifications: {}, speech_goal_ids: []
          )
        end

        def apply_filters(products)
          products = products.where(active: params[:active]) if params[:active].present?
          products = products.where(category_id: params[:category_id]) if params[:category_id].present?
          products = products.where(featured: params[:featured]) if params[:featured].present?
          products = products.where('stock_quantity < ?', params[:low_stock]) if params[:low_stock].present?

          if params[:search].present?
            products = products.where('name ILIKE ? OR description ILIKE ?',
                                     "%#{params[:search]}%", "%#{params[:search]}%")
          end

          products
        end

        def admin_product_summary(product)
          {
            id: product.id,
            name: product.name,
            sku: product.sku,
            price: product.price.to_f.round(2),
            stock_quantity: product.stock_quantity,
            category: product.category&.name,
            active: product.active,
            featured: product.featured,
            created_at: product.created_at.iso8601,
            total_sold: calculate_total_sold(product)
          }
        end

        def admin_product_details(product)
          ProductSerializer.new(product).as_json.merge(
            total_sold: calculate_total_sold(product),
            total_revenue: calculate_product_revenue(product),
            stock_status: stock_status(product)
          )
        end

        def calculate_total_sold(product)
          OrderItem.joins(:order)
                   .where(product_id: product.id)
                   .where(orders: { payment_status: 'paid' })
                   .sum(:quantity)
        end

        def calculate_product_revenue(product)
          OrderItem.joins(:order)
                   .where(product_id: product.id)
                   .where(orders: { payment_status: 'paid' })
                   .sum(:total_price).to_f.round(2)
        end

        def stock_status(product)
          return 'out_of_stock' if product.stock_quantity <= 0
          return 'low_stock' if product.stock_quantity < 10
          'in_stock'
        end

        def generate_products_csv(products)
          require 'csv'

          CSV.generate(headers: true) do |csv|
            csv << ['ID', 'Name', 'SKU', 'Price', 'Stock', 'Category', 'Active', 'Created At']

            products.each do |product|
              csv << [
                product.id,
                product.name,
                product.sku,
                product.price,
                product.stock_quantity,
                product.category&.name,
                product.active,
                product.created_at.strftime('%Y-%m-%d %H:%M:%S')
              ]
            end
          end
        end
      end
    end
  end
end
