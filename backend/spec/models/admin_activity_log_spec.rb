require 'rails_helper'

RSpec.describe AdminActivityLog, type: :model do
  describe 'associations' do
    it { should belong_to(:user) }
  end

  describe 'validations' do
    it { should validate_presence_of(:action) }
  end

  describe 'scopes' do
    let!(:user1) { create(:user, role: :admin) }
    let!(:user2) { create(:user, role: :admin) }
    let!(:log1) { create(:admin_activity_log, user: user1, action: 'create', resource_type: 'Product', created_at: 2.days.ago) }
    let!(:log2) { create(:admin_activity_log, user: user2, action: 'update', resource_type: 'Order', created_at: 1.day.ago) }
    let!(:log3) { create(:admin_activity_log, user: user1, action: 'delete', resource_type: 'Product', created_at: Time.current) }

    describe '.recent' do
      it 'returns logs ordered by created_at desc' do
        expect(AdminActivityLog.recent).to eq([log3, log2, log1])
      end
    end

    describe '.by_user' do
      it 'returns logs for a specific user' do
        expect(AdminActivityLog.by_user(user1.id)).to contain_exactly(log1, log3)
      end
    end

    describe '.by_action' do
      it 'returns logs for a specific action' do
        expect(AdminActivityLog.by_action('create')).to contain_exactly(log1)
      end
    end

    describe '.by_resource' do
      it 'returns logs for a specific resource type' do
        expect(AdminActivityLog.by_resource('Product')).to contain_exactly(log1, log3)
      end
    end
  end

  describe 'ACTIONS constant' do
    it 'includes expected actions' do
      expect(AdminActivityLog::ACTIONS).to include(
        'create', 'update', 'delete', 'view',
        'bulk_update', 'bulk_delete',
        'update_status', 'export',
        'login', 'logout'
      )
    end
  end

  describe 'factory' do
    it 'creates a valid admin activity log' do
      log = build(:admin_activity_log)
      expect(log).to be_valid
    end

    it 'creates a product_create log' do
      log = create(:admin_activity_log, :product_create)
      expect(log.action).to eq('create')
      expect(log.resource_type).to eq('Product')
      expect(log.details).to have_key('name')
    end

    it 'creates an order_update log' do
      log = create(:admin_activity_log, :order_update)
      expect(log.action).to eq('update_status')
      expect(log.resource_type).to eq('Order')
      expect(log.details['order_number']).to eq('ORD-123')
    end

    it 'creates a bulk_update log' do
      log = create(:admin_activity_log, :bulk_update)
      expect(log.action).to eq('bulk_update')
      expect(log.resource_id).to be_nil
      expect(log.details['count']).to eq(5)
    end

    it 'creates an export log' do
      log = create(:admin_activity_log, :export)
      expect(log.action).to eq('export')
      expect(log.details['format']).to eq('csv')
    end
  end

  describe 'attributes' do
    let(:log) { create(:admin_activity_log, :order_update) }

    it 'stores JSONB details' do
      expect(log.details).to be_a(Hash)
      expect(log.details['old_status']).to eq('pending')
      expect(log.details['new_status']).to eq('shipped')
    end

    it 'captures request metadata' do
      expect(log.ip_address).to be_present
      expect(log.user_agent).to be_present
    end
  end
end
