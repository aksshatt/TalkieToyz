export interface Question {
  key: string;
  text: string;
  type: 'yes_no' | 'multiple_choice' | 'scale' | 'text';
  options?: string[];
  min_value?: number;
  max_value?: number;
  category?: string;
}

export interface ScoringRule {
  question_key: string;
  scoring_type: 'points' | 'boolean' | 'scale';
  points: Record<string, number> | number;
  category?: string;
  max_value?: number;
}

export interface Recommendation {
  min_score: number;
  max_score: number;
  level: string;
  message: string;
  suggested_products?: number[];
  tips?: string[];
}

export interface Assessment {
  id: number;
  title: string;
  description: string;
  slug: string;
  min_age: number;
  max_age: number;
  questions: Question[];
  scoring_rules: ScoringRule[];
  recommendations: Recommendation[];
  active: boolean;
  version: number;
  question_count: number;
  created_at: string;
  updated_at: string;
}

export interface AssessmentSummary {
  id: number;
  title: string;
  description: string;
  slug: string;
  min_age: number;
  max_age: number;
  question_count: number;
  active: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface AssessmentResult {
  id: number;
  child_name: string;
  child_age_months: number;
  answers: Record<string, any>;
  scores: Record<string, number>;
  total_score: number;
  percentage_score: number;
  recommendations: Recommendation;
  completed_at: string;
  assessment: AssessmentSummary;
  created_at: string;
  updated_at: string;
}

export interface AssessmentSubmission {
  child_name: string;
  child_age_months: number;
  answers: Record<string, any>;
}

export interface AssessmentFilters {
  age?: number;
  q?: string;
  page?: number;
  per_page?: number;
}

export interface AssessmentsResponse {
  success: boolean;
  data: AssessmentSummary[];
  message: string;
  meta: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

export interface AssessmentResponse {
  success: boolean;
  data: Assessment;
  message: string;
}

export interface AssessmentResultResponse {
  success: boolean;
  data: AssessmentResult;
  message: string;
}
