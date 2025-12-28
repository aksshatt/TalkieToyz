# Milestones Seed Data
puts "Creating milestones..."

Milestone.destroy_all

# 0-6 Months - Expressive Language
Milestone.create!([
  {
    title: "Coos and makes pleasure sounds",
    description: "Baby begins to make cooing sounds, vowel-like sounds, and expresses happiness through vocalizations.",
    category: "expressive_language",
    age_months_min: 0,
    age_months_max: 6,
    position: 1,
    active: true,
    indicators: [
      "Makes cooing sounds (ooh, aah)",
      "Vocalizes when happy",
      "Responds to voices with sounds",
      "Begins experimenting with different sounds"
    ],
    tips: [
      "Talk to your baby frequently throughout the day",
      "Respond to baby's coos with your own sounds",
      "Make eye contact while talking",
      "Sing songs and lullabies"
    ]
  },
  {
    title: "Babbles with different sounds",
    description: "Baby starts combining consonants and vowels, producing babbling sounds like 'ba-ba' or 'da-da'.",
    category: "expressive_language",
    age_months_min: 4,
    age_months_max: 8,
    position: 2,
    active: true,
    indicators: [
      "Produces consonant-vowel combinations",
      "Babbles in response to speech",
      "Varies pitch and tone",
      "Uses sounds to get attention"
    ],
    tips: [
      "Imitate your baby's babbling",
      "Add new sounds for them to try",
      "Name objects and actions",
      "Read simple board books together"
    ]
  }
])

# 0-6 Months - Receptive Language
Milestone.create!([
  {
    title: "Responds to sounds and voices",
    description: "Baby turns toward sounds, recognizes familiar voices, and shows awareness of environmental sounds.",
    category: "receptive_language",
    age_months_min: 0,
    age_months_max: 6,
    position: 3,
    active: true,
    indicators: [
      "Turns head toward sounds",
      "Quiets or smiles when spoken to",
      "Recognizes parent's voice",
      "Startles at loud sounds"
    ],
    tips: [
      "Talk about what you're doing",
      "Use different tones of voice",
      "Point out interesting sounds",
      "Play gentle music"
    ]
  }
])

# 6-12 Months - Expressive Language
Milestone.create!([
  {
    title: "Uses gestures to communicate",
    description: "Baby begins using gestures like waving bye-bye, pointing, and reaching to communicate wants and needs.",
    category: "expressive_language",
    age_months_min: 8,
    age_months_max: 12,
    position: 4,
    active: true,
    indicators: [
      "Waves bye-bye",
      "Points to objects of interest",
      "Reaches for desired objects",
      "Shakes head 'no'"
    ],
    tips: [
      "Model gestures during daily routines",
      "Respond enthusiastically to gestures",
      "Pair words with gestures",
      "Play interactive games like peek-a-boo"
    ]
  },
  {
    title: "Says first words",
    description: "Baby begins saying their first recognizable words, typically 'mama', 'dada', or common objects.",
    category: "expressive_language",
    age_months_min: 10,
    age_months_max: 14,
    position: 5,
    active: true,
    indicators: [
      "Says 'mama' or 'dada' specifically",
      "Uses 1-3 words consistently",
      "May have own words for objects",
      "Uses sounds or words to get attention"
    ],
    tips: [
      "Celebrate first words with excitement",
      "Repeat and expand on words",
      "Name objects throughout the day",
      "Read picture books and name items"
    ]
  }
])

# 6-12 Months - Receptive Language
Milestone.create!([
  {
    title: "Understands simple words and commands",
    description: "Baby begins to understand common words like their name, 'no', and simple commands.",
    category: "receptive_language",
    age_months_min: 8,
    age_months_max: 12,
    position: 6,
    active: true,
    indicators: [
      "Responds to own name",
      "Understands 'no'",
      "Looks at familiar objects when named",
      "Follows simple directions with gestures"
    ],
    tips: [
      "Use child's name frequently",
      "Give simple, clear instructions",
      "Point to objects while naming them",
      "Play naming games"
    ]
  }
])

# 12-18 Months - Expressive Language
Milestone.create!([
  {
    title: "Vocabulary of 5-20 words",
    description: "Toddler's spoken vocabulary expands to include multiple words for people, objects, and actions.",
    category: "expressive_language",
    age_months_min: 12,
    age_months_max: 18,
    position: 7,
    active: true,
    indicators: [
      "Uses 5-20 recognizable words",
      "Names familiar people and objects",
      "Uses words with gestures",
      "Attempts to repeat words"
    ],
    tips: [
      "Narrate daily activities",
      "Expand on child's single words",
      "Read simple books together daily",
      "Sing songs with actions"
    ]
  }
])

# 12-18 Months - Social Communication
Milestone.create!([
  {
    title: "Shows and shares objects",
    description: "Toddler begins to show objects to others and shares attention with caregivers.",
    category: "social_communication",
    age_months_min: 12,
    age_months_max: 18,
    position: 8,
    active: true,
    indicators: [
      "Shows objects to others",
      "Brings toys to share",
      "Points to show interest",
      "Enjoys interactive games"
    ],
    tips: [
      "Respond enthusiastically to sharing",
      "Play turn-taking games",
      "Comment on what child shows you",
      "Model sharing behaviors"
    ]
  }
])

# 18-24 Months - Expressive Language
Milestone.create!([
  {
    title: "Combines two words together",
    description: "Toddler starts combining words to form simple phrases like 'more milk' or 'daddy go'.",
    category: "expressive_language",
    age_months_min: 18,
    age_months_max: 24,
    position: 9,
    active: true,
    indicators: [
      "Combines 2 words ('more juice', 'bye bye daddy')",
      "Has vocabulary of 50+ words",
      "Names pictures in books",
      "Asks simple questions ('What that?')"
    ],
    tips: [
      "Expand two-word phrases into sentences",
      "Ask questions that encourage talking",
      "Read books with simple storylines",
      "Play pretend with toys"
    ]
  }
])

# 18-24 Months - Receptive Language
Milestone.create!([
  {
    title: "Follows two-step commands",
    description: "Toddler can understand and follow simple two-step directions.",
    category: "receptive_language",
    age_months_min: 18,
    age_months_max: 24,
    position: 10,
    active: true,
    indicators: [
      "Follows two-step directions ('Get your shoes and bring them here')",
      "Points to body parts when asked",
      "Identifies objects by function",
      "Understands simple questions"
    ],
    tips: [
      "Give clear, simple directions",
      "Praise following directions",
      "Play Simon Says games",
      "Read and follow simple recipes together"
    ]
  }
])

# 2-3 Years - Expressive Language
Milestone.create!([
  {
    title: "Speaks in 3-4 word sentences",
    description: "Child uses longer sentences and has rapidly expanding vocabulary.",
    category: "expressive_language",
    age_months_min: 24,
    age_months_max: 36,
    position: 11,
    active: true,
    indicators: [
      "Uses 3-4 word sentences",
      "Has vocabulary of 200+ words",
      "Asks 'what' and 'where' questions",
      "Talks about recent events"
    ],
    tips: [
      "Model longer, grammatically correct sentences",
      "Ask open-ended questions",
      "Encourage storytelling",
      "Introduce new vocabulary through themes"
    ]
  }
])

# 2-3 Years - Articulation
Milestone.create!([
  {
    title: "Speech is becoming clearer",
    description: "Child's speech becomes more intelligible, though some errors are still normal.",
    category: "articulation",
    age_months_min: 24,
    age_months_max: 36,
    position: 12,
    active: true,
    indicators: [
      "Familiar listeners understand most speech",
      "Produces p, b, m, h, w sounds",
      "May still make some sound errors",
      "Uses word endings like -ing"
    ],
    tips: [
      "Model correct pronunciation without forcing correction",
      "Respond to the message, not the mistakes",
      "Read aloud to model clear speech",
      "Sing songs and rhymes"
    ]
  }
])

# 3-4 Years - Expressive Language
Milestone.create!([
  {
    title: "Speaks in complete sentences",
    description: "Child uses grammatically correct sentences and tells simple stories.",
    category: "expressive_language",
    age_months_min: 36,
    age_months_max: 48,
    position: 13,
    active: true,
    indicators: [
      "Uses sentences with 4-5 words",
      "Tells simple stories",
      "Asks 'why' questions",
      "Uses plurals and past tense"
    ],
    tips: [
      "Have conversations about daily events",
      "Ask child to explain their thinking",
      "Read books and discuss the story",
      "Play imaginative games"
    ]
  }
])

# 3-4 Years - Receptive Language
Milestone.create!([
  {
    title: "Understands complex instructions",
    description: "Child can follow multi-step directions and understand more complex language.",
    category: "receptive_language",
    age_months_min: 36,
    age_months_max: 48,
    position: 14,
    active: true,
    indicators: [
      "Follows 2-3 step directions",
      "Understands positional concepts (in, on, under)",
      "Answers simple 'who, what, where' questions",
      "Understands basic time concepts"
    ],
    tips: [
      "Give multi-step directions during routines",
      "Play games involving following directions",
      "Ask comprehension questions about stories",
      "Introduce concepts through play"
    ]
  }
])

# 3-4 Years - Social Communication
Milestone.create!([
  {
    title: "Engages in conversations",
    description: "Child participates in back-and-forth conversations and takes turns talking.",
    category: "social_communication",
    age_months_min: 36,
    age_months_max: 48,
    position: 15,
    active: true,
    indicators: [
      "Takes turns in conversation",
      "Stays on topic",
      "Uses language to play with others",
      "Asks for information"
    ],
    tips: [
      "Practice turn-taking in conversations",
      "Encourage playing with peers",
      "Model polite conversation skills",
      "Ask questions that promote thinking"
    ]
  }
])

# 4-5 Years - Expressive Language
Milestone.create!([
  {
    title: "Uses complex sentences",
    description: "Child uses detailed sentences with descriptive language and tells longer stories.",
    category: "expressive_language",
    age_months_min: 48,
    age_months_max: 60,
    position: 16,
    active: true,
    indicators: [
      "Uses sentences with 5-6 words or more",
      "Tells detailed stories",
      "Uses time words (yesterday, tomorrow)",
      "Describes events in sequence"
    ],
    tips: [
      "Encourage detailed storytelling",
      "Ask 'why' and 'how' questions",
      "Discuss cause and effect",
      "Introduce new vocabulary regularly"
    ]
  }
])

# 4-5 Years - Articulation
Milestone.create!([
  {
    title: "Speech is mostly clear to strangers",
    description: "Child's speech is understood by unfamiliar listeners, though some errors may persist.",
    category: "articulation",
    age_months_min: 48,
    age_months_max: 60,
    position: 17,
    active: true,
    indicators: [
      "Strangers understand most speech",
      "Produces most sounds correctly",
      "May still have difficulty with r, l, s, th",
      "Uses correct word structure"
    ],
    tips: [
      "Continue modeling clear speech",
      "Play rhyming games",
      "Read tongue twisters for fun",
      "Don't overcorrect articulation"
    ]
  }
])

# 5-6 Years - Expressive Language
Milestone.create!([
  {
    title: "Communicates like an adult",
    description: "Child uses language similarly to adults, with complex grammar and extensive vocabulary.",
    category: "expressive_language",
    age_months_min: 60,
    age_months_max: 72,
    position: 18,
    active: true,
    indicators: [
      "Uses grammatically correct sentences",
      "Has vocabulary of 2000+ words",
      "Defines words",
      "Understands and uses complex concepts"
    ],
    tips: [
      "Engage in detailed discussions",
      "Introduce abstract concepts",
      "Encourage creative writing and storytelling",
      "Play word games and puzzles"
    ]
  }
])

# 5-6 Years - Articulation
Milestone.create!([
  {
    title: "Produces all speech sounds correctly",
    description: "Child can produce all speech sounds clearly in conversation.",
    category: "articulation",
    age_months_min: 60,
    age_months_max: 72,
    position: 19,
    active: true,
    indicators: [
      "Produces all sounds correctly including r, l, s, th",
      "Speech is fully intelligible",
      "Uses correct grammar consistently",
      "Speaks fluently"
    ],
    tips: [
      "Encourage public speaking opportunities",
      "Support reading fluency",
      "Play verbal games",
      "Model expressive, clear speech"
    ]
  }
])

# 5-6 Years - Social Communication
Milestone.create!([
  {
    title: "Uses language for varied purposes",
    description: "Child uses language to inform, persuade, entertain, and maintain relationships.",
    category: "social_communication",
    age_months_min: 60,
    age_months_max: 72,
    position: 20,
    active: true,
    indicators: [
      "Adjusts language based on listener",
      "Uses polite forms appropriately",
      "Tells jokes and understands humor",
      "Maintains conversations on various topics"
    ],
    tips: [
      "Discuss feelings and perspectives",
      "Practice problem-solving conversations",
      "Encourage empathy and understanding",
      "Support friendships through language"
    ]
  }
])

# 6-8 Years - Expressive Language
Milestone.create!([
  {
    title: "Uses sophisticated language",
    description: "Child uses advanced vocabulary, complex sentences, and understands figurative language.",
    category: "expressive_language",
    age_months_min: 72,
    age_months_max: 96,
    position: 21,
    active: true,
    indicators: [
      "Uses advanced vocabulary",
      "Understands idioms and figures of speech",
      "Tells detailed, organized stories",
      "Uses language to reason and explain"
    ],
    tips: [
      "Introduce idioms and their meanings",
      "Discuss multiple meanings of words",
      "Encourage creative writing",
      "Support presentation skills"
    ]
  }
])

# Additional milestones for Fluency category
Milestone.create!([
  {
    title: "Smooth, easy speech patterns",
    description: "Child speaks with smooth flow and rhythm, though some repetitions are normal in young children.",
    category: "fluency",
    age_months_min: 24,
    age_months_max: 60,
    position: 22,
    active: true,
    indicators: [
      "Speech flows smoothly most of the time",
      "Some repetitions are normal ('I-I-I want')",
      "Doesn't struggle to get words out",
      "Not frustrated by speech"
    ],
    tips: [
      "Give child plenty of time to speak",
      "Model slow, easy speech",
      "Don't finish sentences for them",
      "Reduce pressure to speak perfectly",
      "Listen patiently without rushing"
    ]
  },
  {
    title: "Speaks fluently without struggle",
    description: "School-age child speaks smoothly without significant repetitions or blocks.",
    category: "fluency",
    age_months_min: 60,
    age_months_max: 96,
    position: 23,
    active: true,
    indicators: [
      "Speaks fluently in most situations",
      "Minimal repetitions or hesitations",
      "Comfortable speaking in groups",
      "No signs of struggle or frustration"
    ],
    tips: [
      "Maintain relaxed communication environment",
      "Encourage participation in group discussions",
      "Model fluid, relaxed speech",
      "Address any concerns with speech therapist if needed"
    ]
  }
])

# Voice quality milestones
Milestone.create!([
  {
    title: "Appropriate voice quality",
    description: "Child's voice sounds clear, not hoarse or strained.",
    category: "voice",
    age_months_min: 0,
    age_months_max: 96,
    position: 24,
    active: true,
    indicators: [
      "Voice sounds clear and pleasant",
      "Not chronically hoarse or raspy",
      "Appropriate loudness",
      "No vocal strain"
    ],
    tips: [
      "Model appropriate voice volume",
      "Encourage water intake",
      "Avoid yelling when possible",
      "See doctor if voice is chronically hoarse"
    ]
  }
])

puts "Created #{Milestone.count} milestones"
