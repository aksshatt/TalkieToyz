module Api
  module V1
    class GoalQuizController < BaseController

      QUIZ_QUESTIONS = [
        {
          id: 1,
          question: "What is your child struggling with most?",
          options: [
            { value: 'articulation', label: 'Pronouncing sounds clearly' },
            { value: 'vocabulary', label: 'Building vocabulary / word finding' },
            { value: 'fluency', label: 'Stuttering or fluency issues' },
            { value: 'social', label: 'Social communication & conversation' }
          ]
        },
        {
          id: 2,
          question: "How old is your child?",
          options: [
            { value: '0-2', label: 'Under 2 years' },
            { value: '2-4', label: '2–4 years' },
            { value: '4-6', label: '4–6 years' },
            { value: '6+', label: '6+ years' }
          ]
        },
        {
          id: 3,
          question: "What type of activities does your child enjoy?",
          options: [
            { value: 'sensory', label: 'Sensory & hands-on play' },
            { value: 'games', label: 'Board games & puzzles' },
            { value: 'creative', label: 'Drawing & creative play' },
            { value: 'physical', label: 'Movement & physical activity' }
          ]
        }
      ].freeze

      GOAL_TO_SPEECH_GOAL_MAP = {
        'articulation' => ['Articulation', 'Phonology', 'Speech Sound'],
        'vocabulary' => ['Vocabulary', 'Language', 'Expressive Language'],
        'fluency' => ['Fluency', 'Stuttering'],
        'social' => ['Social Communication', 'Pragmatics', 'AAC']
      }.freeze

      AGE_TO_MONTHS = {
        '0-2' => 0..24,
        '2-4' => 24..48,
        '4-6' => 48..72,
        '6+' => 72..Float::INFINITY
      }.freeze

      # GET /api/v1/goal_quiz/questions
      def questions
        render_success(QUIZ_QUESTIONS, 'Quiz questions retrieved')
      end

      # POST /api/v1/goal_quiz/recommend
      def recommend
        goal = params[:goal]
        age_range = params[:age_range]
        activity_type = params[:activity_type]

        # Find matching speech goals
        goal_names = GOAL_TO_SPEECH_GOAL_MAP[goal] || []
        matching_goal_ids = SpeechGoal.where("name ILIKE ANY (ARRAY[?])", goal_names.map { |g| "%#{g}%" }).pluck(:id)

        products = Product.active.includes(:category, :speech_goals, images_attachments: :blob)

        # Filter by speech goals
        products = products.by_speech_goals(matching_goal_ids) if matching_goal_ids.any?

        # Filter by age
        if age_range.present? && AGE_TO_MONTHS[age_range]
          range = AGE_TO_MONTHS[age_range]
          min_months = range.first
          max_months = [range.last, 120].min
          # Convert months to years for the product age columns
          min_years = (min_months / 12.0).floor
          max_years = (max_months / 12.0).ceil
          products = products.where('min_age <= ? AND max_age >= ?', max_years, min_years)
        end

        products = products.in_stock.order(view_count: :desc).limit(8)

        # Fallback if nothing found
        products = Product.active.includes(:category, :speech_goals, images_attachments: :blob)
                         .in_stock.featured.order(view_count: :desc).limit(8) if products.empty?

        render_success(
          {
            goal: goal,
            age_range: age_range,
            products: ActiveModelSerializers::SerializableResource.new(
              products, each_serializer: ProductSummarySerializer
            ).as_json
          },
          'Recommendations ready'
        )
      end
    end
  end
end
