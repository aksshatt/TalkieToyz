class AddUniqueIndexToMilestoneAchievements < ActiveRecord::Migration[7.1]
  def change
    # Back the uniqueness validation on (milestone_id, child_profile_id)
    # with a DB-level unique index so concurrent creates can't both pass
    # the existence check.
    return if index_exists?(:milestone_achievements, [:milestone_id, :child_profile_id], unique: true)

    add_index :milestone_achievements,
              [:milestone_id, :child_profile_id],
              unique: true,
              where: 'child_profile_id IS NOT NULL',
              name: 'index_milestone_achievements_on_milestone_child_unique'
  end
end
