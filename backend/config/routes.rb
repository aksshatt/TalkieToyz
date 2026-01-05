Rails.application.routes.draw do
  # Devise routes will be added after migrations
  # devise_for :users

  # Health check endpoint
  get "health" => "health#index"

  # API versioning
  namespace :api do
    namespace :v1 do
      # Authentication
      post 'auth/signup', to: 'auth#signup'
      post 'auth/login', to: 'auth#login'
      delete 'auth/logout', to: 'auth#logout'
      get 'auth/me', to: 'auth#me'
      patch 'auth/profile', to: 'auth#update_profile'

      # Products (full CRUD)
      resources :products, param: :id do
        member do
          get :related
        end
        # Reviews (nested under products)
        resources :reviews, only: [:index, :create]
      end

      # Reviews (standalone for update/delete/helpful)
      resources :reviews, only: [:update, :destroy] do
        member do
          post :helpful, action: :mark_helpful
          delete :helpful, action: :unmark_helpful
        end
      end

      # Categories
      resources :categories, only: [:index, :show], param: :id

      # Speech Goals
      resources :speech_goals, only: [:index, :show], param: :id

      # Assessments
      resources :assessments, only: [:index, :show], param: :id do
        member do
          post :submit
        end
      end

      # Assessment Results
      resources :assessment_results, only: [:show] do
        member do
          get :download_pdf
        end
      end

      # Milestones
      resources :milestones, only: [:index, :show]

      # Blog Posts
      resources :blog_posts, only: [:index, :show], param: :id do
        member do
          post :add_comment
        end
      end

      # Resources
      resources :resources, only: [:index, :show], param: :id do
        member do
          get :download
        end
      end
      get 'resource_categories', to: 'resources#categories'

      # FAQs (public)
      resources :faqs, only: [:index, :show] do
        collection do
          get :categories
        end
      end

      # Contact Submissions (public)
      resources :contact_submissions, only: [:create]

      # Appointments (public - create only)
      resources :appointments, only: [:create]

      # Site Contents (CMS - public)
      get 'site_contents/:page', to: 'site_contents#show', as: :site_content_page
      get 'site_contents/:page/keys', to: 'site_contents#keys', as: :site_content_keys

      # Newsletter Subscriptions
      resources :newsletter_subscriptions, only: [:create] do
        collection do
          get 'confirm/:token', action: :confirm, as: :confirm
          delete 'unsubscribe/:token', action: :unsubscribe, as: :unsubscribe
        end
      end

      # Cart (authenticated)
      resource :cart, only: [:show] do
        post :add_item, path: 'items'
        patch :update_item, path: 'items/:id'
        delete :remove_item, path: 'items/:id'
        delete :clear
      end

      # Orders (authenticated)
      resources :orders, only: [:index, :show, :create, :update] do
        member do
          post :cancel
          post :retry_payment
          post :create_razorpay_order
          post 'payment/verify', to: 'orders#verify_payment'
        end
      end

      # Addresses (authenticated)
      resources :addresses, only: [:index, :show, :create, :update, :destroy] do
        member do
          post :set_default
        end
        collection do
          get 'pincode/:pincode', action: :pincode_lookup, as: :pincode_lookup
        end
      end

      # Webhooks (public - no authentication)
      namespace :webhooks do
        post 'razorpay', to: 'webhooks#razorpay'
        post 'shiprocket', to: 'webhooks#shiprocket'
      end

      # Shipping Rates (public)
      resources :shipping_rates, only: [:create]

      # Coupons (public - validate endpoint)
      resources :coupons, only: [] do
        collection do
          post :validate
        end
      end

      # Admin Routes (require admin role)
      namespace :admin do
        # Dashboard
        get 'dashboard', to: 'dashboard#index'

        # Products Management
        resources :products do
          collection do
            post :bulk_update
            get :export
          end
        end

        # Orders Management
        resources :orders, only: [:index, :show] do
          member do
            patch :update_status
            post :refund
            post :create_shipment
            post :cancel_shipment
            get :shipping_label
          end
          collection do
            post :bulk_update_status
            get :export
            get :statistics
          end
        end

        # Customers Management
        resources :customers, only: [:index, :show, :update, :destroy] do
          collection do
            get :export
            get :statistics
          end
        end

        # Analytics
        get 'analytics', to: 'analytics#index'
        get 'analytics/sales_by_category', to: 'analytics#sales_by_category'
        get 'analytics/popular_products', to: 'analytics#popular_products'
        get 'analytics/revenue_trends', to: 'analytics#revenue_trends'
        get 'analytics/customer_demographics', to: 'analytics#customer_demographics'

        # Blog Posts Management
        resources :blog_posts, param: :id do
          member do
            post :approve_comment
          end
        end

        # Resources Management
        resources :resources, param: :id

        # Reviews Management
        resources :reviews, only: [:index, :show, :destroy] do
          member do
            post :approve
            post :reject
            post :add_response
          end
          collection do
            get :statistics
          end
        end

        # FAQs Management
        resources :faqs

        # Contact Submissions Management
        resources :contact_submissions, only: [:index, :show, :update] do
          collection do
            get :statistics
          end
        end

        # Appointments Management
        resources :appointments, only: [:index, :show, :update]

        # Site Contents Management (CMS)
        resources :site_contents do
          collection do
            get :pages
          end
        end
      end
    end
  end
end
