-- Demo seed script (run after migration, optional)
-- Replace USER_ID with a real auth.users id for talent demo profile

-- Example: promote existing user to admin
-- UPDATE profiles SET account_type = 'admin' WHERE id = 'YOUR-UUID';

-- Example: create demo verified talent (requires existing auth user)
/*
INSERT INTO talent_profiles (user_id, professional_headline, years_experience, visibility, verified_at, availability)
VALUES (
  'YOUR-USER-UUID',
  'Senior LLM Training Engineer',
  7,
  'public',
  now(),
  '{"consulting": true, "proprietary": false, "tasks": true, "competitions": true}'::jsonb
);
*/
