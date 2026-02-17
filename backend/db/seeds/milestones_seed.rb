# Milestones Seed Data - Comprehensive Child Developmental Milestones
puts "Creating milestones..."

# Remove old milestones with deprecated categories
old_categories = %w[expressive_language receptive_language articulation social_communication fluency voice feeding_swallowing]
deleted = Milestone.where(category: old_categories).destroy_all
puts "Removed #{deleted.size} old milestones" if deleted.any?

milestones_data = [
  # ============================================================
  # 0-6 Months
  # ============================================================

  # Gross Motor (0-6)
  { title: "Lifts head during tummy time", category: "gross_motor", age_months_min: 0, age_months_max: 6, position: 1 },
  { title: "Pushes up on forearms", category: "gross_motor", age_months_min: 0, age_months_max: 6, position: 2 },
  { title: "Rolls tummy to back (by 5-6 months)", category: "gross_motor", age_months_min: 0, age_months_max: 6, position: 3 },
  { title: "Kicks legs actively", category: "gross_motor", age_months_min: 0, age_months_max: 6, position: 4 },
  { title: "Brings hands to midline", category: "gross_motor", age_months_min: 0, age_months_max: 6, position: 5 },

  # Fine Motor (0-6)
  { title: "Hands mostly fisted (early months)", category: "fine_motor", age_months_min: 0, age_months_max: 6, position: 1 },
  { title: "Grasps finger reflexively", category: "fine_motor", age_months_min: 0, age_months_max: 6, position: 2 },
  { title: "Holds rattle briefly", category: "fine_motor", age_months_min: 0, age_months_max: 6, position: 3 },
  { title: "Reaches for toys", category: "fine_motor", age_months_min: 0, age_months_max: 6, position: 4 },
  { title: "Transfers toy hand-to-hand (by 6 months)", category: "fine_motor", age_months_min: 0, age_months_max: 6, position: 5 },

  # Speech (0-6)
  { title: "Cries differently for needs", category: "speech", age_months_min: 0, age_months_max: 6, position: 1 },
  { title: "Coos (vowel sounds)", category: "speech", age_months_min: 0, age_months_max: 6, position: 2 },
  { title: "Laughs aloud", category: "speech", age_months_min: 0, age_months_max: 6, position: 3 },
  { title: "Squeals with excitement", category: "speech", age_months_min: 0, age_months_max: 6, position: 4 },
  { title: "Begins consonant sounds (ba, da)", category: "speech", age_months_min: 0, age_months_max: 6, position: 5 },

  # Language (0-6)
  { title: "Turns toward sound", category: "language", age_months_min: 0, age_months_max: 6, position: 1 },
  { title: "Recognizes caregiver's voice", category: "language", age_months_min: 0, age_months_max: 6, position: 2 },
  { title: "Responds to name (by 6 months)", category: "language", age_months_min: 0, age_months_max: 6, position: 3 },
  { title: "Stops briefly to \"no\" (tone)", category: "language", age_months_min: 0, age_months_max: 6, position: 4 },
  { title: "Watches speaker's face", category: "language", age_months_min: 0, age_months_max: 6, position: 5 },

  # Cognitive (0-6)
  { title: "Follows moving objects", category: "cognitive", age_months_min: 0, age_months_max: 6, position: 1 },
  { title: "Explores with mouth", category: "cognitive", age_months_min: 0, age_months_max: 6, position: 2 },
  { title: "Shows curiosity", category: "cognitive", age_months_min: 0, age_months_max: 6, position: 3 },
  { title: "Recognizes familiar people", category: "cognitive", age_months_min: 0, age_months_max: 6, position: 4 },
  { title: "Anticipates feeding", category: "cognitive", age_months_min: 0, age_months_max: 6, position: 5 },

  # Social (0-6)
  { title: "Social smile", category: "social", age_months_min: 0, age_months_max: 6, position: 1 },
  { title: "Enjoys peek-a-boo", category: "social", age_months_min: 0, age_months_max: 6, position: 2 },
  { title: "Makes eye contact", category: "social", age_months_min: 0, age_months_max: 6, position: 3 },
  { title: "Responds to smiles", category: "social", age_months_min: 0, age_months_max: 6, position: 4 },
  { title: "Enjoys interaction", category: "social", age_months_min: 0, age_months_max: 6, position: 5 },

  # Emotional (0-6)
  { title: "Calms when comforted", category: "emotional", age_months_min: 0, age_months_max: 6, position: 1 },
  { title: "Expresses joy", category: "emotional", age_months_min: 0, age_months_max: 6, position: 2 },
  { title: "Shows distress when uncomfortable", category: "emotional", age_months_min: 0, age_months_max: 6, position: 3 },
  { title: "Shows excitement", category: "emotional", age_months_min: 0, age_months_max: 6, position: 4 },
  { title: "Begins attachment to caregiver", category: "emotional", age_months_min: 0, age_months_max: 6, position: 5 },

  # ============================================================
  # 6-12 Months
  # ============================================================

  # Gross Motor (6-12)
  { title: "Sits without support", category: "gross_motor", age_months_min: 6, age_months_max: 12, position: 1 },
  { title: "Crawls", category: "gross_motor", age_months_min: 6, age_months_max: 12, position: 2 },
  { title: "Pulls to stand", category: "gross_motor", age_months_min: 6, age_months_max: 12, position: 3 },
  { title: "Cruises furniture", category: "gross_motor", age_months_min: 6, age_months_max: 12, position: 4 },
  { title: "May take first steps", category: "gross_motor", age_months_min: 6, age_months_max: 12, position: 5 },

  # Fine Motor (6-12)
  { title: "Rakes small objects", category: "fine_motor", age_months_min: 6, age_months_max: 12, position: 1 },
  { title: "Develops pincer grasp", category: "fine_motor", age_months_min: 6, age_months_max: 12, position: 2 },
  { title: "Points with index finger", category: "fine_motor", age_months_min: 6, age_months_max: 12, position: 3 },
  { title: "Bangs two objects together", category: "fine_motor", age_months_min: 6, age_months_max: 12, position: 4 },
  { title: "Puts objects in container", category: "fine_motor", age_months_min: 6, age_months_max: 12, position: 5 },

  # Speech (6-12)
  { title: "Canonical babbling (mamama)", category: "speech", age_months_min: 6, age_months_max: 12, position: 1 },
  { title: "Imitates sounds", category: "speech", age_months_min: 6, age_months_max: 12, position: 2 },
  { title: "Uses varied tone", category: "speech", age_months_min: 6, age_months_max: 12, position: 3 },
  { title: "Says 1-2 meaningful words", category: "speech", age_months_min: 6, age_months_max: 12, position: 4 },
  { title: "Vocalizes for attention", category: "speech", age_months_min: 6, age_months_max: 12, position: 5 },

  # Language (6-12)
  { title: "Understands \"no\"", category: "language", age_months_min: 6, age_months_max: 12, position: 1 },
  { title: "Follows simple commands", category: "language", age_months_min: 6, age_months_max: 12, position: 2 },
  { title: "Recognizes common objects", category: "language", age_months_min: 6, age_months_max: 12, position: 3 },
  { title: "Looks when name called", category: "language", age_months_min: 6, age_months_max: 12, position: 4 },
  { title: "Understands simple gestures", category: "language", age_months_min: 6, age_months_max: 12, position: 5 },

  # Cognitive (6-12)
  { title: "Object permanence", category: "cognitive", age_months_min: 6, age_months_max: 12, position: 1 },
  { title: "Imitates actions", category: "cognitive", age_months_min: 6, age_months_max: 12, position: 2 },
  { title: "Searches for hidden toy", category: "cognitive", age_months_min: 6, age_months_max: 12, position: 3 },
  { title: "Explores cause-effect", category: "cognitive", age_months_min: 6, age_months_max: 12, position: 4 },
  { title: "Uses objects appropriately", category: "cognitive", age_months_min: 6, age_months_max: 12, position: 5 },

  # Social (6-12)
  { title: "Stranger anxiety", category: "social", age_months_min: 6, age_months_max: 12, position: 1 },
  { title: "Waves bye", category: "social", age_months_min: 6, age_months_max: 12, position: 2 },
  { title: "Claps", category: "social", age_months_min: 6, age_months_max: 12, position: 3 },
  { title: "Shows preference for caregiver", category: "social", age_months_min: 6, age_months_max: 12, position: 4 },
  { title: "Plays interactive games", category: "social", age_months_min: 6, age_months_max: 12, position: 5 },

  # Emotional (6-12)
  { title: "Separation anxiety", category: "emotional", age_months_min: 6, age_months_max: 12, position: 1 },
  { title: "Expresses fear", category: "emotional", age_months_min: 6, age_months_max: 12, position: 2 },
  { title: "Shows affection", category: "emotional", age_months_min: 6, age_months_max: 12, position: 3 },
  { title: "Displays frustration", category: "emotional", age_months_min: 6, age_months_max: 12, position: 4 },
  { title: "Enjoys praise", category: "emotional", age_months_min: 6, age_months_max: 12, position: 5 },

  # ============================================================
  # 1-2 Years (12-24 months)
  # ============================================================

  # Gross Motor (12-24)
  { title: "Walks independently", category: "gross_motor", age_months_min: 12, age_months_max: 24, position: 1 },
  { title: "Climbs onto furniture", category: "gross_motor", age_months_min: 12, age_months_max: 24, position: 2 },
  { title: "Begins running", category: "gross_motor", age_months_min: 12, age_months_max: 24, position: 3 },
  { title: "Pulls toys while walking", category: "gross_motor", age_months_min: 12, age_months_max: 24, position: 4 },
  { title: "Walks up stairs with help", category: "gross_motor", age_months_min: 12, age_months_max: 24, position: 5 },

  # Fine Motor (12-24)
  { title: "Scribbles", category: "fine_motor", age_months_min: 12, age_months_max: 24, position: 1 },
  { title: "Stacks 2-4 blocks", category: "fine_motor", age_months_min: 12, age_months_max: 24, position: 2 },
  { title: "Uses spoon (spills)", category: "fine_motor", age_months_min: 12, age_months_max: 24, position: 3 },
  { title: "Turns book pages", category: "fine_motor", age_months_min: 12, age_months_max: 24, position: 4 },
  { title: "Removes socks/shoes", category: "fine_motor", age_months_min: 12, age_months_max: 24, position: 5 },

  # Speech (12-24)
  { title: "10-50+ words", category: "speech", age_months_min: 12, age_months_max: 24, position: 1 },
  { title: "2-word phrases by 2 years", category: "speech", age_months_min: 12, age_months_max: 24, position: 2 },
  { title: "Names familiar objects", category: "speech", age_months_min: 12, age_months_max: 24, position: 3 },
  { title: "Imitates new words", category: "speech", age_months_min: 12, age_months_max: 24, position: 4 },
  { title: "Speech ~50% understood", category: "speech", age_months_min: 12, age_months_max: 24, position: 5 },

  # Language (12-24)
  { title: "Follows 2-step commands", category: "language", age_months_min: 12, age_months_max: 24, position: 1 },
  { title: "Points to body parts", category: "language", age_months_min: 12, age_months_max: 24, position: 2 },
  { title: "Understands simple questions", category: "language", age_months_min: 12, age_months_max: 24, position: 3 },
  { title: "Identifies pictures", category: "language", age_months_min: 12, age_months_max: 24, position: 4 },
  { title: "Uses gestures with words", category: "language", age_months_min: 12, age_months_max: 24, position: 5 },

  # Cognitive (12-24)
  { title: "Pretend play", category: "cognitive", age_months_min: 12, age_months_max: 24, position: 1 },
  { title: "Matches similar objects", category: "cognitive", age_months_min: 12, age_months_max: 24, position: 2 },
  { title: "Finds hidden items", category: "cognitive", age_months_min: 12, age_months_max: 24, position: 3 },
  { title: "Sorts basic shapes", category: "cognitive", age_months_min: 12, age_months_max: 24, position: 4 },
  { title: "Understands use of objects", category: "cognitive", age_months_min: 12, age_months_max: 24, position: 5 },

  # Social (12-24)
  { title: "Parallel play", category: "social", age_months_min: 12, age_months_max: 24, position: 1 },
  { title: "Imitates adults", category: "social", age_months_min: 12, age_months_max: 24, position: 2 },
  { title: "Seeks attention", category: "social", age_months_min: 12, age_months_max: 24, position: 3 },
  { title: "Shows possessiveness", category: "social", age_months_min: 12, age_months_max: 24, position: 4 },
  { title: "Enjoys routine", category: "social", age_months_min: 12, age_months_max: 24, position: 5 },

  # Emotional (12-24)
  { title: "Temper tantrums", category: "emotional", age_months_min: 12, age_months_max: 24, position: 1 },
  { title: "Shows independence", category: "emotional", age_months_min: 12, age_months_max: 24, position: 2 },
  { title: "Expresses affection", category: "emotional", age_months_min: 12, age_months_max: 24, position: 3 },
  { title: "Displays frustration with limits", category: "emotional", age_months_min: 12, age_months_max: 24, position: 4 },
  { title: "Begins empathy", category: "emotional", age_months_min: 12, age_months_max: 24, position: 5 },

  # ============================================================
  # 2-3 Years (24-36 months)
  # ============================================================

  # Gross Motor (24-36)
  { title: "Runs well", category: "gross_motor", age_months_min: 24, age_months_max: 36, position: 1 },
  { title: "Jumps with both feet", category: "gross_motor", age_months_min: 24, age_months_max: 36, position: 2 },
  { title: "Kicks ball", category: "gross_motor", age_months_min: 24, age_months_max: 36, position: 3 },
  { title: "Climbs playground equipment", category: "gross_motor", age_months_min: 24, age_months_max: 36, position: 4 },
  { title: "Walks up stairs alternating feet", category: "gross_motor", age_months_min: 24, age_months_max: 36, position: 5 },

  # Fine Motor (24-36)
  { title: "Builds 6-block tower", category: "fine_motor", age_months_min: 24, age_months_max: 36, position: 1 },
  { title: "Turns doorknob", category: "fine_motor", age_months_min: 24, age_months_max: 36, position: 2 },
  { title: "Copies vertical line", category: "fine_motor", age_months_min: 24, age_months_max: 36, position: 3 },
  { title: "Uses fork", category: "fine_motor", age_months_min: 24, age_months_max: 36, position: 4 },
  { title: "Strings large beads", category: "fine_motor", age_months_min: 24, age_months_max: 36, position: 5 },

  # Speech (24-36)
  { title: "3-4 word sentences", category: "speech", age_months_min: 24, age_months_max: 36, position: 1 },
  { title: "Asks \"what/where\"", category: "speech", age_months_min: 24, age_months_max: 36, position: 2 },
  { title: "Names colors", category: "speech", age_months_min: 24, age_months_max: 36, position: 3 },
  { title: "Speech ~75% clear", category: "speech", age_months_min: 24, age_months_max: 36, position: 4 },
  { title: "Uses pronouns", category: "speech", age_months_min: 24, age_months_max: 36, position: 5 },

  # Language (24-36)
  { title: "Follows 2-3 step commands", category: "language", age_months_min: 24, age_months_max: 36, position: 1 },
  { title: "Understands prepositions", category: "language", age_months_min: 24, age_months_max: 36, position: 2 },
  { title: "Answers simple questions", category: "language", age_months_min: 24, age_months_max: 36, position: 3 },
  { title: "Identifies objects by function", category: "language", age_months_min: 24, age_months_max: 36, position: 4 },
  { title: "Uses plurals", category: "language", age_months_min: 24, age_months_max: 36, position: 5 },

  # Cognitive (24-36)
  { title: "Sorts by color/shape", category: "cognitive", age_months_min: 24, age_months_max: 36, position: 1 },
  { title: "Understands big/small", category: "cognitive", age_months_min: 24, age_months_max: 36, position: 2 },
  { title: "Solves simple puzzles", category: "cognitive", age_months_min: 24, age_months_max: 36, position: 3 },
  { title: "Understands cause-effect", category: "cognitive", age_months_min: 24, age_months_max: 36, position: 4 },
  { title: "Engages in pretend sequences", category: "cognitive", age_months_min: 24, age_months_max: 36, position: 5 },

  # Social (24-36)
  { title: "Takes turns briefly", category: "social", age_months_min: 24, age_months_max: 36, position: 1 },
  { title: "Plays beside peers", category: "social", age_months_min: 24, age_months_max: 36, position: 2 },
  { title: "Imitates friends", category: "social", age_months_min: 24, age_months_max: 36, position: 3 },
  { title: "Follows simple rules", category: "social", age_months_min: 24, age_months_max: 36, position: 4 },
  { title: "Shares occasionally", category: "social", age_months_min: 24, age_months_max: 36, position: 5 },

  # Emotional (24-36)
  { title: "Expresses wide emotions", category: "emotional", age_months_min: 24, age_months_max: 36, position: 1 },
  { title: "Shows fear", category: "emotional", age_months_min: 24, age_months_max: 36, position: 2 },
  { title: "Says \"mine\"", category: "emotional", age_months_min: 24, age_months_max: 36, position: 3 },
  { title: "Tests limits", category: "emotional", age_months_min: 24, age_months_max: 36, position: 4 },
  { title: "Shows pride", category: "emotional", age_months_min: 24, age_months_max: 36, position: 5 },

  # ============================================================
  # 3-5 Years (36-60 months)
  # ============================================================

  # Gross Motor (36-60)
  { title: "Hops on one foot", category: "gross_motor", age_months_min: 36, age_months_max: 60, position: 1 },
  { title: "Pedals tricycle", category: "gross_motor", age_months_min: 36, age_months_max: 60, position: 2 },
  { title: "Throws and catches ball", category: "gross_motor", age_months_min: 36, age_months_max: 60, position: 3 },
  { title: "Skips (by 5)", category: "gross_motor", age_months_min: 36, age_months_max: 60, position: 4 },
  { title: "Balances briefly", category: "gross_motor", age_months_min: 36, age_months_max: 60, position: 5 },

  # Fine Motor (36-60)
  { title: "Copies circle/square", category: "fine_motor", age_months_min: 36, age_months_max: 60, position: 1 },
  { title: "Uses scissors", category: "fine_motor", age_months_min: 36, age_months_max: 60, position: 2 },
  { title: "Draws person (3-5 parts)", category: "fine_motor", age_months_min: 36, age_months_max: 60, position: 3 },
  { title: "Writes some letters", category: "fine_motor", age_months_min: 36, age_months_max: 60, position: 4 },
  { title: "Colors within lines", category: "fine_motor", age_months_min: 36, age_months_max: 60, position: 5 },

  # Speech (36-60)
  { title: "4-6 word sentences", category: "speech", age_months_min: 36, age_months_max: 60, position: 1 },
  { title: "Mostly clear speech", category: "speech", age_months_min: 36, age_months_max: 60, position: 2 },
  { title: "Tells simple stories", category: "speech", age_months_min: 36, age_months_max: 60, position: 3 },
  { title: "Uses correct grammar mostly", category: "speech", age_months_min: 36, age_months_max: 60, position: 4 },
  { title: "Asks many questions", category: "speech", age_months_min: 36, age_months_max: 60, position: 5 },

  # Language (36-60)
  { title: "Answers WH questions", category: "language", age_months_min: 36, age_months_max: 60, position: 1 },
  { title: "Understands time words", category: "language", age_months_min: 36, age_months_max: 60, position: 2 },
  { title: "Uses descriptive words", category: "language", age_months_min: 36, age_months_max: 60, position: 3 },
  { title: "Follows complex directions", category: "language", age_months_min: 36, age_months_max: 60, position: 4 },
  { title: "Retells events", category: "language", age_months_min: 36, age_months_max: 60, position: 5 },

  # Cognitive (36-60)
  { title: "Counts 5-10 objects", category: "cognitive", age_months_min: 36, age_months_max: 60, position: 1 },
  { title: "Recognizes letters", category: "cognitive", age_months_min: 36, age_months_max: 60, position: 2 },
  { title: "Understands sequencing", category: "cognitive", age_months_min: 36, age_months_max: 60, position: 3 },
  { title: "Knows basic colors/shapes", category: "cognitive", age_months_min: 36, age_months_max: 60, position: 4 },
  { title: "Engages in imaginative play", category: "cognitive", age_months_min: 36, age_months_max: 60, position: 5 },

  # Social (36-60)
  { title: "Cooperative play", category: "social", age_months_min: 36, age_months_max: 60, position: 1 },
  { title: "Follows rules", category: "social", age_months_min: 36, age_months_max: 60, position: 2 },
  { title: "Has favorite friends", category: "social", age_months_min: 36, age_months_max: 60, position: 3 },
  { title: "Shares more consistently", category: "social", age_months_min: 36, age_months_max: 60, position: 4 },
  { title: "Participates in group games", category: "social", age_months_min: 36, age_months_max: 60, position: 5 },

  # Emotional (36-60)
  { title: "Better self-control", category: "emotional", age_months_min: 36, age_months_max: 60, position: 1 },
  { title: "Expresses feelings verbally", category: "emotional", age_months_min: 36, age_months_max: 60, position: 2 },
  { title: "Understands others' feelings", category: "emotional", age_months_min: 36, age_months_max: 60, position: 3 },
  { title: "Manages minor conflicts", category: "emotional", age_months_min: 36, age_months_max: 60, position: 4 },
  { title: "Shows confidence", category: "emotional", age_months_min: 36, age_months_max: 60, position: 5 },

  # ============================================================
  # 5-8 Years (60-96 months)
  # ============================================================

  # Gross Motor (60-96)
  { title: "Skips smoothly", category: "gross_motor", age_months_min: 60, age_months_max: 96, position: 1 },
  { title: "Rides bicycle", category: "gross_motor", age_months_min: 60, age_months_max: 96, position: 2 },
  { title: "Participates in sports", category: "gross_motor", age_months_min: 60, age_months_max: 96, position: 3 },
  { title: "Good coordination", category: "gross_motor", age_months_min: 60, age_months_max: 96, position: 4 },
  { title: "Improved balance", category: "gross_motor", age_months_min: 60, age_months_max: 96, position: 5 },

  # Fine Motor (60-96)
  { title: "Writes sentences", category: "fine_motor", age_months_min: 60, age_months_max: 96, position: 1 },
  { title: "Draws detailed pictures", category: "fine_motor", age_months_min: 60, age_months_max: 96, position: 2 },
  { title: "Cuts neatly", category: "fine_motor", age_months_min: 60, age_months_max: 96, position: 3 },
  { title: "Uses tools accurately", category: "fine_motor", age_months_min: 60, age_months_max: 96, position: 4 },
  { title: "Ties shoelaces", category: "fine_motor", age_months_min: 60, age_months_max: 96, position: 5 },

  # Speech (60-96)
  { title: "Fully intelligible", category: "speech", age_months_min: 60, age_months_max: 96, position: 1 },
  { title: "Uses complex sentences", category: "speech", age_months_min: 60, age_months_max: 96, position: 2 },
  { title: "Clear articulation", category: "speech", age_months_min: 60, age_months_max: 96, position: 3 },
  { title: "Adjusts tone for situation", category: "speech", age_months_min: 60, age_months_max: 96, position: 4 },
  { title: "Explains ideas clearly", category: "speech", age_months_min: 60, age_months_max: 96, position: 5 },

  # Language (60-96)
  { title: "Understands idioms", category: "language", age_months_min: 60, age_months_max: 96, position: 1 },
  { title: "Tells detailed stories", category: "language", age_months_min: 60, age_months_max: 96, position: 2 },
  { title: "Follows multi-step instructions", category: "language", age_months_min: 60, age_months_max: 96, position: 3 },
  { title: "Uses advanced vocabulary", category: "language", age_months_min: 60, age_months_max: 96, position: 4 },
  { title: "Engages in conversation", category: "language", age_months_min: 60, age_months_max: 96, position: 5 },

  # Cognitive (60-96)
  { title: "Logical reasoning", category: "cognitive", age_months_min: 60, age_months_max: 96, position: 1 },
  { title: "Solves math problems", category: "cognitive", age_months_min: 60, age_months_max: 96, position: 2 },
  { title: "Reads paragraphs", category: "cognitive", age_months_min: 60, age_months_max: 96, position: 3 },
  { title: "Understands time concepts", category: "cognitive", age_months_min: 60, age_months_max: 96, position: 4 },
  { title: "Plans tasks independently", category: "cognitive", age_months_min: 60, age_months_max: 96, position: 5 },

  # Social (60-96)
  { title: "Teamwork skills", category: "social", age_months_min: 60, age_months_max: 96, position: 1 },
  { title: "Understands fairness", category: "social", age_months_min: 60, age_months_max: 96, position: 2 },
  { title: "Forms close friendships", category: "social", age_months_min: 60, age_months_max: 96, position: 3 },
  { title: "Follows classroom rules", category: "social", age_months_min: 60, age_months_max: 96, position: 4 },
  { title: "Resolves conflicts verbally", category: "social", age_months_min: 60, age_months_max: 96, position: 5 },

  # Emotional (60-96)
  { title: "Controls impulses", category: "emotional", age_months_min: 60, age_months_max: 96, position: 1 },
  { title: "Builds self-esteem", category: "emotional", age_months_min: 60, age_months_max: 96, position: 2 },
  { title: "Understands responsibility", category: "emotional", age_months_min: 60, age_months_max: 96, position: 3 },
  { title: "Manages frustration", category: "emotional", age_months_min: 60, age_months_max: 96, position: 4 },
  { title: "Shows empathy", category: "emotional", age_months_min: 60, age_months_max: 96, position: 5 },
]

milestones_data.each do |attrs|
  Milestone.find_or_create_by!(title: attrs[:title], category: attrs[:category]) do |m|
    m.assign_attributes(
      attrs.merge(
        active: true,
        indicators: [],
        tips: []
      )
    )
  end
end

puts "Milestones: #{Milestone.count}"
