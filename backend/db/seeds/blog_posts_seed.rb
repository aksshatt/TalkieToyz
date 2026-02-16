# Blog Posts Seed Data
puts "Creating blog posts..."

admin_user = User.find_by(role: :admin)

# Blog Post 1: Therapy Tips
blog1 = BlogPost.find_or_create_by!(slug: "10-speech-therapy-exercises-at-home") do |b|
  b.author_id = admin_user.id
  b.title = "10 Simple Speech Therapy Exercises You Can Do at Home"
  b.excerpt = "Discover easy and effective speech therapy activities that busy parents can incorporate into daily routines to support their child's language development."
  b.featured_image_url = "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800"
  b.category = "therapy_tips"
  b.tags = ["speech therapy", "home activities", "parent tips", "language development"]
  b.status = "published"
  b.published_at = 2.weeks.ago
  b.reading_time_minutes = 8
  b.allow_comments = true
  b.featured = true
  b.view_count = 0
  b.seo_metadata = {
    meta_title: "10 Easy Speech Therapy Exercises for Home | TalkieToys",
    meta_description: "Expert-approved speech therapy activities for busy parents. Simple exercises to boost your child's language skills at home.",
    keywords: ["speech therapy at home", "language exercises", "toddler speech activities"]
  }
  b.comments = []
end

blog1.content.body = <<~HTML
  <h2>Making Speech Therapy Fun at Home</h2>
  <p>As a parent, you are your child's best speech therapist! While professional speech therapy is invaluable, the practice that happens at home during everyday moments is equally important. Here are 10 simple exercises you can seamlessly integrate into your daily routine.</p>

  <h3>1. Mirror Play</h3>
  <p>Sit in front of a mirror with your child and practice making different sounds together. This helps children see how their mouth moves to make different sounds.</p>
  <ul>
    <li>Make exaggerated sounds like "oooh" and "eeee"</li>
    <li>Practice lip movements like kisses and raspberries</li>
    <li>Stick out tongues and move them side to side</li>
  </ul>

  <h3>2. Sound Scavenger Hunt</h3>
  <p>Choose a target sound (like /b/ or /s/) and hunt around the house for objects that start with that sound. This makes practicing sounds exciting and active!</p>

  <h3>3. Narrate Your Day</h3>
  <p>As you go about daily activities, narrate what you're doing in simple, clear language. "I'm washing the dishes. The water is warm. This plate is round."</p>

  <h3>4. Pause and Wait</h3>
  <p>During conversations or play, pause and give your child time to respond. Count to 5 in your head before helping them. This gives them the opportunity to initiate communication.</p>

  <h3>5. Expand Their Words</h3>
  <p>When your child says a word or phrase, expand it slightly. If they say "dog," you say "Yes, big brown dog!" This models more complex language naturally.</p>

  <h3>6. Sing Songs with Actions</h3>
  <p>Songs like "The Wheels on the Bus" or "If You're Happy and You Know It" combine language with movement, making them powerful learning tools.</p>

  <h3>7. Read Interactive Books</h3>
  <p>Choose books with:  <ul>
    <li>Repetitive phrases your child can join in on</li>
    <li>Lift-the-flap elements to encourage interaction</li>
    <li>Questions that prompt responses</li>
  </ul>

  <h3>8. Play with Sounds</h3>
  <p>Make silly sounds during play. Animal sounds, car engine noises, and environmental sounds (like wind or rain) are all great for oral motor practice.</p>

  <h3>9. Choice Making</h3>
  <p>Throughout the day, offer choices: "Do you want the red cup or blue cup?" This encourages language use in a low-pressure way.</p>

  <h3>10. Celebrate Attempts</h3>
  <p>The most important exercise is positive reinforcement. Celebrate all attempts at communication, even if the words aren't perfect yet.</p>

  <h2>Tips for Success</h2>
  <ul>
    <li><strong>Be consistent:</strong> Practice a little bit every day rather than long sessions</li>
    <li><strong>Follow their lead:</strong> Work with your child's interests</li>
    <li><strong>Keep it fun:</strong> If it feels like work, take a break</li>
    <li><strong>Be patient:</strong> Progress takes time</li>
  </ul>

  <p>Remember, every child develops at their own pace. If you have concerns about your child's speech development, consult with a speech-language pathologist for personalized guidance.</p>
HTML

# Blog Post 2: Product Guide
blog2 = BlogPost.find_or_create_by!(slug: "choosing-speech-therapy-toys-guide") do |b|
  b.author_id = admin_user.id
  b.title = "Choosing the Right Speech Therapy Toy: A Parent's Guide"
  b.excerpt = "Not sure which toys will best support your child's speech development? This comprehensive guide helps you select age-appropriate, engaging tools."
  b.featured_image_url = "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800"
  b.category = "product_guides"
  b.tags = ["toys", "product selection", "age-appropriate", "buying guide"]
  b.status = "published"
  b.published_at = 10.days.ago
  b.reading_time_minutes = 6
  b.allow_comments = true
  b.featured = true
  b.view_count = 0
  b.seo_metadata = {
    meta_title: "Best Speech Therapy Toys by Age | Expert Buying Guide",
    meta_description: "Find the perfect speech therapy toys for your child. Expert recommendations organized by age and developmental stage.",
    keywords: ["speech therapy toys", "language development toys", "educational toys"]
  }
  b.comments = []
end

blog2.content.body = <<~HTML
  <h2>The Power of Play in Speech Development</h2>
  <p>Play isn't just fun—it's how children learn! The right toys can transform speech therapy from a chore into an engaging activity that your child looks forward to. But with countless options available, how do you choose?</p>

  <h2>Key Features to Look For</h2>
  <p>Regardless of your child's age, excellent speech therapy toys share these characteristics:</p>
  <ul>
    <li><strong>Interactive:</strong> Encourages back-and-forth communication</li>
    <li><strong>Open-ended:</strong> Allows for creative, imaginative play</li>
    <li><strong>Engaging:</strong> Captures and holds your child's interest</li>
    <li><strong>Age-appropriate:</strong> Matches your child's developmental level</li>
    <li><strong>Durable:</strong> Built to withstand enthusiastic use</li>
  </ul>

  <h2>By Age: 12-24 Months</h2>
  <h3>Focus: First Words and Sounds</h3>
  <p>At this stage, look for toys that:</p>
  <ul>
    <li>Make sounds when manipulated</li>
    <li>Have clear cause-and-effect relationships</li>
    <li>Feature familiar objects</li>
    <li>Encourage imitation</li>
  </ul>
  <p><strong>Top picks:</strong> Musical instruments, animal figurines with sounds, shape sorters with sound effects, simple puzzles with large pieces.</p>

  <h2>By Age: 2-3 Years</h2>
  <h3>Focus: Building Vocabulary</h3>
  <p>Toddlers at this stage benefit from:</p>
  <ul>
    <li>Pretend play toys (play kitchen, doctor kit)</li>
    <li>Animal and people figurines</li>
    <li>Simple board games</li>
    <li>Books with repetitive phrases</li>
  </ul>
  <p><strong>Why these work:</strong> Pretend play naturally generates lots of language opportunities and repetition helps solidify new words.</p>

  <h2>By Age: 3-4 Years</h2>
  <h3>Focus: Sentence Building and Storytelling</h3>
  <p>Preschoolers are ready for:</p>
  <ul>
    <li>Dollhouses or play sets with multiple characters</li>
    <li>Dress-up clothes and props</li>
    <li>More complex board games</li>
    <li>Art supplies for describing creations</li>
  </ul>
  <p><strong>The benefit:</strong> These toys encourage longer sentences and connected ideas.</p>

  <h2>By Age: 5-8 Years</h2>
  <h3>Focus: Articulation and Complex Language</h3>
  <p>School-age children thrive with:</p>
  <ul>
    <li>Card games that require verbal responses</li>
    <li>Building sets with instructions to follow</li>
    <li>Games involving categories and descriptions</li>
    <li>Science kits that prompt questions and explanations</li>
  </ul>

  <h2>Universal Winners</h2>
  <p>Some toys work across multiple ages and stages:</p>
  <ul>
    <li><strong>Bubbles:</strong> Perfect for practicing sounds like /b/ and /p/, turn-taking, and requesting</li>
    <li><strong>Play-Doh:</strong> Endless creative possibilities that generate natural conversation</li>
    <li><strong>Balls:</strong> Great for action words and back-and-forth play</li>
    <li><strong>Books:</strong> The ultimate language learning tool at any age</li>
  </ul>

  <h2>Making the Most of Any Toy</h2>
  <p>Remember: <em>You</em> are the most important part of the equation! The best toy in the world won't help if used in isolation. Engage with your child during play:</p>
  <ul>
    <li>Narrate actions</li>
    <li>Ask open-ended questions</li>
    <li>Model new vocabulary</li>
    <li>Follow your child's lead and interests</li>
  </ul>

  <p>Browse our curated collection of speech therapy toys, carefully selected by speech-language pathologists to maximize language learning through play!</p>
HTML

# Blog Post 3: Milestones
blog3 = BlogPost.find_or_create_by!(slug: "speech-milestones-birth-to-five") do |b|
  b.author_id = admin_user.id
  b.title = "Speech and Language Milestones: What to Expect from Birth to Age 5"
  b.excerpt = "Understanding typical speech development helps you celebrate your child's progress and identify when extra support might be helpful."
  b.featured_image_url = "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800"
  b.category = "milestones"
  b.tags = ["milestones", "development", "speech development", "ages and stages"]
  b.status = "published"
  b.published_at = 3.weeks.ago
  b.reading_time_minutes = 10
  b.allow_comments = true
  b.featured = false
  b.view_count = 0
  b.seo_metadata = {
    meta_title: "Speech Development Milestones: Birth to Age 5 | TalkieToys",
    meta_description: "Complete guide to speech and language milestones from birth through age 5. Know what to expect and when to seek help.",
    keywords: ["speech milestones", "language development stages", "child development"]
  }
  b.comments = []
end

blog3.content.body = <<~HTML
  <h2>Every Child's Journey is Unique</h2>
  <p>While there are general patterns in speech and language development, every child develops at their own pace. Use these milestones as a guide, not a strict timeline. If you have concerns at any stage, consult with a speech-language pathologist.</p>

  <h2>Birth to 6 Months: The Foundation</h2>
  <h3>What You'll Hear:</h3>
  <ul>
    <li>Crying (their first communication!)</li>
    <li>Cooing sounds by 2-3 months</li>
    <li>Laughter by 4 months</li>
    <li>Babbling begins around 6 months</li>
  </ul>
  <h3>What They Understand:</h3>
  <ul>
    <li>Recognizes familiar voices</li>
    <li>Turns toward sounds</li>
    <li>Responds to changes in tone of voice</li>
    <li>Enjoys music and singing</li>
  </ul>

  <h2>6 to 12 Months: First Words Emerge</h2>
  <h3>What You'll Hear:</h3>
  <ul>
    <li>Babbling becomes more speech-like ("ba-ba-ba", "da-da-da")</li>
    <li>First words typically appear between 10-14 months</li>
    <li>Uses gestures like waving and pointing</li>
    <li>Imitates different speech sounds</li>
  </ul>
  <h3>What They Understand:</h3>
  <ul>
    <li>Responds to own name</li>
    <li>Understands "no"</li>
    <li>Follows simple one-step commands with gestures</li>
    <li>Recognizes words for common objects</li>
  </ul>

  <h2>12 to 18 Months: Vocabulary Explodes</h2>
  <h3>What You'll Hear:</h3>
  <ul>
    <li>Vocabulary of 5-20 words by 18 months</li>
    <li>Says "mama" and "dada" specifically</li>
    <li>Names familiar objects</li>
    <li>Uses words along with gestures</li>
  </ul>

  <h2>18 to 24 Months: Word Combinations Begin</h2>
  <h3>What You'll Hear:</h3>
  <ul>
    <li>Combines two words ("more juice", "daddy go")</li>
    <li>Vocabulary of 50+ words by 24 months</li>
    <li>Names pictures in books</li>
    <li>Asks simple questions ("What that?")</li>
  </ul>

  <h2>2 to 3 Years: Sentences Form</h2>
  <h3>What You'll Hear:</h3>
  <ul>
    <li>Uses 3-4 word sentences</li>
    <li>Vocabulary of 200+ words</li>
    <li>Asks "what" and "where" questions</li>
    <li>Familiar listeners understand about 75% of speech</li>
  </ul>

  <h2>3 to 4 Years: Conversation Skills Develop</h2>
  <h3>What You'll Hear:</h3>
  <ul>
    <li>Uses 4-5 word sentences</li>
    <li>Tells simple stories</li>
    <li>Asks many questions including "why"</li>
    <li>Strangers understand most of what they say</li>
  </ul>

  <h2>4 to 5 Years: Ready for School</h2>
  <h3>What You'll Hear:</h3>
  <ul>
    <li>Uses sentences with many details</li>
    <li>Tells stories that stick to a topic</li>
    <li>Communicates easily with adults and children</li>
    <li>Says most sounds correctly (may still have trouble with r, l, s, th)</li>
  </ul>

  <h2>When to Seek Help</h2>
  <p>Trust your instincts! If you're concerned about your child's speech development, it's always better to get an evaluation. Early intervention makes a significant difference.</p>
  <p>Take our free online assessments to get a better understanding of your child's current development and receive personalized recommendations!</p>
HTML

# Blog Post 4: Screen Time
blog4 = BlogPost.find_or_create_by!(slug: "screen-time-and-speech-development") do |b|
  b.author_id = admin_user.id
  b.title = "Screen Time and Speech Development: Finding the Right Balance"
  b.excerpt = "Research-based guidance on managing screen time to support, rather than hinder, your child's language development."
  b.featured_image_url = "https://images.unsplash.com/photo-1604158430996-5ef5184b9c7c?w=800"
  b.category = "parent_resources"
  b.tags = ["screen time", "technology", "parent advice", "research"]
  b.status = "published"
  b.published_at = 5.days.ago
  b.reading_time_minutes = 7
  b.allow_comments = true
  b.featured = false
  b.view_count = 0
  b.seo_metadata = {
    meta_title: "Screen Time & Speech Development: Science-Based Guide",
    meta_description: "How does screen time affect speech development? Expert advice on healthy media use for language learning.",
    keywords: ["screen time children", "speech development", "technology and language"]
  }
  b.comments = []
end

blog4.content.body = <<~HTML
  <h2>The Modern Parenting Dilemma</h2>
  <p>Screens are everywhere, and as parents, we're constantly wondering: How much is too much? Is screen time always bad? Can tablets actually help with language learning? Let's dive into what research tells us.</p>

  <h2>What the Research Shows</h2>
  <p>The American Academy of Pediatrics (AAP) offers these guidelines:</p>
  <ul>
    <li><strong>Under 18 months:</strong> Avoid screen media except video chatting</li>
    <li><strong>18-24 months:</strong> If introducing digital media, choose high-quality programming and watch together</li>
    <li><strong>2-5 years:</strong> Limit to 1 hour per day of high-quality programs, co-viewed with a parent</li>
    <li><strong>6 years and older:</strong> Place consistent limits on time and types of media</li>
  </ul>

  <h2>Why Does Screen Time Matter for Speech?</h2>
  <p>Language develops through <em>reciprocal interaction</em>—the back-and-forth exchange between child and caregiver that researchers call "serve and return." This is difficult to achieve with screen-based activities.</p>

  <h2>Making Screen Time More Language-Rich</h2>
  <h3>1. Watch Together</h3>
  <p>Co-viewing transforms passive watching into an interactive experience. Talk about what you're watching, ask questions, and relate the content to your child's life.</p>

  <h3>2. Choose Quality Content</h3>
  <p>Look for programs with clear educational goals that model appropriate social interactions and invite child participation.</p>

  <h3>3. Follow Up with Real-World Connections</h3>
  <p>After screen time, extend the learning by connecting what was watched to real-life experiences.</p>

  <h2>The Bottom Line</h2>
  <p>Screens aren't inherently evil, but they're also not a substitute for human interaction. The key is intentional use: less is more, choose high-quality content, watch together, and balance with plenty of screen-free play and conversation.</p>

  <p>Remember: <strong>Nothing beats the language-building power of a responsive, engaged caregiver.</strong></p>
HTML

# Blog Post 5: Success Story
blog5 = BlogPost.find_or_create_by!(slug: "emmas-speech-development-journey") do |b|
  b.author_id = admin_user.id
  b.title = "From Silent to Singing: Emma's Speech Development Journey"
  b.excerpt = "A mother shares how her daughter went from speaking only 5 words at age 3 to confidently communicating—and singing!—by kindergarten."
  b.featured_image_url = "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800"
  b.category = "success_stories"
  b.tags = ["parent story", "speech therapy success", "inspiration", "late talker"]
  b.status = "published"
  b.published_at = 1.month.ago
  b.reading_time_minutes = 5
  b.allow_comments = true
  b.featured = false
  b.view_count = 0
  b.seo_metadata = {
    meta_title: "Success Story: Overcoming Late Talking | TalkieToys Blog",
    meta_description: "An inspiring story of a child's journey from late talker to confident communicator through speech therapy and family support.",
    keywords: ["late talker success", "speech therapy results", "parent testimonial"]
  }
  b.comments = []
end

blog5.content.body = <<~HTML
  <p><em>This story is shared with permission from Emma's mother, Lisa.</em></p>

  <h2>The Worry Begins</h2>
  <p>"Something's not right." I remember thinking this at Emma's second birthday party. While other toddlers chatted away, my daughter communicated almost entirely through gestures and a few scattered words.</p>

  <h2>Getting Help</h2>
  <p>When Emma turned three with a vocabulary of just five words, I finally called for a speech evaluation. The evaluation confirmed a significant expressive language delay.</p>

  <h2>The Journey Begins</h2>
  <p>Emma started speech therapy twice a week. Our therapist taught us to narrate everything, wait and encourage, expand her words, and follow her lead.</p>

  <h2>The Breakthrough</h2>
  <p>By age four, Emma was speaking in short sentences. The moment I knew we'd turned a corner was during a car ride when Emma started singing "Let It Go"—every single word, at the top of her lungs.</p>

  <h2>What I Wish I'd Known</h2>
  <ol>
    <li><strong>Trust your instincts.</strong> If you're concerned, seek an evaluation.</li>
    <li><strong>It's not your fault.</strong> Some kids just need extra support.</li>
    <li><strong>Progress isn't linear.</strong> There will be plateaus and then sudden leaps.</li>
    <li><strong>Consistency matters more than intensity.</strong></li>
    <li><strong>Celebrate tiny wins.</strong> Every new word is a victory.</li>
  </ol>

  <p>If you're reading this with a late talker of your own, please know: there is hope. With the right support, tremendous progress is possible.</p>
HTML

# Blog Post 6: Picky Eating
blog6 = BlogPost.find_or_create_by!(slug: "picky-eating-speech-development-connection") do |b|
  b.author_id = admin_user.id
  b.title = "The Connection Between Picky Eating and Speech Development"
  b.excerpt = "Did you know that oral motor skills affect both eating and speaking? Learn how addressing picky eating can support speech development."
  b.featured_image_url = "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800"
  b.category = "therapy_tips"
  b.tags = ["picky eating", "oral motor skills", "feeding", "speech therapy"]
  b.status = "published"
  b.published_at = 1.week.ago
  b.reading_time_minutes = 6
  b.allow_comments = true
  b.featured = false
  b.view_count = 0
  b.seo_metadata = {
    meta_title: "Picky Eating & Speech: The Surprising Connection",
    meta_description: "Discover how oral motor skills connect picky eating and speech development, plus strategies to help both.",
    keywords: ["picky eating speech", "oral motor development", "feeding therapy"]
  }
  b.comments = []
end

blog6.content.body = <<~HTML
  <h2>More Connected Than You Think</h2>
  <p>If your child is both a picky eater and has speech delays, these challenges are often related. The same oral motor muscles used for eating are also crucial for speech production.</p>

  <h2>How Picky Eating Can Affect Speech</h2>
  <p>Children who eat only soft, pureed foods miss out on the oral motor practice that comes from chewing various textures. This can lead to reduced tongue strength, less jaw stability, and difficulty with tongue lateralization.</p>

  <h2>Strengthening Oral Motor Skills Through Eating</h2>
  <p>Introduce varied textures gradually, make eating playful, and try foods that build speech muscles: crunchy foods for jaw strength, chewy foods for endurance, and resistive foods for lip and cheek strength.</p>

  <h2>Non-Food Oral Motor Activities</h2>
  <ul>
    <li><strong>Bubble blowing:</strong> Strengthens lip rounding</li>
    <li><strong>Kazoos and whistles:</strong> Build lip strength</li>
    <li><strong>Straws:</strong> Drinking thick smoothies or blowing cotton balls</li>
    <li><strong>Silly faces:</strong> Stick out tongue, make raspberries, puff cheeks</li>
  </ul>

  <h2>When to Seek Professional Help</h2>
  <p>Consider consulting with a specialist if your child eats fewer than 20 different foods, gags frequently, has extreme reactions to food textures, or is not growing appropriately.</p>

  <p>Explore our collection of oral motor tools and feeding therapy toys designed to make building these crucial skills fun and engaging!</p>
HTML

puts "Blog posts: #{BlogPost.count}"
