export interface UserProfile {
  id: string;
  user_id: string;
  // Personal
  full_name: string;
  email: string;
  country: string;
  nationality: string;
  current_location: string;
  avatar_url?: string;
  // Academic
  education_level: EducationLevel;
  institution?: string;
  course_of_study?: string;
  gpa?: string;
  graduation_year?: number;
  academic_interests: string[];
  // Opportunity preferences
  opportunity_types: OpportunityType[];
  funding_preference: FundingPreference;
  program_level: ProgramLevel[];
  preferred_countries: string[];
  start_timeline: StartTimeline;
  study_format: StudyFormat;
  language_preferences: string[];
  // Exam scores
  ielts_score?: string;
  toefl_score?: string;
  gre_score?: string;
  gmat_score?: string;
  sat_score?: string;
  // AI instructions
  ai_instructions?: string;
  // Notification prefs
  email_notifications: boolean;
  deadline_reminders: DeadlineReminder[];
  // Meta
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Opportunity {
  id: string;
  name: string;
  description: string;
  funding_type: FundingType;
  country: string;
  program_type: OpportunityType;
  eligibility_requirements: string[];
  application_url: string;
  deadline?: string;
  benefits: string[];
  tags: string[];
  amount?: string;
  host_institution?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OpportunityMatch {
  id: string;
  user_id: string;
  opportunity_id: string;
  match_score: number;
  match_reasons: string[];
  missing_requirements: string[];
  application_readiness_score: number;
  improvement_suggestions: string[];
  ai_advice?: string;
  is_saved: boolean;
  is_hidden: boolean;
  is_applied: boolean;
  created_at: string;
  opportunity?: Opportunity;
}

export interface ActionPlan {
  id: string;
  user_id: string;
  opportunity_id: string;
  plan: ActionPlanWeek[];
  progress: number;
  created_at: string;
  updated_at: string;
  opportunity?: Opportunity;
}

export interface ActionPlanWeek {
  week: number;
  title: string;
  tasks: ActionPlanTask[];
}

export interface ActionPlanTask {
  id: string;
  description: string;
  completed: boolean;
}

// Enums
export type EducationLevel =
  | "high_school"
  | "undergraduate"
  | "masters"
  | "phd"
  | "postdoctoral"
  | "professional";

export type OpportunityType =
  | "scholarship"
  | "fellowship"
  | "grant"
  | "internship"
  | "competition"
  | "research"
  | "conference"
  | "exchange"
  | "bootcamp"
  | "startup_funding";

export type FundingPreference = "fully_funded" | "partial" | "any";

export type ProgramLevel =
  | "undergraduate"
  | "masters"
  | "phd"
  | "postdoctoral"
  | "professional_certificate";

export type StartTimeline =
  | "immediately"
  | "within_3_months"
  | "within_6_months"
  | "within_1_year"
  | "flexible";

export type StudyFormat = "remote" | "in_person" | "hybrid";

export type DeadlineReminder = "30_days" | "14_days" | "7_days" | "3_days" | "24_hours";

export type FundingType = "fully_funded" | "partial" | "stipend" | "tuition_only";

export interface WeeklyDigestData {
  user: UserProfile;
  newMatches: OpportunityMatch[];
  topMatches: OpportunityMatch[];
  upcomingDeadlines: OpportunityMatch[];
  aiRecommendation: string;
}
