# Resources Seed Data
puts "Creating resource categories and resources..."

# Create Resource Categories
worksheets = ResourceCategory.find_or_create_by!(slug: "worksheets") do |rc|
  rc.name = "Worksheets"
  rc.description = "Printable worksheets for speech and language practice at home"
  rc.icon = "file-text"
  rc.color = "#008080"
  rc.position = 1
  rc.active = true
end

guides = ResourceCategory.find_or_create_by!(slug: "parent-guides") do |rc|
  rc.name = "Parent Guides"
  rc.description = "Comprehensive guides for parents on speech development topics"
  rc.icon = "book-open"
  rc.color = "#FF6B6B"
  rc.position = 2
  rc.active = true
end

checklists = ResourceCategory.find_or_create_by!(slug: "checklists") do |rc|
  rc.name = "Checklists"
  rc.description = "Developmental checklists and tracking tools"
  rc.icon = "check-square"
  rc.color = "#4ECDC4"
  rc.position = 3
  rc.active = true
end

activities = ResourceCategory.find_or_create_by!(slug: "activity-ideas") do |rc|
  rc.name = "Activity Ideas"
  rc.description = "Fun activity ideas to promote speech and language development"
  rc.icon = "lightbulb"
  rc.color = "#FFE66D"
  rc.position = 4
  rc.active = true
end

# Worksheets
[
  {
    resource_category: worksheets,
    title: "Articulation Practice: /R/ Sound Worksheets",
    slug: "articulation-r-sound-worksheets",
    description: "A comprehensive set of 15 worksheets targeting the /r/ sound in initial, medial, and final positions. Includes words, phrases, sentences, and fun coloring activities. Perfect for ages 5-8.",
    resource_type: "worksheet",
    file_size_bytes: 2_500_000, file_format: "PDF",
    tags: ["articulation", "r sound", "printable", "homework"],
    metadata: { pages: 15, suitable_for: "Ages 5-8", difficulty: "intermediate" },
    premium: false, active: true
  },
  {
    resource_category: worksheets,
    title: "Following Directions Worksheets (2-3 Steps)",
    slug: "following-directions-worksheets",
    description: "10 engaging worksheets that help children practice following 2-3 step directions through coloring and drawing activities.",
    resource_type: "worksheet",
    file_size_bytes: 1_800_000, file_format: "PDF",
    tags: ["following directions", "receptive language", "preschool"],
    metadata: { pages: 10, suitable_for: "Ages 3-5", difficulty: "beginner" },
    premium: false, active: true
  },
  {
    resource_category: worksheets,
    title: "Vocabulary Building: Seasonal Words",
    slug: "vocabulary-seasonal-words",
    description: "Four themed worksheets (one per season) featuring seasonal vocabulary, picture matching, and simple sentences.",
    resource_type: "worksheet",
    file_size_bytes: 3_200_000, file_format: "PDF",
    tags: ["vocabulary", "seasons", "themed activities"],
    metadata: { pages: 12, suitable_for: "Ages 3-6", difficulty: "beginner" },
    premium: false, active: true
  }
].each do |attrs|
  Resource.find_or_create_by!(slug: attrs[:slug]) do |r|
    r.assign_attributes(attrs.merge(download_count: 0))
  end
end

# Parent Guides
[
  {
    resource_category: guides,
    title: "Complete Guide to Late Talkers",
    slug: "complete-guide-late-talkers",
    description: "A comprehensive 25-page guide covering everything parents need to know about late talkers: red flags, when to seek help, home strategies, what to expect from therapy, and success stories.",
    resource_type: "guide",
    file_size_bytes: 4_500_000, file_format: "PDF",
    tags: ["late talker", "speech delay", "parent education", "comprehensive"],
    metadata: { pages: 25, author: "TalkieToys SLP Team", difficulty: "all levels" },
    premium: false, active: true
  },
  {
    resource_category: guides,
    title: "Stuttering in Young Children: A Parent's Guide",
    slug: "stuttering-young-children-guide",
    description: "Understand normal disfluency vs. stuttering, learn how to respond supportively, and discover when professional help is needed.",
    resource_type: "guide",
    file_size_bytes: 2_100_000, file_format: "PDF",
    tags: ["stuttering", "fluency", "parent support"],
    metadata: { pages: 12, author: "Dr. Sarah Williams, CCC-SLP", difficulty: "all levels" },
    premium: false, active: true
  },
  {
    resource_category: guides,
    title: "Bilingual Language Development: What's Normal?",
    slug: "bilingual-language-development",
    description: "Essential information for parents raising bilingual children. Learn about code-switching, potential delays, milestones, and how to support two languages simultaneously.",
    resource_type: "guide",
    file_size_bytes: 3_800_000, file_format: "PDF",
    tags: ["bilingual", "multilingual", "language development"],
    metadata: { pages: 18, author: "Maria Rodriguez, M.S., CCC-SLP", difficulty: "all levels" },
    premium: false, active: true
  }
].each do |attrs|
  Resource.find_or_create_by!(slug: attrs[:slug]) do |r|
    r.assign_attributes(attrs.merge(download_count: 0))
  end
end

# Checklists
[
  {
    resource_category: checklists,
    title: "Speech and Language Development Checklist (Birth to Age 5)",
    slug: "development-checklist-birth-to-five",
    description: "A comprehensive, printable checklist of speech and language milestones from birth through age 5. Organized by age range with space for notes and dates.",
    resource_type: "checklist",
    file_size_bytes: 850_000, file_format: "PDF",
    tags: ["milestones", "tracking", "development", "checklist"],
    metadata: { pages: 4, age_range: "0-5 years", fillable: true },
    premium: false, active: true
  },
  {
    resource_category: checklists,
    title: "Articulation Sounds Checklist",
    slug: "articulation-sounds-checklist",
    description: "Track which sounds your child can produce correctly at different ages. Includes developmental norms for sound acquisition.",
    resource_type: "checklist",
    file_size_bytes: 450_000, file_format: "PDF",
    tags: ["articulation", "sounds", "tracking"],
    metadata: { pages: 2, age_range: "2-8 years", fillable: true },
    premium: false, active: true
  },
  {
    resource_category: checklists,
    title: "Pre-Reading Skills Checklist",
    slug: "pre-reading-skills-checklist",
    description: "Assess your child's readiness for reading with this comprehensive checklist covering phonological awareness, letter knowledge, and early literacy skills.",
    resource_type: "checklist",
    file_size_bytes: 620_000, file_format: "PDF",
    tags: ["literacy", "reading readiness", "preschool"],
    metadata: { pages: 3, age_range: "3-6 years", fillable: true },
    premium: false, active: true
  }
].each do |attrs|
  Resource.find_or_create_by!(slug: attrs[:slug]) do |r|
    r.assign_attributes(attrs.merge(download_count: 0))
  end
end

# Activity Ideas
[
  {
    resource_category: activities,
    title: "50 Speech Therapy Activities Using Household Items",
    slug: "50-activities-household-items",
    description: "No fancy toys needed! 50 creative speech and language activities using items you already have at home. Organized by skill area.",
    resource_type: "template",
    file_size_bytes: 1_950_000, file_format: "PDF",
    tags: ["activities", "budget-friendly", "household items", "creative"],
    metadata: { pages: 20, difficulty: "all levels", cost: "free (uses household items)" },
    premium: false, active: true
  },
  {
    resource_category: activities,
    title: "Seasonal Speech and Language Activities",
    slug: "seasonal-speech-activities",
    description: "Month-by-month activity ideas with vocabulary lists, book recommendations, craft ideas, and outdoor activities.",
    resource_type: "infographic",
    file_size_bytes: 5_200_000, file_format: "PDF",
    tags: ["seasonal", "activities", "monthly themes"],
    metadata: { pages: 36, suitable_for: "Ages 2-6" },
    premium: false, active: true
  },
  {
    resource_category: activities,
    title: "Car Ride Language Games",
    slug: "car-ride-language-games",
    description: "Turn car time into learning time! 30 screen-free games and activities for developing language skills during car rides.",
    resource_type: "template",
    file_size_bytes: 980_000, file_format: "PDF",
    tags: ["car activities", "games", "on-the-go"],
    metadata: { pages: 8, age_range: "2-8 years", no_materials_needed: true },
    premium: false, active: true
  },
  {
    resource_category: activities,
    title: "Mealtime Language Building Strategies",
    slug: "mealtime-language-strategies",
    description: "Make every meal a language-learning opportunity! Practical strategies for building vocabulary and encouraging conversation during meals.",
    resource_type: "guide",
    file_size_bytes: 1_350_000, file_format: "PDF",
    tags: ["mealtime", "daily routines", "practical"],
    metadata: { pages: 10, difficulty: "beginner-friendly" },
    premium: false, active: true
  }
].each do |attrs|
  Resource.find_or_create_by!(slug: attrs[:slug]) do |r|
    r.assign_attributes(attrs.merge(download_count: 0))
  end
end

puts "Resource categories: #{ResourceCategory.count}"
puts "Resources: #{Resource.count}"
