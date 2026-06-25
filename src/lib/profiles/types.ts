export type AccountType = "client" | "talent_applicant" | "talent" | "admin";

export type ProfileVisibility = "hidden" | "public" | "limited" | "contribution";

export type ApplicationStatus =
  | "submitted"
  | "under_review"
  | "more_info_needed"
  | "approved"
  | "rejected";

export type RequestType =
  | "consult"
  | "proprietary"
  | "task"
  | "competition"
  | "matching";

export type RequestStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "published"
  | "active"
  | "completed"
  | "closed"
  | "cancelled";

export interface Profile {
  id: string;
  full_name: string | null;
  display_name: string | null;
  account_type: AccountType;
  headline: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  timezone: string | null;
  website_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  notification_preferences: Record<string, boolean>;
  stripe_customer_id: string | null;
  stripe_connect_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientProfile {
  id: string;
  user_id: string;
  company_name: string | null;
  company_website: string | null;
  industry: string | null;
  company_size: string | null;
  location: string | null;
  description: string | null;
  primary_contact_name: string | null;
  primary_contact_email: string | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface TalentProfile {
  id: string;
  user_id: string;
  professional_headline: string | null;
  years_experience: number | null;
  current_role: string | null;
  visibility: ProfileVisibility;
  availability: Record<string, boolean>;
  hourly_rate_cents: number | null;
  reputation_overall: number;
  reputation_consulting: number;
  reputation_tasks: number;
  reputation_competitions: number;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  slug: string;
}

export interface SkillClaim {
  id: string;
  talent_profile_id: string;
  skill_id: string;
  level: number;
  status: "pending" | "verified" | "rejected" | "partial";
  explanation: string | null;
  created_at: string;
}

export interface TalentApplication {
  id: string;
  user_id: string;
  status: ApplicationStatus;
  engagement_types: string[];
  visibility_preference: ProfileVisibility;
  submitted_at: string | null;
  reviewed_at: string | null;
  reviewer_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientRequest {
  id: string;
  client_profile_id: string;
  request_type: RequestType;
  title: string;
  summary: string | null;
  description: string | null;
  domain: string | null;
  visibility: string;
  status: RequestStatus;
  timing_type: string | null;
  payment_model: string | null;
  budget_cents: number | null;
  created_at: string;
  updated_at: string;
}

export interface Competition {
  id: string;
  client_request_id: string | null;
  client_profile_id: string;
  title: string;
  description: string | null;
  domain: string | null;
  reward_model: string;
  prize_pool_cents: number | null;
  status: string;
  starts_at: string | null;
  ends_at: string | null;
  rules: string | null;
  evaluation_method: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
}

export interface MessageThread {
  id: string;
  subject: string | null;
  thread_type: string;
  reference_id: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  body: string;
  created_at: string;
}
