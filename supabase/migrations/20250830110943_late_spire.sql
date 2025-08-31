/*
  # OUTLASTED - Initial Database Schema

  This migration sets up the complete database schema for the OUTLASTED football survival platform.

  ## 1. New Tables

  ### Core User & Room Tables
  - `users` - User profiles with avatars and stats
  - `rooms` - Survival game rooms with configurable rules
  - `games` - Individual game instances within rooms
  - `room_members` - User membership and elimination tracking

  ### Game Management
  - `room_rounds` - Gameweek rounds with lock times and status
  - `picks` - User team selections with outcomes
  - `deals` - Split pot voting system
  - `pots` - Prize pool tracking and distribution

  ### Football Data
  - `teams` - Premier League teams
  - `fixtures` - Match data with results and DGW tracking
  - `gameweeks` - Season structure with lock calculation

  ### Notifications
  - `notifications` - User notifications for reminders and updates

  ## 2. Security
  - Enable RLS on all tables
  - Users can only access their own data and public room information
  - Room members can access room data they belong to
  - Hosts have additional permissions for room management

  ## 3. Key Features
  - Unique room names for easy joining
  - Team reuse prevention within games
  - Automatic lock time calculation
  - Deal consensus tracking
  - Comprehensive audit trail
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  avatar_url text,
  total_rooms integer DEFAULT 0,
  total_wins integer DEFAULT 0,
  total_earnings_cents bigint DEFAULT 0,
  best_streak integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  short_name text NOT NULL,
  logo_url text,
  league_id text DEFAULT 'premier-league',
  created_at timestamptz DEFAULT now()
);

-- Gameweeks table
CREATE TABLE IF NOT EXISTS gameweeks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gameweek_number integer NOT NULL,
  season text NOT NULL DEFAULT '2024-25',
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  first_kickoff_at timestamptz,
  last_kickoff_at timestamptz,
  is_double_gameweek boolean DEFAULT false,
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(gameweek_number, season)
);

-- Fixtures table
CREATE TABLE IF NOT EXISTS fixtures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id text UNIQUE,
  gameweek_id uuid REFERENCES gameweeks(id) ON DELETE CASCADE,
  gameweek_number integer NOT NULL,
  kickoff_at timestamptz NOT NULL,
  home_team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  away_team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'finished', 'postponed')),
  result text, -- 'home_win', 'away_win', 'draw'
  winner_team_id uuid REFERENCES teams(id),
  home_score integer,
  away_score integer,
  dgw_index integer DEFAULT 1, -- For double gameweeks
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  visibility text DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  host_user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  buy_in_cents bigint DEFAULT 0,
  currency text DEFAULT 'USD',
  max_players integer DEFAULT 50,
  rules json DEFAULT '{"dgw_rule": "first_fixture", "no_pick_policy": "disqualify", "deal_thresholds": {"<=20": 2, "30-39": [3,4], "40-49": [4,5]}}',
  status text DEFAULT 'open' CHECK (status IN ('open', 'full', 'started', 'completed')),
  invite_code text UNIQUE NOT NULL DEFAULT substring(md5(random()::text), 1, 8),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Games table (instances of rooms)
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  started_gameweek_id uuid REFERENCES gameweeks(id),
  started_gw_number integer NOT NULL,
  current_gameweek_id uuid REFERENCES gameweeks(id),
  current_gw_number integer,
  ended_gameweek_id uuid REFERENCES gameweeks(id),
  ended_gw_number integer,
  status text DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'completed', 'cancelled')),
  starters_count integer DEFAULT 0,
  survivors_count integer DEFAULT 0,
  winner_user_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Room members table
CREATE TABLE IF NOT EXISTS room_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  eliminated_at timestamptz,
  elimination_gameweek integer,
  is_host boolean DEFAULT false,
  status text DEFAULT 'active' CHECK (status IN ('active', 'eliminated', 'winner')),
  UNIQUE(room_id, user_id, game_id)
);

-- Room rounds table (gameweek instances for rooms)
CREATE TABLE IF NOT EXISTS room_rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  gameweek_id uuid REFERENCES gameweeks(id) ON DELETE CASCADE,
  gameweek_number integer NOT NULL,
  locks_at timestamptz NOT NULL,
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'locked', 'grading', 'completed')),
  starters_count integer DEFAULT 0,
  survivors_count integer DEFAULT 0,
  first_kickoff_at timestamptz,
  last_kickoff_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(game_id, gameweek_number)
);

-- Picks table
CREATE TABLE IF NOT EXISTS picks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  round_id uuid REFERENCES room_rounds(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  gameweek_number integer NOT NULL,
  source text DEFAULT 'user' CHECK (source IN ('user', 'random')),
  outcome text CHECK (outcome IN ('win', 'lose', 'draw', 'void')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(room_id, user_id, round_id)
);

-- Deals table
CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  round_id uuid REFERENCES room_rounds(id) ON DELETE CASCADE,
  created_by_user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  deal_type text DEFAULT 'split' CHECK (deal_type IN ('split', 'continue')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  required_consensus text DEFAULT 'unanimous' CHECK (required_consensus IN ('unanimous', 'majority')),
  responses json DEFAULT '{}', -- {user_id: 'accept'|'reject'}
  executed_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Pots table
CREATE TABLE IF NOT EXISTS pots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  amount_cents bigint NOT NULL DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'distributed', 'refunded')),
  distribution json, -- {user_id: amount_cents}
  distributed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('lock_reminder', 'lock_reveal', 'elimination', 'victory', 'deal_invite', 'restart_prompt', 'payment_reminder')),
  title text NOT NULL,
  message text NOT NULL,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE gameweeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixtures ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE picks ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE pots ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: can read/update own profile
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Teams: public read access
CREATE POLICY "Teams are publicly readable" ON teams
  FOR SELECT TO authenticated
  USING (true);

-- Gameweeks: public read access
CREATE POLICY "Gameweeks are publicly readable" ON gameweeks
  FOR SELECT TO authenticated
  USING (true);

-- Fixtures: public read access
CREATE POLICY "Fixtures are publicly readable" ON fixtures
  FOR SELECT TO authenticated
  USING (true);

-- Rooms: public rooms readable by all, private by members only
CREATE POLICY "Public rooms are readable" ON rooms
  FOR SELECT TO authenticated
  USING (visibility = 'public');

CREATE POLICY "Private room members can read room" ON rooms
  FOR SELECT TO authenticated
  USING (
    visibility = 'private' AND (
      host_user_id = auth.uid() OR
      EXISTS (SELECT 1 FROM room_members WHERE room_id = rooms.id AND user_id = auth.uid())
    )
  );

CREATE POLICY "Users can create rooms" ON rooms
  FOR INSERT TO authenticated
  WITH CHECK (host_user_id = auth.uid());

CREATE POLICY "Room hosts can update rooms" ON rooms
  FOR UPDATE TO authenticated
  USING (host_user_id = auth.uid());

-- Games: readable by room members
CREATE POLICY "Room members can read games" ON games
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM room_members WHERE room_id = games.room_id AND user_id = auth.uid())
  );

-- Room members: readable by room members
CREATE POLICY "Room members can read membership" ON room_members
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM room_members rm WHERE rm.room_id = room_members.room_id AND rm.user_id = auth.uid())
  );

CREATE POLICY "Users can join rooms" ON room_members
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Room rounds: readable by room members
CREATE POLICY "Room members can read rounds" ON room_rounds
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM room_members WHERE room_id = room_rounds.room_id AND user_id = auth.uid())
  );

-- Picks: readable by room members after lock, own picks always readable
CREATE POLICY "Users can read own picks" ON picks
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Room members can read picks after lock" ON picks
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM room_members rm 
      JOIN room_rounds rr ON rr.room_id = rm.room_id AND rr.id = picks.round_id
      WHERE rm.user_id = auth.uid() AND rr.status IN ('locked', 'grading', 'completed')
    )
  );

CREATE POLICY "Users can insert own picks" ON picks
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own picks before lock" ON picks
  FOR UPDATE TO authenticated
  USING (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM room_rounds 
      WHERE id = picks.round_id AND status = 'upcoming' AND locks_at > now()
    )
  );

-- Deals: readable by room members
CREATE POLICY "Room members can read deals" ON deals
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM room_members WHERE room_id = deals.room_id AND user_id = auth.uid())
  );

CREATE POLICY "Room members can create deals" ON deals
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM room_members WHERE room_id = deals.room_id AND user_id = auth.uid()) AND
    created_by_user_id = auth.uid()
  );

-- Pots: readable by room members
CREATE POLICY "Room members can read pots" ON pots
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM room_members WHERE room_id = pots.room_id AND user_id = auth.uid())
  );

-- Notifications: users can read own notifications
CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_room_members_user_id ON room_members(user_id);
CREATE INDEX IF NOT EXISTS idx_room_members_room_id ON room_members(room_id);
CREATE INDEX IF NOT EXISTS idx_picks_user_id ON picks(user_id);
CREATE INDEX IF NOT EXISTS idx_picks_room_id ON picks(room_id);
CREATE INDEX IF NOT EXISTS idx_picks_round_id ON picks(round_id);
CREATE INDEX IF NOT EXISTS idx_fixtures_gameweek ON fixtures(gameweek_number);
CREATE INDEX IF NOT EXISTS idx_room_rounds_status ON room_rounds(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Sample Premier League teams
INSERT INTO teams (name, short_name, logo_url) VALUES
  ('Arsenal', 'ARS', 'https://logos.sportmonks.com/soccer/teams/14/18.png'),
  ('Chelsea', 'CHE', 'https://logos.sportmonks.com/soccer/teams/11/9.png'),
  ('Liverpool', 'LIV', 'https://logos.sportmonks.com/soccer/teams/14/8.png'),
  ('Manchester City', 'MCI', 'https://logos.sportmonks.com/soccer/teams/11/17.png'),
  ('Manchester United', 'MUN', 'https://logos.sportmonks.com/soccer/teams/14/12.png'),
  ('Tottenham', 'TOT', 'https://logos.sportmonks.com/soccer/teams/14/6.png'),
  ('Newcastle United', 'NEW', 'https://logos.sportmonks.com/soccer/teams/14/23.png'),
  ('Brighton', 'BHA', 'https://logos.sportmonks.com/soccer/teams/25/131.png'),
  ('West Ham', 'WHU', 'https://logos.sportmonks.com/soccer/teams/14/21.png'),
  ('Aston Villa', 'AVL', 'https://logos.sportmonks.com/soccer/teams/14/7.png'),
  ('Crystal Palace', 'CRY', 'https://logos.sportmonks.com/soccer/teams/17/25.png'),
  ('Fulham', 'FUL', 'https://logos.sportmonks.com/soccer/teams/17/36.png'),
  ('Brentford', 'BRE', 'https://logos.sportmonks.com/soccer/teams/1/15.png'),
  ('Nottingham Forest', 'NFO', 'https://logos.sportmonks.com/soccer/teams/17/29.png'),
  ('Everton', 'EVE', 'https://logos.sportmonks.com/soccer/teams/14/11.png'),
  ('Leicester City', 'LEI', 'https://logos.sportmonks.com/soccer/teams/14/13.png'),
  ('Bournemouth', 'BOU', 'https://logos.sportmonks.com/soccer/teams/17/35.png'),
  ('Wolverhampton', 'WOL', 'https://logos.sportmonks.com/soccer/teams/17/39.png'),
  ('Sheffield United', 'SHU', 'https://logos.sportmonks.com/soccer/teams/17/33.png'),
  ('Burnley', 'BUR', 'https://logos.sportmonks.com/soccer/teams/17/34.png')
ON CONFLICT (name) DO NOTHING;

-- Sample gameweeks
INSERT INTO gameweeks (gameweek_number, season, start_date, end_date, first_kickoff_at, status) VALUES
  (1, '2024-25', '2024-08-16', '2024-08-19', '2024-08-16 19:00:00+00', 'completed'),
  (2, '2024-25', '2024-08-23', '2024-08-26', '2024-08-24 11:30:00+00', 'completed'),
  (3, '2024-25', '2024-08-30', '2024-09-02', '2024-08-31 11:30:00+00', 'upcoming')
ON CONFLICT (gameweek_number, season) DO NOTHING;