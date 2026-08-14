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
                              .per([[params[:per_page].to_i, 1].max, 100].min.nonzero? || 20)

          product_ids = @products.map(&:id)
          sold_by_product = OrderItem.joins(:order)
                                     .where(product_id: product_ids, orders: { payment_status: 'paid' })
                                     .group(:product_id)
                                     .sum(:quantity)

          render_success(
            {
              products: @products.map { |p| admin_product_summary(p, sold_by_product) },
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
              admin_product_details(@product.reload),
              'Product created successfully',
              status: :created
            )
          else
            render_error('Failed to create product', @product.errors.full_messages)
          end
        end

        # PATCH /api/v1/admin/products/:id
        def update
          # Remove specific images if requested
          if params[:remove_image_ids].present?
            images_to_remove = @product.images.where(id: params[:remove_image_ids])
            images_to_remove.each(&:purge_later)
          end

          # Separate new images so has_many_attached doesn't replace existing attachments
          attrs = product_params.to_h
          new_images = attrs.delete('images') || attrs.delete(:images)

          if @product.update(attrs)
            if new_images.present?
              Array(new_images).each { |img| @product.images.attach(img) if img.present? }
            end

            log_activity('update', 'Product', @product.id, { name: @product.name })
            render_success(
              admin_product_details(@product.reload),
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
          product_ids = Array(params[:product_ids]).map(&:to_i).select(&:positive?)
          bulk_action = params[:bulk_action].to_s

          if product_ids.empty?
            return render_error('No products selected', nil, status: :bad_request)
          end

          case bulk_action
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

          log_activity('bulk_update', 'Product', nil, { action: bulk_action, count: product_ids.size })
          render_success(nil, message)
        end

        # GET /api/v1/admin/products/export
        def export
          @products = Product.joins('LEFT JOIN categories ON categories.id = products.category_id')
                             .select('products.*, categories.name as category_name')
          @products = apply_filters(@products)

          headers['Content-Type'] = 'text/csv'
          headers['Content-Disposition'] = "attachment; filename=\"products_#{Date.current}.csv\""
          headers.delete('Content-Length')
          headers['X-Accel-Buffering'] = 'no'
          self.response_body = products_csv_stream(@products)
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
            :featured, :active, :weight_kg, :hsn_code,
            specifications: {}, speech_goal_ids: [], images: [],
            dimensions_cm: [:length, :breadth, :height]
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

        def admin_product_summary(product, sold_by_product = nil)
          total_sold = sold_by_product ? sold_by_product[product.id].to_i : calculate_total_sold(product)
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
            total_sold: total_sold,
            image_url: safe_image_url(product.images.first),
            image_urls: product.images.attached? ? product.images.map { |img| { id: img.id, url: safe_image_url(img) } }.compact : []
          }
        end

        def safe_image_url(image)
          return nil unless image&.attached?
          host = ENV.fetch('BACKEND_URL', 'https://talkietoys-backend.onrender.com')
          Rails.application.routes.url_helpers.rails_blob_url(image, host: host)
        rescue => e
          Rails.logger.error("Failed to generate image URL: #{e.message}\n#{e.backtrace.first(3).join("\n")}")
          nil
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

        def products_csv_stream(scope)
          Enumerator.new do |y|
            y << CSV.generate_line(['ID', 'Name', 'SKU', 'Price', 'Stock', 'Category', 'Active', 'Created At'])
            scope.find_each(batch_size: 500) do |product|
              y << CSV.generate_line([
                product.id,
                product.name,
                product.sku,
                product.price,
                product.stock_quantity,
                product.category_name,
                product.active,
                product.created_at.strftime('%Y-%m-%d %H:%M:%S')
              ])
            end
          end
        end
      end
    end
  end
end
