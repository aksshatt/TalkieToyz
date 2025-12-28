# Blog Posts Seed Data
puts "Creating blog posts..."

BlogPost.destroy_all

# Get the first admin user (should already exist from main seeds.rb)
admin_user = User.find_by(role: :admin)

# Blog Post 1: Therapy Tips
blog1 = BlogPost.create!(
  author_id: admin_user.id,
  title: "10 Simple Speech Therapy Exercises You Can Do at Home",
  slug: "10-speech-therapy-exercises-at-home",
  excerpt: "Discover easy and effective speech therapy activities that busy parents can incorporate into daily routines to support their child's language development.",
  featured_image_url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800",
  category: "therapy_tips",
  tags: ["speech therapy", "home activities", "parent tips", "language development"],
  status: "published",
  published_at: 2.weeks.ago,
  reading_time_minutes: 8,
  allow_comments: true,
  featured: true,
  view_count: 245,
  seo_metadata: {
    meta_title: "10 Easy Speech Therapy Exercises for Home | TalkieToys",
    meta_description: "Expert-approved speech therapy activities for busy parents. Simple exercises to boost your child's language skills at home.",
    keywords: ["speech therapy at home", "language exercises", "toddler speech activities"]
  },
  comments: [
    {
      id: 1,
      author_name: "Sarah Johnson",
      author_email: "sarah@example.com",
      content: "These exercises have been so helpful! My 3-year-old loves the animal sounds game.",
      created_at: 1.week.ago.iso8601,
      approved: true
    },
    {
      id: 2,
      author_name: "Mike Chen",
      author_email: "mike@example.com",
      content: "Great practical tips. We do #5 every morning at breakfast now!",
      created_at: 5.days.ago.iso8601,
      approved: true
    }
  ]
)

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
blog2 = BlogPost.create!(
  author_id: admin_user.id,
  title: "Choosing the Right Speech Therapy Toy: A Parent's Guide",
  slug: "choosing-speech-therapy-toys-guide",
  excerpt: "Not sure which toys will best support your child's speech development? This comprehensive guide helps you select age-appropriate, engaging tools.",
  featured_image_url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800",
  category: "product_guides",
  tags: ["toys", "product selection", "age-appropriate", "buying guide"],
  status: "published",
  published_at: 10.days.ago,
  reading_time_minutes: 6,
  allow_comments: true,
  featured: true,
  view_count: 189,
  seo_metadata: {
    meta_title: "Best Speech Therapy Toys by Age | Expert Buying Guide",
    meta_description: "Find the perfect speech therapy toys for your child. Expert recommendations organized by age and developmental stage.",
    keywords: ["speech therapy toys", "language development toys", "educational toys"]
  },
  comments: []
)

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

  <h2>Red Flags to Avoid</h2>
  <p>Steer clear of toys that:</p>
  <ul>
    <li>Do all the "talking" without requiring child participation</li>
    <li>Have only one way to play</li>
    <li>Are too complex or frustrating for your child's level</li>
    <li>Focus solely on screen-based interaction</li>
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
blog3 = BlogPost.create!(
  author_id: admin_user.id,
  title: "Speech and Language Milestones: What to Expect from Birth to Age 5",
  slug: "speech-milestones-birth-to-five",
  excerpt: "Understanding typical speech development helps you celebrate your child's progress and identify when extra support might be helpful.",
  featured_image_url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800",
  category: "milestones",
  tags: ["milestones", "development", "speech development", "ages and stages"],
  status: "published",
  published_at: 3.weeks.ago,
  reading_time_minutes: 10,
  allow_comments: true,
  featured: false,
  view_count: 312,
  seo_metadata: {
    meta_title: "Speech Development Milestones: Birth to Age 5 | TalkieToys",
    meta_description: "Complete guide to speech and language milestones from birth through age 5. Know what to expect and when to seek help.",
    keywords: ["speech milestones", "language development stages", "child development"]
  },
  comments: [
    {
      id: 1,
      author_name: "Emma Rodriguez",
      author_email: "emma@example.com",
      content: "This is so helpful! My son is 18 months and right on track according to this guide.",
      created_at: 2.weeks.ago.iso8601,
      approved: true
    }
  ]
)

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
  <h3>Red Flags:</h3>
  <p>Consult a professional if your baby doesn't respond to loud sounds or hasn't started making vowel sounds by 6 months.</p>

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
  <h3>Red Flags:</h3>
  <p>Be concerned if your baby isn't babbling by 12 months or doesn't use gestures like pointing or waving.</p>

  <h2>12 to 18 Months: Vocabulary Explodes</h2>
  <h3>What You'll Hear:</h3>
  <ul>
    <li>Vocabulary of 5-20 words by 18 months</li>
    <li>Says "mama" and "dada" specifically</li>
    <li>Names familiar objects</li>
    <li>Uses words along with gestures</li>
  </ul>
  <h3>What They Understand:</h3>
  <ul>
    <li>Points to body parts when asked</li>
    <li>Follows simple commands without gestures</li>
    <li>Brings objects when requested</li>
    <li>Understands simple questions</li>
  </ul>
  <h3>Red Flags:</h3>
  <p>Seek evaluation if your child isn't saying any words by 16 months or doesn't point to show things to others.</p>

  <h2>18 to 24 Months: Word Combinations Begin</h2>
  <h3>What You'll Hear:</h3>
  <ul>
    <li>Combines two words ("more juice", "daddy go")</li>
    <li>Vocabulary of 50+ words by 24 months</li>
    <li>Names pictures in books</li>
    <li>Asks simple questions ("What that?")</li>
  </ul>
  <h3>What They Understand:</h3>
  <ul>
    <li>Follows two-step directions</li>
    <li>Points to objects and pictures when named</li>
    <li>Recognizes names of familiar people and objects</li>
    <li>Begins to understand spatial concepts (in, on, under)</li>
  </ul>
  <h3>Red Flags:</h3>
  <p>Be concerned if your child isn't combining two words by 24 months or if you can't understand at least 50% of their speech.</p>

  <h2>2 to 3 Years: Sentences Form</h2>
  <h3>What You'll Hear:</h3>
  <ul>
    <li>Uses 3-4 word sentences</li>
    <li>Vocabulary of 200+ words</li>
    <li>Asks "what" and "where" questions</li>
    <li>Uses some plurals and past tense</li>
    <li>Familiar listeners understand about 75% of speech</li>
  </ul>
  <h3>What They Understand:</h3>
  <ul>
    <li>Follows two-step unrelated directions ("Get your coat and bring it here")</li>
    <li>Understands most sentences</li>
    <li>Understands location words</li>
    <li>Begins to understand time concepts</li>
  </ul>
  <h3>Red Flags:</h3>
  <p>Consult a professional if strangers can't understand your child's speech at all, or if your child isn't using sentences by age 3.</p>

  <h2>3 to 4 Years: Conversation Skills Develop</h2>
  <h3>What You'll Hear:</h3>
  <ul>
    <li>Uses 4-5 word sentences</li>
    <li>Tells simple stories</li>
    <li>Asks many questions including "why"</li>
    <li>Talks about activities at daycare or friend's house</li>
    <li>Strangers understand most of what they say</li>
  </ul>
  <h3>What They Understand:</h3>
  <ul>
    <li>Follows 2-3 step directions</li>
    <li>Understands simple "who", "what", "where" questions</li>
    <li>Understands most things said at home and school</li>
  </ul>
  <h3>Red Flags:</h3>
  <p>Seek help if your child isn't speaking in sentences, has difficulty being understood by family members, or doesn't engage in back-and-forth conversation.</p>

  <h2>4 to 5 Years: Ready for School</h2>
  <h3>What You'll Hear:</h3>
  <ul>
    <li>Uses sentences with many details</li>
    <li>Tells stories that stick to a topic</li>
    <li>Communicates easily with adults and children</li>
    <li>Uses most grammar correctly</li>
    <li>Says most sounds correctly (may still have trouble with r, l, s, th)</li>
  </ul>
  <h3>What They Understand:</h3>
  <ul>
    <li>Understands directions with multiple steps</li>
    <li>Understands most of what is said at home and school</li>
    <li>Follows classroom directions</li>
  </ul>
  <h3>Red Flags:</h3>
  <p>Be concerned if your child's speech is still difficult for strangers to understand, if they avoid talking, or struggle to answer simple questions about their day.</p>

  <h2>When to Seek Help</h2>
  <p>Trust your instincts! If you're concerned about your child's speech development, it's always better to get an evaluation. Early intervention makes a significant difference.</p>
  <p><strong>Contact a speech-language pathologist if:</strong></p>
  <ul>
    <li>Your child isn't meeting multiple milestones for their age</li>
    <li>Your child seems frustrated when trying to communicate</li>
    <li>Your child has lost any skills they previously had</li>
    <li>Family members can't understand your child's speech</li>
    <li>Your child avoids talking or social interaction</li>
  </ul>

  <p>Take our free online assessments to get a better understanding of your child's current development and receive personalized recommendations!</p>
HTML

# Blog Post 4: Parent Resources
blog4 = BlogPost.create!(
  author_id: admin_user.id,
  title: "Screen Time and Speech Development: Finding the Right Balance",
  slug: "screen-time-and-speech-development",
  excerpt: "Research-based guidance on managing screen time to support, rather than hinder, your child's language development.",
  featured_image_url: "https://images.unsplash.com/photo-1604158430996-5ef5184b9c7c?w=800",
  category: "parent_resources",
  tags: ["screen time", "technology", "parent advice", "research"],
  status: "published",
  published_at: 5.days.ago,
  reading_time_minutes: 7,
  allow_comments: true,
  featured: false,
  view_count: 156,
  seo_metadata: {
    meta_title: "Screen Time & Speech Development: Science-Based Guide",
    meta_description: "How does screen time affect speech development? Expert advice on healthy media use for language learning.",
    keywords: ["screen time children", "speech development", "technology and language"]
  },
  comments: []
)

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
  <h3>The Serve and Return Principle</h3>
  <p>Language develops through <em>reciprocal interaction</em>—the back-and-forth exchange between child and caregiver that researchers call "serve and return." This is difficult to achieve with screen-based activities.</p>
  <h3>The Displacement Effect</h3>
  <p>Every minute spent on screens is a minute not spent:</p>
  <ul>
    <li>Engaging in face-to-face conversation</li>
    <li>Playing creatively</li>
    <li>Exploring the physical world</li>
    <li>Reading books together</li>
  </ul>
  <p>These are the activities that build robust language skills.</p>

  <h2>Not All Screen Time is Equal</h2>
  <h3>Passive vs. Interactive</h3>
  <p>Research distinguishes between:</p>
  <p><strong>Passive consumption:</strong> Watching videos or shows without interaction (less beneficial)</p>
  <p><strong>Interactive engagement:</strong> Video calls with grandparents, educational apps that respond to input, parent-child co-viewing with discussion (can be beneficial)</p>

  <h2>Making Screen Time More Language-Rich</h2>
  <p>If you do use screens, maximize the language learning potential:</p>

  <h3>1. Watch Together</h3>
  <p>Co-viewing transforms passive watching into an interactive experience:</p>
  <ul>
    <li>Talk about what you're watching</li>
    <li>Ask questions: "What do you think will happen next?"</li>
    <li>Point out new vocabulary</li>
    <li>Relate the content to your child's life</li>
  </ul>

  <h3>2. Choose Quality Content</h3>
  <p>Look for programs that:</p>
  <ul>
    <li>Have clear educational goals</li>
    <li>Model appropriate social interactions</li>
    <li>Use repetition to teach concepts</li>
    <li>Invite child participation</li>
    <li>Are age-appropriate and engaging</li>
  </ul>

  <h3>3. Follow Up with Real-World Connections</h3>
  <p>After screen time, extend the learning:</p>
  <ul>
    <li>"We saw a dog on the show. Let's look at our dog book!"</li>
    <li>"The character was sad. When do you feel sad?"</li>
    <li>Act out scenes or songs from the program</li>
  </ul>

  <h2>Screen-Free Alternatives</h2>
  <p>Build screen-free time into your daily routine:</p>
  <ul>
    <li><strong>Meal times:</strong> No screens, just conversation</li>
    <li><strong>Before bed:</strong> Reading instead of screens</li>
    <li><strong>Car rides:</strong> Sing songs, play "I spy," talk about the day</li>
    <li><strong>Outside time:</strong> Nature exploration is language-rich!</li>
  </ul>

  <h2>What About Educational Apps?</h2>
  <p>Educational apps can be beneficial when:</p>
  <ul>
    <li>They're truly interactive, not just digital flashcards</li>
    <li>They're used in moderation alongside other activities</li>
    <li>A parent is involved, discussing the content</li>
    <li>They're age-appropriate and align with developmental goals</li>
  </ul>
  <p>However, they should never replace human interaction and hands-on play.</p>

  <h2>Video Chat: The Exception</h2>
  <p>Video calls with family members can be beneficial for language development, even for young children, because they involve:</p>
  <ul>
    <li>Real-time interaction</li>
    <li>Familiar faces</li>
    <li>Meaningful communication</li>
    <li>Turn-taking in conversation</li>
  </ul>

  <h2>Creating a Family Media Plan</h2>
  <p>Establish clear guidelines that work for your family:</p>
  <ol>
    <li>Set specific screen-free times and zones</li>
    <li>Choose quality over quantity</li>
    <li>Lead by example with your own screen use</li>
    <li>Prioritize interactive activities</li>
    <li>Be consistent with limits</li>
  </ol>

  <h2>The Bottom Line</h2>
  <p>Screens aren't inherently evil, but they're also not a substitute for human interaction. The key is intentional use:</p>
  <ul>
    <li>Less is more, especially for young children</li>
    <li>Choose high-quality, interactive content</li>
    <li>Watch together and discuss</li>
    <li>Balance screen time with plenty of screen-free play and conversation</li>
    <li>Don't stress about occasional exceptions to the rules</li>
  </ul>

  <p>Remember: <strong>Nothing beats the language-building power of a responsive, engaged caregiver.</strong> Your conversations, play, and presence are the most valuable gifts you can give your child's developing brain.</p>
HTML

# Blog Post 5: Success Story
blog5 = BlogPost.create!(
  author_id: admin_user.id,
  title: "From Silent to Singing: Emma's Speech Development Journey",
  slug: "emmas-speech-development-journey",
  excerpt: "A mother shares how her daughter went from speaking only 5 words at age 3 to confidently communicating—and singing!—by kindergarten.",
  featured_image_url: "https://images.unsplash.com/photo-1587691592099-24045742c181?w=800",
  category: "success_stories",
  tags: ["parent story", "speech therapy success", "inspiration", "late talker"],
  status: "published",
  published_at: 1.month.ago,
  reading_time_minutes: 5,
  allow_comments: true,
  featured: false,
  view_count: 428,
  seo_metadata: {
    meta_title: "Success Story: Overcoming Late Talking | TalkieToys Blog",
    meta_description: "An inspiring story of a child's journey from late talker to confident communicator through speech therapy and family support.",
    keywords: ["late talker success", "speech therapy results", "parent testimonial"]
  },
  comments: [
    {
      id: 1,
      author_name: "Jennifer Lee",
      author_email: "jen@example.com",
      content: "This gives me so much hope! My son is 3 and hardly talking. Thank you for sharing.",
      created_at: 3.weeks.ago.iso8601,
      approved: true
    },
    {
      id: 2,
      author_name: "David Martinez",
      author_email: "david@example.com",
      content: "Beautiful story. It's amazing what consistency and the right support can do!",
      created_at: 2.weeks.ago.iso8601,
      approved: true
    }
  ]
)

blog5.content.body = <<~HTML
  <p><em>This story is shared with permission from Emma's mother, Lisa.</em></p>

  <h2>The Worry Begins</h2>
  <p>"Something's not right."</p>
  <p>I remember thinking this at Emma's second birthday party. While other toddlers chatted away—some more clearly than others—my daughter communicated almost entirely through gestures and a few scattered words: "mama," "up," "no," "juice," and "dog."</p>
  <p>Family members reassured me. "Einstein didn't talk until he was four!" they'd say. "Boys talk later than girls, so she's fine!" But Emma was a girl, and she still wasn't talking.</p>

  <h2>Getting Help</h2>
  <p>When Emma turned three with a vocabulary of just five words, I finally pushed past my worry about overreacting and called for a speech evaluation.</p>
  <p>The evaluation confirmed what I suspected: Emma had a significant expressive language delay. While she understood language appropriately for her age (receptive language), she struggled to form words and express herself (expressive language).</p>
  <p>I felt guilty. Had I not talked to her enough? Was screen time to blame? Our speech therapist, Maria, was quick to reassure me: "This isn't your fault. Some children just need extra support to unlock their language. And the fact that you sought help now means we can make a huge difference."</p>

  <h2>The Journey Begins</h2>
  <p>Emma started speech therapy twice a week. But Maria emphasized that those two hours were just the beginning—what happened at home mattered even more.</p>
  <p>She taught us:</p>
  <ul>
    <li><strong>Narrate everything:</strong> I described every action, object, and feeling throughout the day</li>
    <li><strong>Wait and encourage:</strong> Instead of giving Emma what she pointed at immediately, I'd wait, give her time, and model the word</li>
    <li><strong>Expand and extend:</strong> When Emma said "dog," I'd respond with "Yes! Big brown dog!"</li>
    <li><strong>Follow her lead:</strong> We focused on words related to her interests (animals, for Emma)</li>
  </ul>

  <h2>Small Victories</h2>
  <p>Progress was slow at first. It took two months before Emma added a single new word to her vocabulary. I felt discouraged.</p>
  <p>Then, something shifted. At three and a half, Emma's language suddenly began to emerge. It was like watching flowers bloom in time-lapse—first one word, then five, then ten. Within three months, she had over 50 words.</p>
  <p>Her first two-word combination—"more cookie"—made me cry happy tears in the middle of the kitchen.</p>

  <h2>The Role of Play</h2>
  <p>One tool that made a huge difference was incorporating therapy into play. We invested in some speech therapy toys recommended by Maria:</p>
  <ul>
    <li>A play kitchen that encouraged food vocabulary and pretend play</li>
    <li>Animal figurines that we used for sorting, naming, and making sounds</li>
    <li>Simple puzzles where Emma had to request each piece</li>
    <li>Musical instruments that made practicing sounds fun</li>
  </ul>
  <p>These weren't expensive or fancy—they just created natural opportunities for language.</p>

  <h2>Challenges Along the Way</h2>
  <p>It wasn't all smooth sailing. Emma went through phases of frustration, where she knew what she wanted to say but couldn't get the words out. Tantrums were common.</p>
  <p>I learned to:</p>
  <ul>
    <li>Stay calm and empathetic</li>
    <li>Help her use words for emotions: "You're frustrated. I hear you."</li>
    <li>Offer choices to reduce overwhelm</li>
    <li>Celebrate every single attempt, even unsuccessful ones</li>
  </ul>

  <h2>The Breakthrough</h2>
  <p>By age four, Emma was speaking in short sentences. By four and a half, strangers could understand her most of the time. We reduced therapy to once a week, then every other week.</p>
  <p>The moment I knew we'd turned a corner was during a car ride when Emma, completely unprompted, started singing "Let It Go" from Frozen—every single word, at the top of her lungs.</p>
  <p>I pulled over, tears streaming down my face. This child who could barely speak 18 months earlier was <em>singing</em>.</p>

  <h2>Starting Kindergarten</h2>
  <p>Emma just started kindergarten. She still receives some speech support at school for articulation, but her language skills are now within the normal range. She talks constantly, asks endless "why" questions, and tells elaborate imaginative stories.</p>
  <p>Sometimes I have to remind myself of those silent days, when I wondered if she'd ever speak.</p>

  <h2>What I Wish I'd Known</h2>
  <p>If I could go back and tell my worried, three-years-ago self anything, it would be:</p>
  <ol>
    <li><strong>Trust your instincts.</strong> If you're concerned, seek an evaluation. Early intervention is key.</li>
    <li><strong>It's not your fault.</strong> Some kids just need extra support.</li>
    <li><strong>Progress isn't linear.</strong> There will be plateaus and then sudden leaps.</li>
    <li><strong>Consistency matters more than intensity.</strong> Five minutes of focused language practice every day beats an hour once a week.</li>
    <li><strong>Celebrate tiny wins.</strong> Every new word is a victory.</li>
    <li><strong>Your child is not defined by this delay.</strong> Emma is smart, creative, empathetic, and amazing—and she always was, even when she wasn't talking.</li>
  </ol>

  <h2>Hope for Other Parents</h2>
  <p>If you're reading this with a late talker of your own, please know: there is hope. With the right support, tremendous progress is possible.</p>
  <p>Every child's journey is different. Emma's path may not be your child's path. But if our story can provide even a little bit of hope or encouragement, then sharing it was worth it.</p>
  <p>And to Emma: I can't wait to hear all the stories you have to tell.</p>
HTML

# Blog Post 6: Therapy Tips - Picky Eaters
blog6 = BlogPost.create!(
  author_id: admin_user.id,
  title: "The Connection Between Picky Eating and Speech Development",
  slug: "picky-eating-speech-development-connection",
  excerpt: "Did you know that oral motor skills affect both eating and speaking? Learn how addressing picky eating can support speech development.",
  featured_image_url: "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800",
  category: "therapy_tips",
  tags: ["picky eating", "oral motor skills", "feeding", "speech therapy"],
  status: "published",
  published_at: 1.week.ago,
  reading_time_minutes: 6,
  allow_comments: true,
  featured: false,
  view_count: 203,
  seo_metadata: {
    meta_title: "Picky Eating & Speech: The Surprising Connection",
    meta_description: "Discover how oral motor skills connect picky eating and speech development, plus strategies to help both.",
    keywords: ["picky eating speech", "oral motor development", "feeding therapy"]
  },
  comments: []
)

blog6.content.body = <<~HTML
  <h2>More Connected Than You Think</h2>
  <p>If your child is both a picky eater and has speech delays, you might be wondering if these challenges are related. The answer is: often, yes! The same oral motor muscles used for eating are also crucial for speech production.</p>

  <h2>Understanding Oral Motor Skills</h2>
  <p>Oral motor skills involve the movement and coordination of muscles in the mouth, including:</p>
  <ul>
    <li>Tongue</li>
    <li>Lips</li>
    <li>Jaw</li>
    <li>Soft palate</li>
    <li>Cheeks</li>
  </ul>
  <p>These muscles work together for both eating and speaking. When a child struggles with one area, it's not uncommon to see difficulties in the other.</p>

  <h2>How Picky Eating Can Affect Speech</h2>
  <h3>Limited Food Textures = Limited Oral Motor Practice</h3>
  <p>Children who eat only soft, pureed foods miss out on the oral motor practice that comes from chewing various textures. This can lead to:</p>
  <ul>
    <li>Reduced tongue strength and range of motion</li>
    <li>Less jaw stability</li>
    <li>Difficulty with tongue lateralization (side-to-side movement)</li>
  </ul>
  <p>All of these skills are essential for clear speech production.</p>

  <h3>Sensory Sensitivities</h3>
  <p>Children with sensory processing difficulties may be both picky eaters and have speech challenges. They might:</p>
  <ul>
    <li>Avoid certain textures in food and struggle with certain sounds</li>
    <li>Have difficulty with oral awareness</li>
    <li>Be overly sensitive to touch around the mouth</li>
  </ul>

  <h2>Strengthening Oral Motor Skills Through Eating</h2>
  <p>The good news? You can work on both feeding and speech skills simultaneously!</p>

  <h3>1. Introduce Varied Textures Gradually</h3>
  <p>Start where your child is comfortable and slowly expand:</p>
  <ul>
    <li>From purees to mashed foods</li>
    <li>From mashed to soft solids</li>
    <li>From soft to crunchy</li>
    <li>From crunchy to chewy</li>
  </ul>
  <p>Each new texture provides different oral motor practice.</p>

  <h3>2. Make Eating Playful</h3>
  <p>Take pressure off mealtime by exploring food through play:</p>
  <ul>
    <li>Touch and smell new foods without requiring eating</li>
    <li>Play with food textures (supervised finger painting with pudding, for example)</li>
    <li>Practice "food kisses"—touching food to lips without eating</li>
    <li>Model eating new foods yourself with exaggerated enjoyment</li>
  </ul>

  <h3>3. Foods That Build Speech Muscles</h3>
  <p>Certain foods provide excellent oral motor practice:</p>
  <ul>
    <li><strong>Crunchy foods</strong> (carrots, apples, crackers): Build jaw strength</li>
    <li><strong>Chewy foods</strong> (dried fruit, bagels, meat): Increase jaw stability and endurance</li>
    <li><strong>Foods requiring tongue movement</strong> (licking lollipops, yogurt off lips): Strengthen tongue muscles</li>
    <li><strong>Resistive foods</strong> (thick smoothies through a straw): Build lip and cheek strength</li>
  </ul>
  <p><em>Always supervise eating and ensure foods are age-appropriate to prevent choking.</em></p>

  <h2>Non-Food Oral Motor Activities</h2>
  <p>If your child isn't ready for challenging food textures, try these fun activities:</p>
  <ul>
    <li><strong>Bubble blowing:</strong> Strengthens lip rounding</li>
    <li><strong>Kazoos and whistles:</strong> Build lip strength</li>
    <li><strong>Straws:</strong> Drinking thick smoothies or blowing cotton balls</li>
    <li><strong>Silly faces:</strong> Stick out tongue, make raspberries, puff cheeks</li>
    <li><strong>Oral vibrating toys:</strong> (Under supervision) Can help with oral awareness</li>
  </ul>

  <h2>When to Seek Professional Help</h2>
  <p>Consider consulting with an occupational therapist or feeding specialist if your child:</p>
  <ul>
    <li>Eats fewer than 20 different foods</li>
    <li>Gags frequently during meals</li>
    <li>Has extreme reactions to food textures</li>
    <li>Is losing weight or not growing appropriately</li>
    <li>Has difficulty chewing or swallowing</li>
    <li>Avoids entire food groups</li>
  </ul>
  <p>A speech-language pathologist who specializes in feeding disorders can address both feeding and speech concerns together.</p>

  <h2>The Integrated Approach</h2>
  <p>The most effective therapy often addresses both feeding and speech simultaneously:</p>
  <ul>
    <li>Oral motor exercises that carry over to both eating and speaking</li>
    <li>Sensory integration techniques</li>
    <li>Building confidence in both areas</li>
    <li>Addressing underlying sensory processing issues</li>
  </ul>

  <h2>Practical Tips for Parents</h2>
  <ol>
    <li><strong>Stay positive:</strong> Avoid battles or pressure around eating</li>
    <li><strong>Model adventurous eating:</strong> Try new foods yourself</li>
    <li><strong>Make it social:</strong> Eat meals together as a family</li>
    <li><strong>Offer choices:</strong> "Would you like carrots or green beans?"</li>
    <li><strong>Celebrate attempts:</strong> Praise trying, not just eating</li>
    <li><strong>Be patient:</strong> It can take 10-15 exposures before a child accepts a new food</li>
    <li><strong>Keep offering:</strong> Serve refused foods alongside accepted foods</li>
    <li><strong>Don't give up:</strong> Tastes change over time</li>
  </ol>

  <h2>The Bottom Line</h2>
  <p>Picky eating and speech delays often share common roots in oral motor development and sensory processing. By addressing feeding challenges thoughtfully—without pressure or battles—you can support both nutritional health and speech development.</p>
  <p>Remember: every child develops at their own pace. With patience, consistency, and professional support when needed, most children expand both their diets and their communication skills.</p>
  <p>Explore our collection of oral motor tools and feeding therapy toys designed to make building these crucial skills fun and engaging!</p>
HTML

puts "Created #{BlogPost.count} blog posts with rich text content"
