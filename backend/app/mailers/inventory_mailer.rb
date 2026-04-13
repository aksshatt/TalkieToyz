class InventoryMailer < ApplicationMailer
  # Send low-stock alert to admin
  def low_stock_alert(low_stock_products)
    @products = low_stock_products
    @threshold = ENV.fetch('LOW_STOCK_THRESHOLD', 5).to_i
    admin_email = ENV.fetch('ADMIN_EMAIL', ENV['DEFAULT_EMAIL_FROM'] || 'admin@talkietoyz.shop')

    mail(
      to: admin_email,
      subject: "⚠️ Low Stock Alert – #{@products.size} product(s) need restocking"
    )
  end
end
