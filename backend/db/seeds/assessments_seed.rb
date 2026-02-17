# Assessments Seed Data
puts "Creating assessments..."

# Remove old assessments that no longer match our age ranges
Assessment.where.not(slug: [
  "screening-1-2-years",
  "screening-2-3-years",
  "screening-3-4-years",
  "screening-4-5-years",
  "screening-5-6-years",
  "screening-6-7-years",
  "screening-7-8-years"
]).update_all(active: false, deleted_at: Time.current)

# ============================================================
# Assessment 1: 1–2 Years Screening
# ============================================================
Assessment.find_or_create_by!(slug: "screening-1-2-years") do |a|
  a.title = "Developmental Screening (1–2 Years)"
  a.description = "A comprehensive developmental screening for toddlers aged 1–2 years covering gross motor, fine motor, speech, language, cognitive, social, and emotional development."
  a.min_age = 12
  a.max_age = 24
  a.active = true
  a.version = 1
  a.questions = [
    # Gross Motor
    { key: "gm1", text: "Does your child walk independently?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },
    { key: "gm2", text: "Can your child climb onto furniture?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },
    { key: "gm3", text: "Does your child try to run (even if unsteady)?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },
    { key: "gm4", text: "Can your child walk upstairs with support?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },
    { key: "gm5", text: "Does your child squat to pick up toys and stand back up?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },

    # Fine Motor
    { key: "fm1", text: "Does your child scribble with a crayon?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },
    { key: "fm2", text: "Can your child stack 2–4 blocks?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },
    { key: "fm3", text: "Does your child use a spoon (even if messy)?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },
    { key: "fm4", text: "Can your child turn book pages (thick pages)?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },
    { key: "fm5", text: "Does your child point with one finger to show interest?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },

    # Speech (Expressive)
    { key: "sp1", text: "Does your child say at least 10–20 words?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },
    { key: "sp2", text: "Does your child try to imitate new words?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },
    { key: "sp3", text: "Does your child combine two words (e.g., \"mumma come\")?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },
    { key: "sp4", text: "Does your child name familiar objects?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },
    { key: "sp5", text: "Is speech understandable to familiar people?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },

    # Language (Receptive)
    { key: "lg1", text: "Does your child follow simple commands (\"Give me the ball\")?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },
    { key: "lg2", text: "Can your child point to body parts when asked?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },
    { key: "lg3", text: "Does your child understand simple questions (\"Where is papa?\")?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },
    { key: "lg4", text: "Does your child respond to their name consistently?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },
    { key: "lg5", text: "Does your child understand daily routine words (milk, bath, bye)?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },

    # Cognitive
    { key: "cg1", text: "Does your child engage in pretend play (feeding doll, talking on toy phone)?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },
    { key: "cg2", text: "Can your child match similar objects or shapes?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },
    { key: "cg3", text: "Does your child search for a hidden toy?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },
    { key: "cg4", text: "Can your child identify familiar objects in pictures?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },
    { key: "cg5", text: "Does your child use objects appropriately (brush for hair)?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },

    # Social
    { key: "sc1", text: "Does your child make eye contact during interaction?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },
    { key: "sc2", text: "Does your child show or bring objects to you?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },
    { key: "sc3", text: "Does your child imitate your actions (clapping, waving)?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },
    { key: "sc4", text: "Does your child play beside other children (parallel play)?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },
    { key: "sc5", text: "Does your child seek attention from caregivers?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },

    # Emotional / Behavior
    { key: "em1", text: "Does your child show affection to familiar people?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } },
    { key: "em2", text: "Does your child express different emotions (happy, angry, upset)?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } },
    { key: "em3", text: "Does your child get upset when separated from caregiver?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } },
    { key: "em4", text: "Does your child show frustration when unable to communicate?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } },
    { key: "em5", text: "Does your child calm down with comfort?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } }
  ]
  a.scoring_rules = [
    { min_score: 0, max_score: 105, level: "needs_attention", label: "Needs Attention" },
    { min_score: 106, max_score: 210, level: "developing", label: "Developing" },
    { min_score: 211, max_score: 280, level: "on_track", label: "On Track" },
    { min_score: 281, max_score: 350, level: "advanced", label: "Advanced" }
  ]
  a.recommendations = [
    {
      level: "needs_attention",
      message: "Your child may benefit from early intervention services. We recommend consulting a pediatrician or speech-language pathologist for further evaluation.",
      product_categories: ["speech-therapy-tools", "early-language-toys"],
      tips: [
        "Talk to your child frequently throughout the day",
        "Name objects and actions as you do them",
        "Read picture books together daily",
        "Use simple, clear words and short sentences",
        "Give your child time to respond"
      ],
      red_flags: [
        "No words by 15–18 months",
        "No two-word combinations by 24 months",
        "Poor eye contact",
        "Does not respond to name",
        "Loss of previously acquired skills"
      ]
    },
    {
      level: "developing",
      message: "Your child is making progress! Continue encouraging development with play and interaction.",
      product_categories: ["language-development-toys", "books"],
      tips: [
        "Expand on your child's words (if they say 'ball', you say 'yes, big ball!')",
        "Sing songs and nursery rhymes together",
        "Play simple games like peek-a-boo and pat-a-cake",
        "Narrate daily activities",
        "Encourage pointing and gestures"
      ]
    },
    {
      level: "on_track",
      message: "Great job! Your child's development is progressing well across all areas.",
      product_categories: ["advanced-language-toys", "interactive-books"],
      tips: [
        "Introduce new vocabulary through play",
        "Start teaching simple concepts (colors, shapes, sizes)",
        "Encourage pretend play",
        "Ask simple questions",
        "Model proper grammar"
      ]
    },
    {
      level: "advanced",
      message: "Excellent! Your child is showing advanced developmental skills for their age.",
      product_categories: ["advanced-learning-toys", "creative-play"],
      tips: [
        "Challenge with more complex language",
        "Introduce early literacy activities",
        "Encourage storytelling",
        "Teach simple problem-solving through play",
        "Expand vocabulary with varied experiences"
      ]
    }
  ]
end

# ============================================================
# Assessment 2: 2–3 Years Screening
# ============================================================
Assessment.find_or_create_by!(slug: "screening-2-3-years") do |a|
  a.title = "Developmental Screening (2–3 Years)"
  a.description = "A comprehensive developmental screening for children aged 2–3 years covering gross motor, fine motor, speech, language, cognitive, social, and emotional development."
  a.min_age = 24
  a.max_age = 36
  a.active = true
  a.version = 1
  a.questions = [
    # Gross Motor
    { key: "gm1", text: "Does your child run without frequently falling?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },
    { key: "gm2", text: "Can your child jump with both feet off the ground?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },
    { key: "gm3", text: "Does your child kick a ball forward?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },
    { key: "gm4", text: "Can your child climb onto and down from furniture independently?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },
    { key: "gm5", text: "Does your child walk upstairs alternating feet (with support)?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },

    # Fine Motor
    { key: "fm1", text: "Can your child build a tower of 6 or more blocks?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },
    { key: "fm2", text: "Does your child turn doorknobs or unscrew lids?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },
    { key: "fm3", text: "Can your child copy a vertical line?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },
    { key: "fm4", text: "Does your child use a spoon and fork with less spilling?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },
    { key: "fm5", text: "Can your child string large beads?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },

    # Speech (Expressive)
    { key: "sp1", text: "Does your child use 3–4-word sentences?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },
    { key: "sp2", text: "Is your child's speech understandable to family members (~75%)?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },
    { key: "sp3", text: "Does your child ask simple questions (what/where)?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },
    { key: "sp4", text: "Does your child name common objects and pictures?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },
    { key: "sp5", text: "Does your child use pronouns (I, me, you)?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },

    # Language (Receptive)
    { key: "lg1", text: "Can your child follow 2–3 step instructions?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },
    { key: "lg2", text: "Does your child understand simple prepositions (in, on, under)?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },
    { key: "lg3", text: "Can your child identify objects by function (\"What do we eat with?\")?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },
    { key: "lg4", text: "Does your child understand simple WH-questions?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },
    { key: "lg5", text: "Does your child respond appropriately to simple conversations?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },

    # Cognitive
    { key: "cg1", text: "Can your child sort objects by color or shape?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },
    { key: "cg2", text: "Does your child complete simple puzzles (3–4 pieces)?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },
    { key: "cg3", text: "Does your child engage in pretend play sequences (feeding doll, cooking)?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },
    { key: "cg4", text: "Does your child understand concepts like big/small?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },
    { key: "cg5", text: "Can your child match similar pictures?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },

    # Social
    { key: "sc1", text: "Does your child play beside or with other children?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },
    { key: "sc2", text: "Can your child take turns briefly?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },
    { key: "sc3", text: "Does your child imitate peers?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },
    { key: "sc4", text: "Does your child follow simple game rules?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },
    { key: "sc5", text: "Does your child seek comfort from caregivers?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },

    # Emotional / Behavior
    { key: "em1", text: "Does your child express different emotions clearly?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } },
    { key: "em2", text: "Does your child show independence (\"I do it\")?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } },
    { key: "em3", text: "Can your child tolerate small changes in routine?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } },
    { key: "em4", text: "Does your child show frustration appropriately?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } },
    { key: "em5", text: "Can your child calm down with reassurance?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } }
  ]
  a.scoring_rules = [
    { min_score: 0, max_score: 105, level: "needs_attention", label: "Needs Attention" },
    { min_score: 106, max_score: 210, level: "developing", label: "Developing" },
    { min_score: 211, max_score: 280, level: "on_track", label: "On Track" },
    { min_score: 281, max_score: 350, level: "advanced", label: "Advanced" }
  ]
  a.recommendations = [
    {
      level: "needs_attention",
      message: "Your child may benefit from professional evaluation. Consider consulting a pediatrician or developmental specialist.",
      product_categories: ["speech-therapy-tools", "language-building-games"],
      tips: [
        "Read books together daily and discuss the story",
        "Play word games and rhyming activities",
        "Expand your child's sentences with new words",
        "Practice asking and answering questions",
        "Limit screen time and increase face-to-face interaction"
      ],
      red_flags: [
        "No 2–3-word phrases by 30 months",
        "Speech mostly unclear after 3 years",
        "Poor eye contact",
        "Does not follow simple commands",
        "Limited pretend play",
        "Loss of previously acquired skills"
      ]
    },
    {
      level: "developing",
      message: "Your child is developing well. Continue with enriching activities and conversation.",
      product_categories: ["educational-games", "storytelling-toys"],
      tips: [
        "Encourage storytelling and creative play",
        "Introduce new vocabulary through themed activities",
        "Practice following multi-step directions through games",
        "Ask open-ended questions to promote thinking",
        "Model correct grammar and pronunciation"
      ]
    },
    {
      level: "on_track",
      message: "Wonderful! Your child's development is right on track across all areas.",
      product_categories: ["advanced-learning-games", "creative-expression-toys"],
      tips: [
        "Challenge with more complex stories and concepts",
        "Introduce early literacy and writing activities",
        "Encourage detailed descriptions and explanations",
        "Play games that require verbal reasoning",
        "Support social play opportunities"
      ]
    },
    {
      level: "advanced",
      message: "Exceptional! Your child demonstrates advanced abilities across developmental areas.",
      product_categories: ["stem-toys", "advanced-books"],
      tips: [
        "Introduce abstract concepts and problem-solving",
        "Encourage creative expression",
        "Discuss emotions and social situations",
        "Support early reading and writing skills",
        "Provide varied learning experiences"
      ]
    }
  ]
end

# ============================================================
# Assessment 3: 3–4 Years Screening
# ============================================================
Assessment.find_or_create_by!(slug: "screening-3-4-years") do |a|
  a.title = "Developmental Screening (3–4 Years)"
  a.description = "A comprehensive developmental screening for children aged 3–4 years covering gross motor, fine motor, speech, language, cognitive, social, and emotional development."
  a.min_age = 36
  a.max_age = 48
  a.active = true
  a.version = 1
  a.questions = [
    # Gross Motor
    { key: "gm1", text: "Can your child jump forward with both feet together?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },
    { key: "gm2", text: "Does your child climb stairs alternating feet?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },
    { key: "gm3", text: "Can your child pedal a tricycle?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },
    { key: "gm4", text: "Does your child throw and catch a large ball?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },
    { key: "gm5", text: "Can your child stand on one foot for a few seconds?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },

    # Fine Motor
    { key: "fm1", text: "Can your child copy a circle?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },
    { key: "fm2", text: "Does your child build a tower of 8–10 blocks?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },
    { key: "fm3", text: "Can your child hold a crayon with fingers (not full fist)?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },
    { key: "fm4", text: "Does your child use scissors with some control?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },
    { key: "fm5", text: "Can your child draw a simple person (2–3 body parts)?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },

    # Speech (Expressive)
    { key: "sp1", text: "Does your child speak in 4–5 word sentences?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },
    { key: "sp2", text: "Is your child's speech understandable to family members (about 80%)?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },
    { key: "sp3", text: "Can your child tell a short story or describe an event?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },
    { key: "sp4", text: "Does your child ask many \"why\" questions?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },
    { key: "sp5", text: "Does your child use plurals and simple past tense?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },

    # Language (Receptive)
    { key: "lg1", text: "Can your child follow 2–3 step instructions?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },
    { key: "lg2", text: "Does your child understand positional words (in, on, under)?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },
    { key: "lg3", text: "Can your child answer WH-questions (who, what, where)?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },
    { key: "lg4", text: "Does your child understand concepts like big/small, same/different?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },
    { key: "lg5", text: "Can your child identify objects by their function?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },

    # Cognitive
    { key: "cg1", text: "Can your child complete a 4–6 piece puzzle?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },
    { key: "cg2", text: "Does your child sort objects by color or shape?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },
    { key: "cg3", text: "Can your child count 3–5 objects correctly?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },
    { key: "cg4", text: "Does your child engage in imaginative pretend play?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },
    { key: "cg5", text: "Can your child recall parts of a story after hearing it?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },

    # Social
    { key: "sc1", text: "Does your child play cooperatively with other children?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },
    { key: "sc2", text: "Can your child take turns in games?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },
    { key: "sc3", text: "Does your child share toys occasionally?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },
    { key: "sc4", text: "Does your child initiate interaction with peers?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },
    { key: "sc5", text: "Can your child follow simple group rules?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },

    # Emotional / Behavior
    { key: "em1", text: "Does your child express feelings verbally?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } },
    { key: "em2", text: "Can your child manage minor frustration without extreme tantrums?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } },
    { key: "em3", text: "Does your child show empathy (comfort a friend)?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } },
    { key: "em4", text: "Can your child separate from caregiver with minimal distress?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } },
    { key: "em5", text: "Does your child adapt to small routine changes?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } }
  ]
  a.scoring_rules = [
    { min_score: 0, max_score: 105, level: "needs_attention", label: "Needs Attention" },
    { min_score: 106, max_score: 210, level: "developing", label: "Developing" },
    { min_score: 211, max_score: 280, level: "on_track", label: "On Track" },
    { min_score: 281, max_score: 350, level: "advanced", label: "Advanced" }
  ]
  a.recommendations = [
    {
      level: "needs_attention",
      message: "Your child may benefit from professional evaluation. Consider consulting a developmental specialist or speech-language pathologist.",
      product_categories: ["speech-therapy-tools", "developmental-toys"],
      tips: [
        "Read books daily and ask questions about the story",
        "Practice naming objects, colors, and shapes",
        "Encourage pretend play and storytelling",
        "Play sorting and matching games",
        "Provide structured social play opportunities"
      ],
      red_flags: [
        "Speech difficult to understand",
        "Does not use sentences",
        "Poor eye contact",
        "Limited pretend play",
        "Cannot follow simple directions",
        "Loss of previously learned skills"
      ]
    },
    {
      level: "developing",
      message: "Your child is making good progress. Continue supporting development through play and interaction.",
      product_categories: ["educational-games", "creative-play"],
      tips: [
        "Encourage asking and answering questions",
        "Practice counting and sorting activities",
        "Support cooperative play with peers",
        "Model clear speech and new vocabulary",
        "Introduce simple board games"
      ]
    },
    {
      level: "on_track",
      message: "Great! Your child's development is progressing well across all areas.",
      product_categories: ["advanced-learning-games", "art-supplies"],
      tips: [
        "Introduce more complex concepts",
        "Encourage creative storytelling",
        "Practice early writing skills",
        "Support independent problem-solving",
        "Provide varied social experiences"
      ]
    },
    {
      level: "advanced",
      message: "Excellent! Your child is showing advanced development for their age.",
      product_categories: ["stem-toys", "advanced-books"],
      tips: [
        "Challenge with complex puzzles and games",
        "Encourage detailed storytelling",
        "Introduce early reading activities",
        "Support leadership in group play",
        "Explore new interests and hobbies"
      ]
    }
  ]
end

# ============================================================
# Assessment 4: 4–5 Years Screening
# ============================================================
Assessment.find_or_create_by!(slug: "screening-4-5-years") do |a|
  a.title = "Developmental Screening (4–5 Years)"
  a.description = "A comprehensive developmental screening for children aged 4–5 years covering gross motor, fine motor, speech, language, cognitive, social, and emotional development."
  a.min_age = 48
  a.max_age = 60
  a.active = true
  a.version = 1
  a.questions = [
    # Gross Motor
    { key: "gm1", text: "Can your child hop on one foot?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },
    { key: "gm2", text: "Does your child skip or attempt skipping?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },
    { key: "gm3", text: "Can your child catch a bounced ball?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },
    { key: "gm4", text: "Does your child climb and play confidently on playground equipment?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },
    { key: "gm5", text: "Can your child balance on one foot for 5–10 seconds?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },

    # Fine Motor
    { key: "fm1", text: "Can your child copy a square and triangle?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },
    { key: "fm2", text: "Does your child draw a person with at least 4–6 body parts?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },
    { key: "fm3", text: "Can your child use scissors to cut along a line?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },
    { key: "fm4", text: "Does your child hold pencil with proper grip?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },
    { key: "fm5", text: "Can your child write some letters of their name?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },

    # Speech (Expressive)
    { key: "sp1", text: "Is your child's speech clear to unfamiliar listeners (mostly 90–100%)?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },
    { key: "sp2", text: "Does your child speak in full 5–6-word sentences?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },
    { key: "sp3", text: "Can your child tell a simple story about their day?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },
    { key: "sp4", text: "Does your child use correct grammar most of the time?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },
    { key: "sp5", text: "Can your child answer simple reasoning questions (\"Why do we wear shoes?\")?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },

    # Language (Receptive)
    { key: "lg1", text: "Can your child follow 3-step directions?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },
    { key: "lg2", text: "Does your child understand time concepts (today, tomorrow)?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },
    { key: "lg3", text: "Can your child understand and answer WH-questions?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },
    { key: "lg4", text: "Does your child understand positional words (under, behind, between)?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },
    { key: "lg5", text: "Can your child understand simple rules in games?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },

    # Cognitive
    { key: "cg1", text: "Can your child count at least 10 objects?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },
    { key: "cg2", text: "Does your child recognize basic letters and numbers?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },
    { key: "cg3", text: "Can your child identify colors and shapes correctly?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },
    { key: "cg4", text: "Does your child understand sequencing (first–next–last)?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },
    { key: "cg5", text: "Can your child solve simple 5–6-piece puzzles independently?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },

    # Social
    { key: "sc1", text: "Does your child play cooperatively with peers?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },
    { key: "sc2", text: "Can your child take turns and share during play?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },
    { key: "sc3", text: "Does your child follow classroom or game rules?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },
    { key: "sc4", text: "Does your child initiate conversation with peers?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },
    { key: "sc5", text: "Does your child engage in imaginative group play?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },

    # Emotional / Behavior
    { key: "em1", text: "Can your child express feelings using words?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } },
    { key: "em2", text: "Does your child manage frustration with minimal tantrums?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } },
    { key: "em3", text: "Can your child wait for their turn patiently?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } },
    { key: "em4", text: "Does your child show empathy toward others?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } },
    { key: "em5", text: "Can your child adapt to small routine changes?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } }
  ]
  a.scoring_rules = [
    { min_score: 0, max_score: 105, level: "needs_attention", label: "Needs Attention" },
    { min_score: 106, max_score: 210, level: "developing", label: "Developing" },
    { min_score: 211, max_score: 280, level: "on_track", label: "On Track" },
    { min_score: 281, max_score: 350, level: "advanced", label: "Advanced" }
  ]
  a.recommendations = [
    {
      level: "needs_attention",
      message: "We recommend consulting with a developmental specialist for a comprehensive evaluation.",
      product_categories: ["speech-therapy-tools", "learning-games"],
      tips: [
        "Practice letter and number recognition daily",
        "Encourage clear speech through modeling",
        "Play cooperative games with peers",
        "Read together and discuss stories",
        "Practice following multi-step directions"
      ],
      red_flags: [
        "Speech unclear to unfamiliar people",
        "Difficulty forming sentences",
        "Cannot follow 2–3 step directions",
        "Limited social interaction",
        "Frequent extreme tantrums",
        "Difficulty holding pencil or drawing simple shapes"
      ]
    },
    {
      level: "developing",
      message: "Your child is developing well. Continue enriching activities to support growth.",
      product_categories: ["educational-games", "art-supplies"],
      tips: [
        "Encourage storytelling and creative expression",
        "Practice writing letters and numbers",
        "Support social play and sharing",
        "Play counting and sorting games",
        "Model problem-solving strategies"
      ]
    },
    {
      level: "on_track",
      message: "Wonderful! Your child's development is right on track.",
      product_categories: ["advanced-learning-games", "science-kits"],
      tips: [
        "Introduce early reading activities",
        "Challenge with complex puzzles",
        "Encourage independent thinking",
        "Support creative writing attempts",
        "Provide leadership opportunities in play"
      ]
    },
    {
      level: "advanced",
      message: "Exceptional! Your child demonstrates advanced abilities across all areas.",
      product_categories: ["stem-toys", "advanced-books"],
      tips: [
        "Support early reading and writing",
        "Introduce basic math concepts",
        "Encourage detailed storytelling",
        "Provide complex problem-solving activities",
        "Support leadership and mentoring peers"
      ]
    }
  ]
end

# ============================================================
# Assessment 5: 5–6 Years Screening
# ============================================================
Assessment.find_or_create_by!(slug: "screening-5-6-years") do |a|
  a.title = "Developmental Screening (5–6 Years)"
  a.description = "A comprehensive developmental screening for children aged 5–6 years covering gross motor, fine motor, speech, language, cognitive, social, and emotional development."
  a.min_age = 60
  a.max_age = 72
  a.active = true
  a.version = 1
  a.questions = [
    # Gross Motor
    { key: "gm1", text: "Can your child skip smoothly?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },
    { key: "gm2", text: "Does your child ride a bicycle (with or without support wheels)?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },
    { key: "gm3", text: "Can your child balance on one foot for 10 seconds?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },
    { key: "gm4", text: "Does your child catch and throw a small ball accurately?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },
    { key: "gm5", text: "Can your child participate confidently in playground games?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },

    # Fine Motor
    { key: "fm1", text: "Can your child write their full name?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },
    { key: "fm2", text: "Does your child copy shapes like triangle and diamond?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },
    { key: "fm3", text: "Can your child color within lines neatly?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },
    { key: "fm4", text: "Does your child cut along a straight and curved line accurately?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },
    { key: "fm5", text: "Can your child tie shoelaces (or attempt independently)?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },

    # Speech (Expressive)
    { key: "sp1", text: "Is your child's speech clear to strangers (almost 100%)?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },
    { key: "sp2", text: "Does your child speak in long, grammatically correct sentences?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },
    { key: "sp3", text: "Can your child retell a story with beginning, middle, and end?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },
    { key: "sp4", text: "Does your child explain ideas clearly?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },
    { key: "sp5", text: "Can your child answer reasoning questions (\"Why do we brush teeth?\")?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },

    # Language (Receptive)
    { key: "lg1", text: "Can your child follow 3–4 step instructions?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },
    { key: "lg2", text: "Does your child understand complex sentences?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },
    { key: "lg3", text: "Can your child understand and use time concepts (yesterday, tomorrow)?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },
    { key: "lg4", text: "Does your child understand positional and comparative words (between, taller)?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },
    { key: "lg5", text: "Can your child listen to a short story and answer questions about it?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },

    # Cognitive
    { key: "cg1", text: "Can your child count at least 20 objects?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },
    { key: "cg2", text: "Does your child recognize most letters and some sight words?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },
    { key: "cg3", text: "Can your child solve simple addition/subtraction problems?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },
    { key: "cg4", text: "Does your child understand sequencing of daily events?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },
    { key: "cg5", text: "Can your child plan and complete a simple task independently?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },

    # Social
    { key: "sc1", text: "Does your child have close friends?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },
    { key: "sc2", text: "Can your child take turns and follow game rules consistently?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },
    { key: "sc3", text: "Does your child participate in group discussions?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },
    { key: "sc4", text: "Can your child resolve small conflicts using words?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },
    { key: "sc5", text: "Does your child show teamwork during activities?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },

    # Emotional / Behavior
    { key: "em1", text: "Can your child control impulses most of the time?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } },
    { key: "em2", text: "Does your child handle losing in games appropriately?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } },
    { key: "em3", text: "Can your child express feelings verbally rather than physically?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } },
    { key: "em4", text: "Does your child take responsibility for simple tasks?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } },
    { key: "em5", text: "Can your child adjust to school routine comfortably?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } }
  ]
  a.scoring_rules = [
    { min_score: 0, max_score: 105, level: "needs_attention", label: "Needs Attention" },
    { min_score: 106, max_score: 210, level: "developing", label: "Developing" },
    { min_score: 211, max_score: 280, level: "on_track", label: "On Track" },
    { min_score: 281, max_score: 350, level: "advanced", label: "Advanced" }
  ]
  a.recommendations = [
    {
      level: "needs_attention",
      message: "We recommend a professional evaluation to support your child's developmental needs.",
      product_categories: ["speech-therapy-tools", "school-readiness"],
      tips: [
        "Practice reading and writing daily",
        "Encourage clear speech and storytelling",
        "Play structured games with rules",
        "Support social interactions with peers",
        "Work on following multi-step directions"
      ],
      red_flags: [
        "Speech unclear or persistent sound errors",
        "Difficulty understanding instructions",
        "Poor attention span",
        "Difficulty making friends",
        "Struggles with early reading skills",
        "Frequent aggressive behavior"
      ]
    },
    {
      level: "developing",
      message: "Your child is developing well. Continue with enriching school-readiness activities.",
      product_categories: ["educational-games", "reading-materials"],
      tips: [
        "Practice reading together daily",
        "Encourage writing stories and letters",
        "Support teamwork and cooperation",
        "Play math-based games",
        "Model emotional regulation"
      ]
    },
    {
      level: "on_track",
      message: "Great! Your child is well prepared for school across all developmental areas.",
      product_categories: ["advanced-learning", "science-kits"],
      tips: [
        "Encourage independent reading",
        "Support creative writing",
        "Introduce basic science concepts",
        "Challenge with complex problem-solving",
        "Support leadership in group activities"
      ]
    },
    {
      level: "advanced",
      message: "Excellent! Your child demonstrates exceptional development and school readiness.",
      product_categories: ["stem-toys", "advanced-reading"],
      tips: [
        "Support advanced reading and comprehension",
        "Introduce complex math concepts",
        "Encourage research and exploration",
        "Support creative and critical thinking",
        "Provide mentoring opportunities"
      ]
    }
  ]
end

# ============================================================
# Assessment 6: 6–7 Years Screening
# ============================================================
Assessment.find_or_create_by!(slug: "screening-6-7-years") do |a|
  a.title = "Developmental Screening (6–7 Years)"
  a.description = "A comprehensive developmental screening for children aged 6–7 years covering gross motor, fine motor, speech, language, cognitive/academic, social, and emotional development."
  a.min_age = 72
  a.max_age = 84
  a.active = true
  a.version = 1
  a.questions = [
    # Gross Motor
    { key: "gm1", text: "Can your child skip and run smoothly with good coordination?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },
    { key: "gm2", text: "Does your child ride a bicycle confidently?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },
    { key: "gm3", text: "Can your child participate in team sports?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },
    { key: "gm4", text: "Does your child balance well while hopping or standing on one foot?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },
    { key: "gm5", text: "Can your child throw and catch a small ball accurately?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },

    # Fine Motor
    { key: "fm1", text: "Can your child write neat sentences on a line?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },
    { key: "fm2", text: "Does your child hold pencil with correct tripod grasp?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },
    { key: "fm3", text: "Can your child cut complex shapes accurately?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },
    { key: "fm4", text: "Does your child draw detailed pictures with multiple elements?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },
    { key: "fm5", text: "Can your child manage buttons and shoelaces independently?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },

    # Speech (Expressive)
    { key: "sp1", text: "Is your child's speech completely clear to everyone?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },
    { key: "sp2", text: "Can your child explain events in logical order?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },
    { key: "sp3", text: "Does your child use complex sentences (because, although)?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },
    { key: "sp4", text: "Can your child describe problems and suggest solutions?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },
    { key: "sp5", text: "Does your child participate confidently in class discussions?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },

    # Language (Receptive)
    { key: "lg1", text: "Can your child follow 3–4 step classroom instructions?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },
    { key: "lg2", text: "Does your child understand abstract words (before/after, left/right)?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },
    { key: "lg3", text: "Can your child understand and answer inferencing questions?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },
    { key: "lg4", text: "Does your child understand jokes or simple idioms?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },
    { key: "lg5", text: "Can your child recall key details from a short story?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },

    # Cognitive / Academic
    { key: "cg1", text: "Can your child read simple paragraphs independently?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },
    { key: "cg2", text: "Does your child write meaningful sentences with correct spacing?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },
    { key: "cg3", text: "Can your child perform basic addition and subtraction?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },
    { key: "cg4", text: "Does your child understand time concepts (clock, days of week)?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },
    { key: "cg5", text: "Can your child stay focused on a task for 15–20 minutes?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },

    # Social
    { key: "sc1", text: "Does your child have stable friendships?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },
    { key: "sc2", text: "Can your child work cooperatively in group tasks?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },
    { key: "sc3", text: "Does your child follow school rules consistently?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },
    { key: "sc4", text: "Can your child resolve minor conflicts verbally?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },
    { key: "sc5", text: "Does your child show respect toward teachers and peers?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },

    # Emotional / Behavior
    { key: "em1", text: "Can your child manage frustration appropriately?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } },
    { key: "em2", text: "Does your child accept correction without extreme reaction?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } },
    { key: "em3", text: "Can your child control impulses in classroom setting?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } },
    { key: "em4", text: "Does your child show empathy toward others?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } },
    { key: "em5", text: "Can your child handle winning and losing gracefully?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } }
  ]
  a.scoring_rules = [
    { min_score: 0, max_score: 105, level: "needs_attention", label: "Needs Attention" },
    { min_score: 106, max_score: 210, level: "developing", label: "Developing" },
    { min_score: 211, max_score: 280, level: "on_track", label: "On Track" },
    { min_score: 281, max_score: 350, level: "advanced", label: "Advanced" }
  ]
  a.recommendations = [
    {
      level: "needs_attention",
      message: "We recommend a comprehensive evaluation by a developmental specialist or educational psychologist.",
      product_categories: ["speech-therapy-tools", "academic-support"],
      tips: [
        "Practice reading aloud daily",
        "Work on writing and spelling activities",
        "Support social skills through structured play",
        "Practice following classroom instructions",
        "Encourage emotional expression through words"
      ],
      red_flags: [
        "Persistent unclear speech",
        "Difficulty reading simple text",
        "Poor attention span",
        "Difficulty understanding instructions",
        "Struggles making or keeping friends",
        "Frequent emotional outbursts"
      ]
    },
    {
      level: "developing",
      message: "Your child is making good progress. Continue supporting academic and social development.",
      product_categories: ["educational-games", "reading-materials"],
      tips: [
        "Encourage independent reading",
        "Practice creative writing",
        "Support group activities and teamwork",
        "Play strategy and problem-solving games",
        "Model emotional regulation"
      ]
    },
    {
      level: "on_track",
      message: "Great! Your child is performing well across all developmental and academic areas.",
      product_categories: ["advanced-learning", "stem-kits"],
      tips: [
        "Challenge with chapter books",
        "Introduce research projects",
        "Support leadership opportunities",
        "Encourage creative expression",
        "Foster critical thinking skills"
      ]
    },
    {
      level: "advanced",
      message: "Excellent! Your child demonstrates exceptional academic and developmental skills.",
      product_categories: ["advanced-stem", "creative-writing"],
      tips: [
        "Support advanced reading and comprehension",
        "Encourage independent research",
        "Provide complex problem-solving challenges",
        "Support mentoring and teaching peers",
        "Foster creative and artistic expression"
      ]
    }
  ]
end

# ============================================================
# Assessment 7: 7–8 Years Screening
# ============================================================
Assessment.find_or_create_by!(slug: "screening-7-8-years") do |a|
  a.title = "Developmental Screening (7–8 Years)"
  a.description = "A comprehensive developmental screening for children aged 7–8 years covering gross motor, fine motor, speech, language, cognitive/academic, social, and emotional development."
  a.min_age = 84
  a.max_age = 96
  a.active = true
  a.version = 1
  a.questions = [
    # Gross Motor
    { key: "gm1", text: "Does your child participate confidently in sports or physical activities?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },
    { key: "gm2", text: "Can your child coordinate running, jumping, and turning smoothly?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },
    { key: "gm3", text: "Does your child have good balance while hopping or skipping?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },
    { key: "gm4", text: "Can your child catch and throw a small ball accurately?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },
    { key: "gm5", text: "Does your child demonstrate good stamina during play?", type: "yes_no", category: "gross_motor", points: { yes: 10, no: 0 } },

    # Fine Motor
    { key: "fm1", text: "Is your child's handwriting neat and legible?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },
    { key: "fm2", text: "Can your child write full paragraphs independently?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },
    { key: "fm3", text: "Does your child maintain proper pencil grip?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },
    { key: "fm4", text: "Can your child complete craft activities with precision?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },
    { key: "fm5", text: "Does your child manage buttons, zippers, and shoelaces independently?", type: "yes_no", category: "fine_motor", points: { yes: 10, no: 0 } },

    # Speech (Expressive)
    { key: "sp1", text: "Is your child's speech completely clear and age-appropriate?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },
    { key: "sp2", text: "Can your child narrate stories with clear sequence and details?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },
    { key: "sp3", text: "Does your child use complex grammar correctly?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },
    { key: "sp4", text: "Can your child explain opinions with reasons?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },
    { key: "sp5", text: "Does your child adjust speech appropriately in formal/informal settings?", type: "yes_no", category: "expressive_language", points: { yes: 10, no: 0 } },

    # Language (Receptive)
    { key: "lg1", text: "Can your child follow multi-step classroom instructions independently?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },
    { key: "lg2", text: "Does your child understand abstract vocabulary?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },
    { key: "lg3", text: "Can your child understand idioms and figurative language?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },
    { key: "lg4", text: "Does your child answer inferential questions correctly?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },
    { key: "lg5", text: "Can your child summarize a story after reading?", type: "yes_no", category: "receptive_language", points: { yes: 10, no: 0 } },

    # Cognitive / Academic
    { key: "cg1", text: "Can your child read fluently with good comprehension?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },
    { key: "cg2", text: "Does your child write organized paragraphs?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },
    { key: "cg3", text: "Can your child solve multi-step math problems?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },
    { key: "cg4", text: "Does your child demonstrate logical reasoning skills?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },
    { key: "cg5", text: "Can your child stay focused on tasks for 20–30 minutes?", type: "yes_no", category: "cognitive", points: { yes: 10, no: 0 } },

    # Social
    { key: "sc1", text: "Does your child maintain stable friendships?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },
    { key: "sc2", text: "Can your child work effectively in team activities?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },
    { key: "sc3", text: "Does your child respect rules and authority figures?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },
    { key: "sc4", text: "Can your child resolve peer conflicts independently?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },
    { key: "sc5", text: "Does your child understand fairness and empathy?", type: "yes_no", category: "social_communication", points: { yes: 10, no: 0 } },

    # Emotional / Behavior
    { key: "em1", text: "Does your child manage stress related to schoolwork?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } },
    { key: "em2", text: "Can your child accept feedback without emotional outbursts?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } },
    { key: "em3", text: "Does your child demonstrate self-confidence?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } },
    { key: "em4", text: "Can your child regulate anger appropriately?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } },
    { key: "em5", text: "Does your child show responsibility for homework and tasks?", type: "yes_no", category: "emotional", points: { yes: 10, no: 0 } }
  ]
  a.scoring_rules = [
    { min_score: 0, max_score: 105, level: "needs_attention", label: "Needs Attention" },
    { min_score: 106, max_score: 210, level: "developing", label: "Developing" },
    { min_score: 211, max_score: 280, level: "on_track", label: "On Track" },
    { min_score: 281, max_score: 350, level: "advanced", label: "Advanced" }
  ]
  a.recommendations = [
    {
      level: "needs_attention",
      message: "We recommend a comprehensive evaluation by a developmental specialist, educational psychologist, or speech-language pathologist.",
      product_categories: ["speech-therapy-tools", "academic-support"],
      tips: [
        "Practice reading comprehension daily",
        "Work on organized writing activities",
        "Support social skills through structured activities",
        "Practice math problem-solving",
        "Encourage emotional expression and regulation"
      ],
      red_flags: [
        "Reading difficulties or poor comprehension",
        "Persistent articulation or language issues",
        "Poor attention and task completion",
        "Difficulty understanding instructions",
        "Social withdrawal or aggressive behavior",
        "Low frustration tolerance"
      ]
    },
    {
      level: "developing",
      message: "Your child is making solid progress. Continue supporting academic and personal growth.",
      product_categories: ["educational-games", "chapter-books"],
      tips: [
        "Encourage independent reading of chapter books",
        "Practice organized paragraph writing",
        "Support collaborative learning",
        "Play strategy and reasoning games",
        "Model healthy emotional responses"
      ]
    },
    {
      level: "on_track",
      message: "Great! Your child is performing well across all developmental and academic areas.",
      product_categories: ["advanced-learning", "stem-kits"],
      tips: [
        "Challenge with complex reading materials",
        "Encourage creative and analytical writing",
        "Support leadership in group activities",
        "Introduce advanced problem-solving",
        "Foster independent learning habits"
      ]
    },
    {
      level: "advanced",
      message: "Excellent! Your child demonstrates exceptional abilities across all areas.",
      product_categories: ["advanced-stem", "creative-arts"],
      tips: [
        "Support advanced academic pursuits",
        "Encourage independent research projects",
        "Provide complex creative challenges",
        "Support mentoring and peer teaching",
        "Foster global awareness and critical thinking"
      ]
    }
  ]
end

puts "Assessments: #{Assessment.count}"
