# Resources Seed Data
puts "Creating resource categories and resources..."

ResourceCategory.destroy_all
Resource.destroy_all

# Create Resource Categories
worksheets = ResourceCategory.create!(
  name: "Worksheets",
  slug: "worksheets",
  description: "Printable worksheets for speech and language practice at home",
  icon: "file-text",
  color: "#008080",
  position: 1,
  active: true
)

guides = ResourceCategory.create!(
  name: "Parent Guides",
  slug: "parent-guides",
  description: "Comprehensive guides for parents on speech development topics",
  icon: "book-open",
  color: "#FF6B6B",
  position: 2,
  active: true
)

checklists = ResourceCategory.create!(
  name: "Checklists",
  slug: "checklists",
  description: "Developmental checklists and tracking tools",
  icon: "check-square",
  color: "#4ECDC4",
  position: 3,
  active: true
)

activities = ResourceCategory.create!(
  name: "Activity Ideas",
  slug: "activity-ideas",
  description: "Fun activity ideas to promote speech and language development",
  icon: "lightbulb",
  color: "#FFE66D",
  position: 4,
  active: true
)

# Create Resources

# Worksheets Category
Resource.create!([
  {
    resource_category: worksheets,
    title: "Articulation Practice: /R/ Sound Worksheets",
    slug: "articulation-r-sound-worksheets",
    description: "A comprehensive set of 15 worksheets targeting the /r/ sound in initial, medial, and final positions. Includes words, phrases, sentences, and fun coloring activities. Perfect for ages 5-8.",
    resource_type: "worksheet",
    file_size_bytes: 2_500_000,
    file_format: "PDF",
    download_count: 342,
    tags: ["articulation", "r sound", "printable", "homework"],
    metadata: {
      pages: 15,
      suitable_for: "Ages 5-8",
      difficulty: "intermediate"
    },
    premium: false,
    active: true
  },
  {
    resource_category: worksheets,
    title: "Following Directions Worksheets (2-3 Steps)",
    slug: "following-directions-worksheets",
    description: "10 engaging worksheets that help children practice following 2-3 step directions through coloring and drawing activities. Great for receptive language development.",
    resource_type: "worksheet",
    file_size_bytes: 1_800_000,
    file_format: "PDF",
    download_count: 567,
    tags: ["following directions", "receptive language", "preschool"],
    metadata: {
      pages: 10,
      suitable_for: "Ages 3-5",
      difficulty: "beginner"
    },
    premium: false,
    active: true
  },
  {
    resource_category: worksheets,
    title: "Vocabulary Building: Seasonal Words",
    slug: "vocabulary-seasonal-words",
    description: "Four themed worksheets (one per season) featuring seasonal vocabulary, picture matching, and simple sentences. Includes spring, summer, fall, and winter themes.",
    resource_type: "worksheet",
    file_size_bytes: 3_200_000,
    file_format: "PDF",
    download_count: 423,
    tags: ["vocabulary", "seasons", "themed activities"],
    metadata: {
      pages: 12,
      suitable_for: "Ages 3-6",
      difficulty: "beginner"
    },
    premium: false,
    active: true
  }
])

# Parent Guides Category
Resource.create!([
  {
    resource_category: guides,
    title: "Complete Guide to Late Talkers",
    slug: "complete-guide-late-talkers",
    description: "A comprehensive 25-page guide covering everything parents need to know about late talkers: red flags, when to seek help, home strategies, what to expect from therapy, and success stories. Written by certified speech-language pathologists.",
    resource_type: "guide",
    file_size_bytes: 4_500_000,
    file_format: "PDF",
    download_count: 1_234,
    tags: ["late talker", "speech delay", "parent education", "comprehensive"],
    metadata: {
      pages: 25,
      author: "TalkieToys SLP Team",
      difficulty: "all levels"
    },
    premium: false,
    active: true
  },
  {
    resource_category: guides,
    title: "Stuttering in Young Children: A Parent's Guide",
    slug: "stuttering-young-children-guide",
    description: "Understand normal disfluency vs. stuttering, learn how to respond supportively, and discover when professional help is needed. Includes practical strategies for reducing pressure and creating a supportive environment.",
    resource_type: "guide",
    file_size_bytes: 2_100_000,
    file_format: "PDF",
    download_count: 456,
    tags: ["stuttering", "fluency", "parent support"],
    metadata: {
      pages: 12,
      author: "Dr. Sarah Williams, CCC-SLP",
      difficulty: "all levels"
    },
    premium: false,
    active: true
  },
  {
    resource_category: guides,
    title: "Bilingual Language Development: What's Normal?",
    slug: "bilingual-language-development",
    description: "Essential information for parents raising bilingual children. Learn about code-switching, potential delays, milestones for bilingual children, and how to support two languages simultaneously.",
    resource_type: "guide",
    file_size_bytes: 3_800_000,
    file_format: "PDF",
    download_count: 789,
    tags: ["bilingual", "multilingual", "language development"],
    metadata: {
      pages: 18,
      author: "Maria Rodriguez, M.S., CCC-SLP",
      difficulty: "all levels"
    },
    premium: false,
    active: true
  }
])

# Checklists Category
Resource.create!([
  {
    resource_category: checklists,
    title: "Speech and Language Development Checklist (Birth to Age 5)",
    slug: "development-checklist-birth-to-five",
    description: "A comprehensive, printable checklist of speech and language milestones from birth through age 5. Organized by age range with space for notes and dates. Perfect for tracking your child's progress or preparing for pediatrician visits.",
    resource_type: "checklist",
    file_size_bytes: 850_000,
    file_format: "PDF",
    download_count: 2_345,
    tags: ["milestones", "tracking", "development", "checklist"],
    metadata: {
      pages: 4,
      age_range: "0-5 years",
      fillable: true
    },
    premium: false,
    active: true
  },
  {
    resource_category: checklists,
    title: "Articulation Sounds Checklist",
    slug: "articulation-sounds-checklist",
    description: "Track which sounds your child can produce correctly at different ages. Includes developmental norms for sound acquisition and space to note concerns or progress.",
    resource_type: "checklist",
    file_size_bytes: 450_000,
    file_format: "PDF",
    download_count: 987,
    tags: ["articulation", "sounds", "tracking"],
    metadata: {
      pages: 2,
      age_range: "2-8 years",
      fillable: true
    },
    premium: false,
    active: true
  },
  {
    resource_category: checklists,
    title: "Pre-Reading Skills Checklist",
    slug: "pre-reading-skills-checklist",
    description: "Assess your child's readiness for reading with this comprehensive checklist covering phonological awareness, letter knowledge, and early literacy skills.",
    resource_type: "checklist",
    file_size_bytes: 620_000,
    file_format: "PDF",
    download_count: 1_123,
    tags: ["literacy", "reading readiness", "preschool"],
    metadata: {
      pages: 3,
      age_range: "3-6 years",
      fillable: true
    },
    premium: false,
    active: true
  }
])

# Activity Ideas Category
Resource.create!([
  {
    resource_category: activities,
    title: "50 Speech Therapy Activities Using Household Items",
    slug: "50-activities-household-items",
    description: "No fancy toys needed! This resource provides 50 creative speech and language activities using items you already have at home—from kitchen utensils to bathroom supplies. Organized by skill area.",
    resource_type: "template",
    file_size_bytes: 1_950_000,
    file_format: "PDF",
    download_count: 1_876,
    tags: ["activities", "budget-friendly", "household items", "creative"],
    metadata: {
      pages: 20,
      difficulty: "all levels",
      cost: "free (uses household items)"
    },
    premium: false,
    active: true
  },
  {
    resource_category: activities,
    title: "Seasonal Speech and Language Activities",
    slug: "seasonal-speech-activities",
    description: "Month-by-month activity ideas that incorporate seasonal themes. Each month includes vocabulary lists, book recommendations, craft ideas with language targets, and outdoor activities.",
    resource_type: "infographic",
    file_size_bytes: 5_200_000,
    file_format: "PDF",
    download_count: 1_432,
    tags: ["seasonal", "activities", "monthly themes"],
    metadata: {
      pages: 36,
      suitable_for: "Ages 2-6",
      beautifully_illustrated: true
    },
    premium: false,
    active: true
  },
  {
    resource_category: activities,
    title: "Car Ride Language Games",
    slug: "car-ride-language-games",
    description: "Turn car time into learning time! 30 screen-free games and activities perfect for developing language skills during car rides, organized by age group and skill level.",
    resource_type: "template",
    file_size_bytes: 980_000,
    file_format: "PDF",
    download_count: 2_109,
    tags: ["car activities", "games", "on-the-go"],
    metadata: {
      pages: 8,
      age_range: "2-8 years",
      no_materials_needed: true
    },
    premium: false,
    active: true
  },
  {
    resource_category: activities,
    title: "Mealtime Language Building Strategies",
    slug: "mealtime-language-strategies",
    description: "Make every meal a language-learning opportunity! Practical strategies for building vocabulary, practicing sounds, encouraging conversation, and modeling language during breakfast, lunch, and dinner.",
    resource_type: "guide",
    file_size_bytes: 1_350_000,
    file_format: "PDF",
    download_count: 1_654,
    tags: ["mealtime", "daily routines", "practical"],
    metadata: {
      pages: 10,
      difficulty: "beginner-friendly",
      includes_sample_conversations: true
    },
    premium: false,
    active: true
  }
])

puts "Created #{ResourceCategory.count} resource categories"
puts "Created #{Resource.count} resources"
puts "Note: File attachments would be uploaded separately via Active Storage"
