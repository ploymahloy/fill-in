-- Dev seed for fill-in schema
-- Safe to re-run: clears dependent data first

BEGIN;

TRUNCATE applications, gig_listings, gigs, tours, musician_instruments,
         musician_profiles, band_profiles, users
RESTART IDENTITY CASCADE;

-- ---------------------------------------------------------------------------
-- Instruments
-- ---------------------------------------------------------------------------
INSERT INTO instruments (id, name) VALUES
  (1, 'Guitar'),
  (2, 'Bass'),
  (3, 'Drums'),
  (4, 'Keys'),
  (5, 'Vocals'),
  (6, 'Saxophone'),
  (7, 'Violin')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

SELECT setval(
  pg_get_serial_sequence('instruments', 'id'),
  (SELECT COALESCE(MAX(id), 1) FROM instruments)
);

-- ---------------------------------------------------------------------------
-- Users
-- password_hash is bcrypt for "password" — replace for real auth testing
-- ---------------------------------------------------------------------------
INSERT INTO users (id, email, password_hash, user_type) VALUES
  ('11111111-1111-1111-1111-111111111101', 'maya@example.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'musician'),
  ('11111111-1111-1111-1111-111111111102', 'jake@example.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'musician'),
  ('11111111-1111-1111-1111-111111111103', 'priya@example.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'musician'),
  ('22222222-2222-2222-2222-222222222201', 'northstar@example.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'band'),
  ('22222222-2222-2222-2222-222222222202', 'velvet@example.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'band'),
  ('33333333-3333-3333-3333-333333333301', 'admin@example.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin');

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------
INSERT INTO musician_profiles (
  id, user_id, stage_name, bio, base_city, base_country,
  has_passport, website_url, video_reel_url, hourly_rate_usd, is_available
) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01',
   '11111111-1111-1111-1111-111111111101',
   'Maya Rivera', 'Session guitarist and backing vocalist.',
   'Nashville', 'USA', true, 'https://mayarivera.example',
   'https://video.example/maya', 75.00, true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02',
   '11111111-1111-1111-1111-111111111102',
   'Jake Cole', 'Touring drummer with indie and alt-rock credits.',
   'Austin', 'USA', false, NULL, NULL, 60.00, true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa03',
   '11111111-1111-1111-1111-111111111103',
   'Priya Shah', 'Keys / MD available for fly dates and residencies.',
   'Toronto', 'Canada', true, 'https://priyashah.example',
   NULL, 90.00, false);

INSERT INTO band_profiles (
  id, user_id, band_name, genre, bio, website_url, logo_url
) VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01',
   '22222222-2222-2222-2222-222222222201',
   'Northstar Weekend', 'Indie Rock',
   'Four-piece looking for reliable fill-ins on the spring run.',
   'https://northstar.example', NULL),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02',
   '22222222-2222-2222-2222-222222222202',
   'Velvet Harbor', 'R&B / Soul',
   'Horn-friendly live band booking summer festivals.',
   'https://velvetharbor.example', NULL);

-- ---------------------------------------------------------------------------
-- Musician instruments
-- ---------------------------------------------------------------------------
INSERT INTO musician_instruments (musician_id, instrument_id, proficiency_level, is_primary) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01', 1, 'professional', true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01', 5, 'advanced', false),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02', 3, 'professional', true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa03', 4, 'professional', true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa03', 2, 'intermediate', false);

-- ---------------------------------------------------------------------------
-- Tours
-- ---------------------------------------------------------------------------
INSERT INTO tours (id, band_id, title, description, start_date, end_date, is_active) VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccc01',
   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01',
   'Spring Midwest Run',
   'Club dates across the Midwest. Need guitar cover for two shows.',
   '2026-08-01', '2026-08-15', true),
  ('cccccccc-cccc-cccc-cccc-cccccccccc02',
   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02',
   'Harbor Summer Fest',
   'Festival week with heavy R&B set.',
   '2026-09-10', '2026-09-20', true);

-- ---------------------------------------------------------------------------
-- Gigs (band_id must match tour when tour_id is set)
-- ---------------------------------------------------------------------------
INSERT INTO gigs (id, tour_id, band_id, venue_name, city, country, gig_date) VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddd01',
   'cccccccc-cccc-cccc-cccc-cccccccccc01',
   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01',
   'The Basement', 'Nashville', 'USA', '2026-08-03'),
  ('dddddddd-dddd-dddd-dddd-dddddddddd02',
   'cccccccc-cccc-cccc-cccc-cccccccccc01',
   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01',
   'Empty Bottle', 'Chicago', 'USA', '2026-08-07'),
  ('dddddddd-dddd-dddd-dddd-dddddddddd03',
   'cccccccc-cccc-cccc-cccc-cccccccccc02',
   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02',
   'Harbourfront Stage', 'Toronto', 'Canada', '2026-09-12'),
  -- one-off gig with no tour
  ('dddddddd-dddd-dddd-dddd-dddddddddd04',
   NULL,
   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01',
   'Private corporate', 'Louisville', 'USA', '2026-07-28');

-- ---------------------------------------------------------------------------
-- Listings: exactly one of tour_id or gig_id
-- ---------------------------------------------------------------------------
INSERT INTO gig_listings (
  id, tour_id, gig_id, instrument_needed, pay_rate_usd, pay_type, description, status
) VALUES
  -- tour-level listing (covers whole tour)
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01',
   'cccccccc-cccc-cccc-cccc-cccccccccc01', NULL,
   1, 350.00, 'per_show',
   'Lead/rhythm guitar for Midwest run. Must know our catalog.',
   'open'),
  -- single-gig listing
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02',
   NULL, 'dddddddd-dddd-dddd-dddd-dddddddddd03',
   6, 500.00, 'flat_fee',
   'Sax fill-in for Harbourfront festival set.',
   'open'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee03',
   NULL, 'dddddddd-dddd-dddd-dddd-dddddddddd04',
   3, 400.00, 'flat_fee',
   'Drums for private corporate date in Louisville.',
   'open'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee04',
   'cccccccc-cccc-cccc-cccc-cccccccccc02', NULL,
   4, 1200.00, 'weekly_rate',
   'Keys / MD for Harbor Summer Fest week.',
   'filled');

-- ---------------------------------------------------------------------------
-- Applications
-- ---------------------------------------------------------------------------
INSERT INTO applications (id, listing_id, musician_id, pitch_message, status) VALUES
  ('ffffffff-ffff-ffff-ffff-ffffffffff01',
   'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01',
   'I know most of your set from last year’s shows and can fly in Aug 1.',
   'pending'),
  ('ffffffff-ffff-ffff-ffff-ffffffffff02',
   'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee03',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02',
   'Based in Austin, can drive to Louisville the day before.',
   'shortlisted'),
  ('ffffffff-ffff-ffff-ffff-ffffffffff03',
   'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee04',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa03',
   'Happy to MD the full festival week; passport ready.',
   'accepted');

COMMIT;