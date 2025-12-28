# Assessments Seed Data
puts "Creating assessments..."

Assessment.destroy_all

# Assessment 1: Speech Development Assessment (12-24 months)
Assessment.create!(
  title: "Speech Development Assessment (12-24 months)",
  description: "This assessment evaluates early speech and language development for toddlers between 12 and 24 months old. It covers vocabulary, gestures, comprehension, and early word combinations.",
  slug: "speech-development-12-24-months",
  min_age: 12,
  max_age: 24,
  active: true,
  version: 1,
  questions: [
    {
      key: "q1",
      text: "Does your child say at least 3-5 words consistently?",
      type: "yes_no",
      category: "expressive_language",
      points: { yes: 10, no: 0 }
    },
    {
      key: "q2",
      text: "Does your child point to objects when asked 'Where is...?'",
      type: "yes_no",
      category: "receptive_language",
      points: { yes: 10, no: 0 }
    },
    {
      key: "q3",
      text: "How many words does your child say regularly?",
      type: "multiple_choice",
      category: "expressive_language",
      options: [
        { value: "0-2", label: "0-2 words", points: 0 },
        { value: "3-5", label: "3-5 words", points: 5 },
        { value: "6-10", label: "6-10 words", points: 10 },
        { value: "11-20", label: "11-20 words", points: 15 },
        { value: "20+", label: "More than 20 words", points: 20 }
      ]
    },
    {
      key: "q4",
      text: "Does your child follow simple one-step commands (e.g., 'Come here', 'Give me')?",
      type: "yes_no",
      category: "receptive_language",
      points: { yes: 10, no: 0 }
    },
    {
      key: "q5",
      text: "Does your child use gestures to communicate (waving, pointing, nodding)?",
      type: "yes_no",
      category: "social_communication",
      points: { yes: 10, no: 0 }
    },
    {
      key: "q6",
      text: "How well does your child imitate sounds and words?",
      type: "scale",
      category: "expressive_language",
      min_value: 1,
      max_value: 5,
      min_label: "Never",
      max_label: "Always",
      points_per_level: 2
    },
    {
      key: "q7",
      text: "Does your child respond to their name when called?",
      type: "yes_no",
      category: "receptive_language",
      points: { yes: 10, no: 0 }
    },
    {
      key: "q8",
      text: "Does your child show interest in looking at books?",
      type: "yes_no",
      category: "social_communication",
      points: { yes: 5, no: 0 }
    },
    {
      key: "q9",
      text: "Can your child identify at least 3 body parts when asked?",
      type: "yes_no",
      category: "receptive_language",
      points: { yes: 10, no: 0 }
    },
    {
      key: "q10",
      text: "Does your child combine two words together (e.g., 'more milk', 'bye bye daddy')?",
      type: "yes_no",
      category: "expressive_language",
      points: { yes: 15, no: 0 }
    }
  ],
  scoring_rules: [
    { min_score: 0, max_score: 30, level: "needs_attention", label: "Needs Attention" },
    { min_score: 31, max_score: 60, level: "developing", label: "Developing" },
    { min_score: 61, max_score: 85, level: "on_track", label: "On Track" },
    { min_score: 86, max_score: 100, level: "advanced", label: "Advanced" }
  ],
  recommendations: [
    {
      level: "needs_attention",
      message: "Your child may benefit from additional speech therapy support. Consider consulting with a speech-language pathologist.",
      product_categories: ["speech-therapy-tools", "early-language-toys"],
      tips: [
        "Talk to your child frequently throughout the day",
        "Name objects and actions as you do them",
        "Read picture books together daily",
        "Use simple, clear words and short sentences",
        "Give your child time to respond"
      ]
    },
    {
      level: "developing",
      message: "Your child is making progress! Continue encouraging language development with play and interaction.",
      product_categories: ["language-development-toys", "books"],
      tips: [
        "Expand on your child's words (if they say 'ball', you say 'yes, big ball!')",
        "Sing songs and nursery rhymes together",
        "Play simple games like peek-a-boo and pat-a-cake",
        "Narrate daily activities",
        "Ask simple questions"
      ]
    },
    {
      level: "on_track",
      message: "Great job! Your child's speech development is progressing well.",
      product_categories: ["advanced-language-toys", "interactive-books"],
      tips: [
        "Introduce new vocabulary through play",
        "Start teaching simple concepts (colors, shapes, sizes)",
        "Encourage pretend play",
        "Ask open-ended questions",
        "Model proper grammar"
      ]
    },
    {
      level: "advanced",
      message: "Excellent! Your child is showing advanced language skills for their age.",
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
)

# Assessment 2: Language Skills Assessment (3-5 years)
Assessment.create!(
  title: "Language Skills Assessment (3-5 years)",
  description: "This comprehensive assessment evaluates language skills for preschoolers aged 3-5 years. It covers vocabulary, sentence structure, comprehension, storytelling abilities, and social communication.",
  slug: "language-skills-3-5-years",
  min_age: 36,
  max_age: 60,
  active: true,
  version: 1,
  questions: [
    {
      key: "q1",
      text: "Does your child speak in complete sentences with 4-5 words?",
      type: "yes_no",
      category: "expressive_language",
      points: { yes: 10, no: 0 }
    },
    {
      key: "q2",
      text: "How well does your child answer 'who', 'what', and 'where' questions?",
      type: "scale",
      category: "receptive_language",
      min_value: 1,
      max_value: 5,
      min_label: "Rarely",
      max_label: "Always",
      points_per_level: 2
    },
    {
      key: "q3",
      text: "Can your child tell a simple story about something that happened?",
      type: "yes_no",
      category: "expressive_language",
      points: { yes: 10, no: 0 }
    },
    {
      key: "q4",
      text: "How large is your child's vocabulary?",
      type: "multiple_choice",
      category: "expressive_language",
      options: [
        { value: "under-200", label: "Under 200 words", points: 0 },
        { value: "200-500", label: "200-500 words", points: 5 },
        { value: "500-1000", label: "500-1000 words", points: 10 },
        { value: "1000+", label: "Over 1000 words", points: 15 }
      ]
    },
    {
      key: "q5",
      text: "Does your child use pronouns correctly (I, you, me, he, she)?",
      type: "yes_no",
      category: "expressive_language",
      points: { yes: 10, no: 0 }
    },
    {
      key: "q6",
      text: "Can your child follow 2-3 step directions?",
      type: "yes_no",
      category: "receptive_language",
      points: { yes: 10, no: 0 }
    },
    {
      key: "q7",
      text: "How clearly can strangers understand your child's speech?",
      type: "scale",
      category: "articulation",
      min_value: 1,
      max_value: 5,
      min_label: "Not at all",
      max_label: "Completely",
      points_per_level: 2
    },
    {
      key: "q8",
      text: "Does your child ask questions using 'why', 'when', and 'how'?",
      type: "yes_no",
      category: "expressive_language",
      points: { yes: 10, no: 0 }
    },
    {
      key: "q9",
      text: "Can your child engage in back-and-forth conversation?",
      type: "yes_no",
      category: "social_communication",
      points: { yes: 10, no: 0 }
    },
    {
      key: "q10",
      text: "Does your child understand and use time concepts (yesterday, today, tomorrow)?",
      type: "yes_no",
      category: "receptive_language",
      points: { yes: 10, no: 0 }
    },
    {
      key: "q11",
      text: "How well does your child describe objects and events?",
      type: "scale",
      category: "expressive_language",
      min_value: 1,
      max_value: 5,
      min_label: "Not at all",
      max_label: "Very well",
      points_per_level: 2
    },
    {
      key: "q12",
      text: "Does your child play cooperatively with other children using language?",
      type: "yes_no",
      category: "social_communication",
      points: { yes: 10, no: 0 }
    }
  ],
  scoring_rules: [
    { min_score: 0, max_score: 40, level: "needs_attention", label: "Needs Attention" },
    { min_score: 41, max_score: 75, level: "developing", label: "Developing" },
    { min_score: 76, max_score: 100, level: "on_track", label: "On Track" },
    { min_score: 101, max_score: 130, level: "advanced", label: "Advanced" }
  ],
  recommendations: [
    {
      level: "needs_attention",
      message: "We recommend consulting with a speech-language pathologist for a comprehensive evaluation.",
      product_categories: ["speech-therapy-tools", "language-building-games"],
      tips: [
        "Read books together daily and discuss the story",
        "Play word games and rhyming activities",
        "Expand your child's sentences with new words",
        "Practice asking and answering questions",
        "Limit screen time and increase face-to-face interaction"
      ]
    },
    {
      level: "developing",
      message: "Your child is developing language skills. Continue with enriching activities and conversation.",
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
      message: "Wonderful! Your child's language development is right on track.",
      product_categories: ["advanced-learning-games", "creative-expression-toys"],
      tips: [
        "Challenge with more complex stories and concepts",
        "Introduce early literacy and writing activities",
        "Encourage detailed descriptions and explanations",
        "Play games that require verbal reasoning",
        "Support bilingual development if applicable"
      ]
    },
    {
      level: "advanced",
      message: "Exceptional! Your child demonstrates advanced language abilities.",
      product_categories: ["stem-toys", "advanced-books"],
      tips: [
        "Introduce abstract concepts and problem-solving",
        "Encourage creative writing and storytelling",
        "Discuss emotions and social situations",
        "Support early reading and writing skills",
        "Provide opportunities for presentations or performances"
      ]
    }
  ]
)

# Assessment 3: Articulation Assessment (5-8 years)
Assessment.create!(
  title: "Articulation Assessment (5-8 years)",
  description: "This assessment focuses on speech sound production and articulation clarity for school-age children. It helps identify potential articulation challenges and provides guidance for improvement.",
  slug: "articulation-5-8-years",
  min_age: 60,
  max_age: 96,
  active: true,
  version: 1,
  questions: [
    {
      key: "q1",
      text: "Can your child produce /r/ sounds correctly (as in 'red', 'car')?",
      type: "yes_no",
      category: "articulation",
      points: { yes: 10, no: 0 }
    },
    {
      key: "q2",
      text: "Can your child produce /s/ sounds correctly (as in 'sun', 'bus')?",
      type: "yes_no",
      category: "articulation",
      points: { yes: 10, no: 0 }
    },
    {
      key: "q3",
      text: "Can your child produce /l/ sounds correctly (as in 'like', 'ball')?",
      type: "yes_no",
      category: "articulation",
      points: { yes: 10, no: 0 }
    },
    {
      key: "q4",
      text: "How often do people have difficulty understanding your child?",
      type: "multiple_choice",
      category: "articulation",
      options: [
        { value: "always", label: "Always", points: 0 },
        { value: "often", label: "Often", points: 3 },
        { value: "sometimes", label: "Sometimes", points: 7 },
        { value: "rarely", label: "Rarely", points: 10 },
        { value: "never", label: "Never", points: 10 }
      ]
    },
    {
      key: "q5",
      text: "Can your child produce blends correctly (bl, st, tr, etc.)?",
      type: "yes_no",
      category: "articulation",
      points: { yes: 10, no: 0 }
    },
    {
      key: "q6",
      text: "Does your child substitute sounds (e.g., saying 'wabbit' for 'rabbit')?",
      type: "yes_no",
      category: "articulation",
      points: { yes: 0, no: 10 }
    },
    {
      key: "q7",
      text: "Can your child produce /th/ sounds correctly (as in 'thumb', 'this')?",
      type: "yes_no",
      category: "articulation",
      points: { yes: 10, no: 0 }
    },
    {
      key: "q8",
      text: "How clearly does your child speak in conversation?",
      type: "scale",
      category: "articulation",
      min_value: 1,
      max_value: 5,
      min_label: "Difficult to understand",
      max_label: "Very clear",
      points_per_level: 2
    },
    {
      key: "q9",
      text: "Does your child have difficulty with any specific sounds?",
      type: "text",
      category: "articulation",
      points: 0
    },
    {
      key: "q10",
      text: "Can your child pronounce multisyllabic words correctly (e.g., 'refrigerator', 'dinosaur')?",
      type: "yes_no",
      category: "articulation",
      points: { yes: 10, no: 0 }
    },
    {
      key: "q11",
      text: "Is your child aware of their speech difficulties?",
      type: "yes_no",
      category: "social_communication",
      points: { yes: 5, no: 0 }
    },
    {
      key: "q12",
      text: "Does your child avoid speaking in certain situations due to speech concerns?",
      type: "yes_no",
      category: "social_communication",
      points: { yes: 0, no: 10 }
    }
  ],
  scoring_rules: [
    { min_score: 0, max_score: 45, level: "needs_attention", label: "Needs Attention" },
    { min_score: 46, max_score: 70, level: "developing", label: "Developing" },
    { min_score: 71, max_score: 90, level: "on_track", label: "On Track" },
    { min_score: 91, max_score: 110, level: "advanced", label: "Advanced" }
  ],
  recommendations: [
    {
      level: "needs_attention",
      message: "Your child would benefit from articulation therapy with a licensed speech-language pathologist.",
      product_categories: ["articulation-tools", "speech-therapy-games"],
      tips: [
        "Practice specific sounds daily for 5-10 minutes",
        "Use mirrors to help your child see mouth placement",
        "Break words into smaller parts",
        "Praise attempts and progress, not just perfection",
        "Consult with a speech therapist for targeted exercises"
      ]
    },
    {
      level: "developing",
      message: "Your child is making progress with articulation. Continued practice will help.",
      product_categories: ["speech-sound-games", "articulation-cards"],
      tips: [
        "Practice challenging sounds in different positions (beginning, middle, end)",
        "Play sound-focused games",
        "Read aloud together, emphasizing clear pronunciation",
        "Record and listen back to practice sessions",
        "Celebrate improvements"
      ]
    },
    {
      level: "on_track",
      message: "Great! Your child's articulation is developing appropriately.",
      product_categories: ["reading-games", "conversation-games"],
      tips: [
        "Continue encouraging clear speech",
        "Introduce tongue twisters for fun practice",
        "Support reading fluency",
        "Encourage public speaking opportunities",
        "Model clear, expressive speech"
      ]
    },
    {
      level: "advanced",
      message: "Excellent! Your child demonstrates exceptional articulation skills.",
      product_categories: ["public-speaking-tools", "dramatic-play"],
      tips: [
        "Encourage participation in drama or public speaking",
        "Support advanced vocabulary development",
        "Practice expression and intonation",
        "Explore foreign language learning",
        "Foster confidence in communication"
      ]
    }
  ]
)

puts "Created #{Assessment.count} assessments"
