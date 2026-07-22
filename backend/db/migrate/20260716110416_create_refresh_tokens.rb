class CreateRefreshTokens < ActiveRecord::Migration[7.1]
  def change
    create_table :refresh_tokens do |t|
      t.references :user, null: false, foreign_key: true
      t.string :token_digest, null: false
      t.datetime :expires_at, null: false
    end
    # unique so duplicate inserts are rejected at DB level
    add_index :refresh_tokens, :token_digest, unique: true
    # for fast cleanup of expired tokens
    add_index :refresh_tokens, :expires_at
  end
end
