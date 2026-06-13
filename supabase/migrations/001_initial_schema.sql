-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- USER PROFILES
-- ============================================================
create table public.user_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  -- Personal
  full_name text not null default '',
  email text not null default '',
  country text not null default '',
  nationality text not null default '',
  current_location text not null default '',
  avatar_url text,
  -- Academic
  education_level text not null default 'undergraduate',
  institution text,
  course_of_study text,
  gpa text,
  graduation_year integer,
  academic_interests text[] not null default '{}',
  -- Opportunity preferences
  opportunity_types text[] not null default '{}',
  funding_preference text not null default 'any',
  program_level text[] not null default '{}',
  preferred_countries text[] not null default '{}',
  start_timeline text not null default 'flexible',
  study_format text not null default 'in_person',
  language_preferences text[] not null default '{"English"}',
  -- Exam scores
  ielts_score text,
  toefl_score text,
  gre_score text,
  gmat_score text,
  sat_score text,
  -- AI instructions
  ai_instructions text,
  -- Notification prefs
  email_notifications boolean not null default true,
  deadline_reminders text[] not null default '{"7_days","3_days","24_hours"}',
  -- Meta
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

create policy "Users can view own profile"
  on public.user_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = user_id);

-- ============================================================
-- OPPORTUNITIES
-- ============================================================
create table public.opportunities (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text not null default '',
  funding_type text not null default 'fully_funded',
  country text not null default '',
  program_type text not null default 'scholarship',
  eligibility_requirements text[] not null default '{}',
  application_url text not null default '',
  deadline date,
  benefits text[] not null default '{}',
  tags text[] not null default '{}',
  amount text,
  host_institution text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.opportunities enable row level security;

create policy "Opportunities are publicly readable"
  on public.opportunities for select
  using (true);

-- Only service role can insert/update opportunities
create policy "Service role can manage opportunities"
  on public.opportunities for all
  using (auth.role() = 'service_role');

-- ============================================================
-- OPPORTUNITY MATCHES
-- ============================================================
create table public.opportunity_matches (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  opportunity_id uuid references public.opportunities(id) on delete cascade not null,
  match_score integer not null default 0 check (match_score >= 0 and match_score <= 100),
  match_reasons text[] not null default '{}',
  missing_requirements text[] not null default '{}',
  application_readiness_score integer not null default 0,
  improvement_suggestions text[] not null default '{}',
  ai_advice text,
  is_saved boolean not null default false,
  is_hidden boolean not null default false,
  is_applied boolean not null default false,
  notified_email boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, opportunity_id)
);

alter table public.opportunity_matches enable row level security;

create policy "Users can view own matches"
  on public.opportunity_matches for select
  using (auth.uid() = user_id);

create policy "Users can update own matches"
  on public.opportunity_matches for update
  using (auth.uid() = user_id);

create policy "Service role can manage matches"
  on public.opportunity_matches for all
  using (auth.role() = 'service_role');

-- ============================================================
-- ACTION PLANS
-- ============================================================
create table public.action_plans (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  opportunity_id uuid references public.opportunities(id) on delete cascade not null,
  plan jsonb not null default '[]',
  progress integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, opportunity_id)
);

alter table public.action_plans enable row level security;

create policy "Users can manage own action plans"
  on public.action_plans for all
  using (auth.uid() = user_id);

create policy "Service role can manage action plans"
  on public.action_plans for all
  using (auth.role() = 'service_role');

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.handle_updated_at();

create trigger opportunities_updated_at
  before update on public.opportunities
  for each row execute function public.handle_updated_at();

create trigger opportunity_matches_updated_at
  before update on public.opportunity_matches
  for each row execute function public.handle_updated_at();

create trigger action_plans_updated_at
  before update on public.action_plans
  for each row execute function public.handle_updated_at();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (user_id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', null)
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- SEED SAMPLE OPPORTUNITIES
-- ============================================================
insert into public.opportunities (name, description, funding_type, country, program_type, eligibility_requirements, application_url, deadline, benefits, tags, amount, host_institution) values
(
  'Gates Cambridge Scholarship',
  'Gates Cambridge Scholarships are awarded to outstanding applicants from countries outside the UK to pursue a full-time postgraduate degree in any subject available at the University of Cambridge.',
  'fully_funded',
  'United Kingdom',
  'scholarship',
  ARRAY['Non-UK citizen', 'Applying to Cambridge postgraduate program', 'Demonstrated leadership potential', 'Commitment to improving lives of others'],
  'https://www.gatescambridge.org',
  '2025-10-08',
  ARRAY['Full cost of studying at Cambridge', 'Maintenance allowance', 'Flights to and from Cambridge', 'Visa costs', 'Family allowance if applicable'],
  ARRAY['masters', 'phd', 'uk', 'fully_funded', 'leadership', 'cambridge'],
  'Full funding + living stipend',
  'University of Cambridge'
),
(
  'Chevening Scholarship',
  'Chevening is the UK government''s international scholarships programme, funded by the Foreign, Commonwealth & Development Office and partner organisations.',
  'fully_funded',
  'United Kingdom',
  'scholarship',
  ARRAY['Citizen of Chevening-eligible country (includes all African nations)', 'At least 2 years work experience', 'Undergraduate degree', 'Apply to 3 UK universities'],
  'https://www.chevening.org',
  '2025-11-05',
  ARRAY['Tuition fees', 'Monthly stipend', 'Travel costs', 'Arrival allowance', 'Thesis grant'],
  ARRAY['masters', 'uk', 'fully_funded', 'work_experience', 'government'],
  'Full Masters funding',
  'UK Foreign Commonwealth & Development Office'
),
(
  'MasterCard Foundation Scholars Program',
  'The MasterCard Foundation Scholars Program provides comprehensive scholarships to young Africans with the potential to transform their home communities.',
  'fully_funded',
  'Various',
  'scholarship',
  ARRAY['African nationality', 'Academically talented and financially disadvantaged', 'Demonstrated commitment to giving back to Africa', 'Leadership potential'],
  'https://mastercardfdn.org/all/scholars',
  '2025-03-31',
  ARRAY['Full tuition', 'Living expenses', 'Books and supplies', 'Travel', 'Leadership development programs'],
  ARRAY['undergraduate', 'masters', 'africa', 'fully_funded', 'leadership', 'mastercard'],
  'Full scholarship',
  'MasterCard Foundation'
),
(
  'Commonwealth Scholarship',
  'Commonwealth Scholarships are offered to citizens of Commonwealth countries for postgraduate study in the United Kingdom.',
  'fully_funded',
  'United Kingdom',
  'scholarship',
  ARRAY['Commonwealth citizen', 'Available for study from home country', 'First class or upper second degree', 'Unable to study in UK without this scholarship'],
  'https://cscuk.fcdo.gov.uk',
  '2025-12-01',
  ARRAY['Airfare', 'Tuition fees', 'Maintenance stipend', 'Thesis grant', 'Warm clothing allowance'],
  ARRAY['masters', 'phd', 'uk', 'fully_funded', 'commonwealth', 'africa'],
  'Full scholarship',
  'Commonwealth Scholarship Commission'
),
(
  'DAAD Scholarship Germany',
  'The DAAD offers scholarships for students from developing countries to study in Germany. Africa is a major focus region.',
  'fully_funded',
  'Germany',
  'scholarship',
  ARRAY['Degree from home country university', 'At least 2 years professional experience', 'German or English language skills', 'Field relevant to development'],
  'https://www.daad.de/en',
  '2025-10-31',
  ARRAY['Monthly stipend', 'Travel subsidy', 'Health insurance', 'Study and research subsidy'],
  ARRAY['masters', 'phd', 'germany', 'fully_funded', 'development', 'research'],
  '€934/month + benefits',
  'DAAD - German Academic Exchange Service'
),
(
  'Fulbright Foreign Student Program',
  'The Fulbright Program offers competitive, merit-based grants for international students, young professionals, and artists from abroad to study and conduct research in the United States.',
  'fully_funded',
  'USA',
  'fellowship',
  ARRAY['Non-US citizen', 'Undergraduate degree', 'English proficiency', 'Return to home country after program'],
  'https://foreign.fulbrightonline.org',
  '2025-10-01',
  ARRAY['Tuition and fees', 'Living stipend', 'Health insurance', 'Round-trip travel', 'Book allowance'],
  ARRAY['masters', 'phd', 'usa', 'fully_funded', 'research', 'cultural_exchange', 'fulbright'],
  'Full scholarship',
  'US Department of State'
),
(
  'Orange Knowledge Programme',
  'The Orange Knowledge Programme (OKP) offers short courses and master scholarships for professionals from 51 countries, focusing on sustainable development.',
  'fully_funded',
  'Netherlands',
  'scholarship',
  ARRAY['Citizen of OKP eligible country', 'Professional experience minimum 2 years', 'Employed by organization in home country', 'Nominated by employer'],
  'https://www.nuffic.nl/en/subjects/orange-knowledge-programme',
  '2025-09-30',
  ARRAY['Tuition fees', 'Monthly allowance', 'Accommodation', 'Travel costs', 'Health insurance'],
  ARRAY['masters', 'netherlands', 'fully_funded', 'professional', 'development'],
  'Full scholarship',
  'Nuffic / Dutch Government'
),
(
  'Australia Awards Scholarships',
  'Australia Awards are prestigious international scholarships and fellowships funded by the Australian Government. They provide opportunities for Africans to undertake full-time undergraduate or postgraduate study.',
  'fully_funded',
  'Australia',
  'scholarship',
  ARRAY['Citizen of eligible African country', 'Minimum 2 years work experience (for Masters)', 'Not be in Australia at time of application', 'Committed to returning home after study'],
  'https://www.australiaawards.gov.au',
  '2025-04-30',
  ARRAY['Tuition fees', 'Establishment allowance', 'Contribution to living expenses', 'Overseas student health cover', 'Return airfare'],
  ARRAY['undergraduate', 'masters', 'australia', 'fully_funded', 'government', 'africa'],
  'Full scholarship',
  'Australian Government DFAT'
),
(
  'Google Africa Developer Scholarship',
  'Google Africa Developer Scholarship provides access to training in high-demand technical skills like mobile web development, machine learning, and cloud computing.',
  'partial',
  'Various (Online)',
  'scholarship',
  ARRAY['African nationality or resident', '18 years or older', 'Intermediate English proficiency', 'Access to computer and internet'],
  'https://gads.andela.com',
  '2025-06-30',
  ARRAY['Free online courses', 'Mentorship', 'Community access', 'Certificate upon completion', 'Career support'],
  ARRAY['undergraduate', 'professional_certificate', 'remote', 'online', 'technology', 'google', 'africa'],
  'Free training (online)',
  'Google & Andela'
),
(
  'Tony Elumelu Foundation Entrepreneurship Programme',
  'The Tony Elumelu Foundation Entrepreneurship Programme is the continent''s leading philanthropy empowering a new generation of African entrepreneurs.',
  'grant',
  'Africa (pan-African)',
  'startup_funding',
  ARRAY['African entrepreneur', 'Business idea or early-stage business', 'Willing to participate in 12-week training', 'Committed to Africa''s growth'],
  'https://www.tonyelumelufoundation.org',
  '2025-06-30',
  ARRAY['$5,000 seed capital', '12 weeks of training', 'Mentorship for 6 months', 'Networking opportunities', 'Access to TEF community'],
  ARRAY['entrepreneurship', 'startup', 'africa', 'grant', 'seed_funding', 'business'],
  '$5,000 seed capital',
  'Tony Elumelu Foundation'
);
