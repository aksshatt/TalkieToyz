class RefreshToken < ApplicationRecord
  belongs_to :user

  validates :token_digest, presence: true, uniqueness: true
  validates :expires_at, presence: true

  scope :active, -> { where('expires_at > ?', Time.current) }

  def self.digest(raw_token)
    Digest::SHA256.hexdigest(raw_token)
  end

  def self.find_by_raw(raw_token)
    active.find_by(token_digest: digest(raw_token))
  end

  def self.store!(user:, raw_token:, expires_at:)
    create!(
      user: user,
      token_digest: digest(raw_token),
      expires_at: expires_at
    )
  rescue ActiveRecord::RecordNotUnique
    nil
  end

  def self.revoke!(raw_token)
    where(token_digest: digest(raw_token)).delete_all
  end

  def self.revoke_all_for!(user)
    where(user: user).delete_all
  end

  def self.purge_expired!
    where('expires_at <= ?', Time.current).delete_all
  end
end
