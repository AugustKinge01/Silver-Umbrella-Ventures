-- Create enum for coworking tiers
CREATE TYPE public.coworking_tier AS ENUM ('basic', 'standard', 'premium', 'vip');

-- Create enum for gaming station types
CREATE TYPE public.station_type AS ENUM ('ps4', 'ps5', 'vr_racing', 'vr_immersive', 'mobile_esports');

-- Create enum for tournament status
CREATE TYPE public.tournament_status AS ENUM ('upcoming', 'registration', 'in_progress', 'completed', 'cancelled');

-- Coworking tier definitions (pricing and meal inclusions)
CREATE TABLE public.coworking_tier_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tier coworking_tier NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    hourly_rate NUMERIC(10,2) NOT NULL,
    daily_rate NUMERIC(10,2) NOT NULL,
    monthly_rate NUMERIC(10,2),
    meals_included INTEGER NOT NULL DEFAULT 0, -- 0, 1, or 2 meals per day
    amenities JSONB DEFAULT '[]'::jsonb,
    xp_multiplier NUMERIC(3,2) NOT NULL DEFAULT 1.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Coworking spaces/desks
CREATE TABLE public.coworking_spaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    tier coworking_tier NOT NULL DEFAULT 'basic',
    capacity INTEGER NOT NULL DEFAULT 1,
    location TEXT,
    amenities JSONB DEFAULT '[]'::jsonb,
    is_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Coworking bookings
CREATE TABLE public.coworking_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    space_id UUID NOT NULL REFERENCES public.coworking_spaces(id) ON DELETE CASCADE,
    tier coworking_tier NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    meals_used INTEGER NOT NULL DEFAULT 0,
    total_amount NUMERIC(10,2) NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending',
    xp_earned INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Gaming stations
CREATE TABLE public.gaming_stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    station_type station_type NOT NULL,
    description TEXT,
    hourly_rate NUMERIC(10,2) NOT NULL,
    xp_per_hour INTEGER NOT NULL DEFAULT 10,
    is_available BOOLEAN NOT NULL DEFAULT true,
    specs JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Gaming sessions
CREATE TABLE public.gaming_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    station_id UUID NOT NULL REFERENCES public.gaming_stations(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    duration_hours NUMERIC(4,2),
    total_amount NUMERIC(10,2),
    payment_status TEXT NOT NULL DEFAULT 'pending',
    xp_earned INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tournaments
CREATE TABLE public.tournaments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    game TEXT NOT NULL,
    description TEXT,
    station_type station_type,
    entry_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
    prize_pool NUMERIC(10,2) NOT NULL DEFAULT 0,
    max_participants INTEGER NOT NULL DEFAULT 16,
    current_participants INTEGER NOT NULL DEFAULT 0,
    xp_reward_winner INTEGER NOT NULL DEFAULT 500,
    xp_reward_participation INTEGER NOT NULL DEFAULT 50,
    status tournament_status NOT NULL DEFAULT 'upcoming',
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    rules JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tournament participants
CREATE TABLE public.tournament_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    placement INTEGER,
    xp_earned INTEGER NOT NULL DEFAULT 0,
    payment_status TEXT NOT NULL DEFAULT 'pending',
    registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(tournament_id, user_id)
);

-- User XP and level tracking
CREATE TABLE public.user_xp (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    total_xp INTEGER NOT NULL DEFAULT 0,
    current_level INTEGER NOT NULL DEFAULT 1,
    xp_to_next_level INTEGER NOT NULL DEFAULT 100,
    lifetime_xp INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- XP transaction log
CREATE TABLE public.xp_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    action_type TEXT NOT NULL, -- 'purchase', 'booking', 'gaming', 'tournament', 'referral', 'daily_login', 'achievement'
    reference_id UUID, -- ID of the related booking/session/tournament
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Player DID (Decentralized Identity)
CREATE TABLE public.player_did (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    did_address TEXT, -- On-chain DID address
    wallet_address TEXT,
    reputation_score INTEGER NOT NULL DEFAULT 0,
    achievements JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.coworking_tier_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coworking_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coworking_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gaming_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gaming_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_did ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Tier configs: public read
CREATE POLICY "Anyone can view tier configs" ON public.coworking_tier_configs FOR SELECT USING (true);
CREATE POLICY "Admins can manage tier configs" ON public.coworking_tier_configs FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Spaces: public read
CREATE POLICY "Anyone can view spaces" ON public.coworking_spaces FOR SELECT USING (true);
CREATE POLICY "Admins can manage spaces" ON public.coworking_spaces FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Coworking bookings
CREATE POLICY "Users can view own bookings" ON public.coworking_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bookings" ON public.coworking_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all bookings" ON public.coworking_bookings FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage all bookings" ON public.coworking_bookings FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Gaming stations: public read
CREATE POLICY "Anyone can view stations" ON public.gaming_stations FOR SELECT USING (true);
CREATE POLICY "Admins can manage stations" ON public.gaming_stations FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Gaming sessions
CREATE POLICY "Users can view own sessions" ON public.gaming_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own sessions" ON public.gaming_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all sessions" ON public.gaming_sessions FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage sessions" ON public.gaming_sessions FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Tournaments: public read
CREATE POLICY "Anyone can view tournaments" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "Admins can manage tournaments" ON public.tournaments FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Tournament participants
CREATE POLICY "Users can view own participation" ON public.tournament_participants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can register for tournaments" ON public.tournament_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all participants" ON public.tournament_participants FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage participants" ON public.tournament_participants FOR ALL USING (has_role(auth.uid(), 'admin'));

-- User XP
CREATE POLICY "Users can view own XP" ON public.user_xp FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public leaderboard view" ON public.user_xp FOR SELECT USING (true);
CREATE POLICY "System can manage XP" ON public.user_xp FOR ALL USING (has_role(auth.uid(), 'admin'));

-- XP transactions
CREATE POLICY "Users can view own XP transactions" ON public.xp_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all XP transactions" ON public.xp_transactions FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage XP transactions" ON public.xp_transactions FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Player DID
CREATE POLICY "Users can view own DID" ON public.player_did FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own DID" ON public.player_did FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Public DID view for leaderboards" ON public.player_did FOR SELECT USING (true);
CREATE POLICY "Admins can manage DIDs" ON public.player_did FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Function to award XP
CREATE OR REPLACE FUNCTION public.award_xp(
    _user_id UUID,
    _amount INTEGER,
    _action_type TEXT,
    _reference_id UUID DEFAULT NULL,
    _description TEXT DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    _new_total INTEGER;
    _new_level INTEGER;
    _xp_for_next INTEGER;
BEGIN
    -- Insert XP transaction
    INSERT INTO xp_transactions (user_id, amount, action_type, reference_id, description)
    VALUES (_user_id, _amount, _action_type, _reference_id, _description);
    
    -- Upsert user_xp record
    INSERT INTO user_xp (user_id, total_xp, lifetime_xp)
    VALUES (_user_id, _amount, _amount)
    ON CONFLICT (user_id) DO UPDATE SET
        total_xp = user_xp.total_xp + _amount,
        lifetime_xp = user_xp.lifetime_xp + _amount,
        updated_at = now();
    
    -- Get new totals and calculate level
    SELECT total_xp INTO _new_total FROM user_xp WHERE user_id = _user_id;
    _new_level := FLOOR(_new_total / 100) + 1;
    _xp_for_next := (_new_level * 100) - _new_total;
    
    -- Update level
    UPDATE user_xp SET 
        current_level = _new_level,
        xp_to_next_level = _xp_for_next
    WHERE user_id = _user_id;
    
    RETURN _new_total;
END;
$$;

-- Insert default tier configurations
INSERT INTO public.coworking_tier_configs (tier, name, description, hourly_rate, daily_rate, monthly_rate, meals_included, amenities, xp_multiplier) VALUES
('basic', 'Basic', 'Hot desk with internet access', 2.00, 10.00, 150.00, 0, '["WiFi", "Power outlets"]', 1.0),
('standard', 'Standard', 'Dedicated desk with snacks', 4.00, 20.00, 300.00, 1, '["WiFi", "Power outlets", "Snacks", "Coffee/Tea"]', 1.25),
('premium', 'Premium', 'Private booth with 2 meals daily', 8.00, 40.00, 600.00, 2, '["WiFi", "Power outlets", "2 Meals", "Coffee/Tea", "Private booth", "Locker"]', 1.5),
('vip', 'VIP', 'Executive suite with all amenities', 15.00, 75.00, 1000.00, 2, '["WiFi", "Power outlets", "2 Meals", "Coffee/Tea", "Private office", "Locker", "Meeting room access", "Priority support"]', 2.0);

-- Insert sample gaming stations
INSERT INTO public.gaming_stations (name, station_type, description, hourly_rate, xp_per_hour, specs) VALUES
('PS5 Station 1', 'ps5', 'PlayStation 5 with 4K display', 5.00, 15, '{"console": "PS5", "display": "4K 120Hz", "controller": "DualSense"}'),
('PS5 Station 2', 'ps5', 'PlayStation 5 with 4K display', 5.00, 15, '{"console": "PS5", "display": "4K 120Hz", "controller": "DualSense"}'),
('PS4 Station 1', 'ps4', 'PlayStation 4 Pro gaming setup', 3.00, 10, '{"console": "PS4 Pro", "display": "1080p", "controller": "DualShock 4"}'),
('PS4 Station 2', 'ps4', 'PlayStation 4 Pro gaming setup', 3.00, 10, '{"console": "PS4 Pro", "display": "1080p", "controller": "DualShock 4"}'),
('VR Racing Sim 1', 'vr_racing', 'Full motion racing simulator with VR', 12.00, 25, '{"headset": "Meta Quest Pro", "wheel": "Fanatec DD", "pedals": "Hydraulic", "motion": "3DOF"}'),
('VR Racing Sim 2', 'vr_racing', 'Full motion racing simulator with VR', 12.00, 25, '{"headset": "Meta Quest Pro", "wheel": "Fanatec DD", "pedals": "Hydraulic", "motion": "3DOF"}'),
('VR Experience Pod', 'vr_immersive', 'Immersive VR gaming pod', 10.00, 20, '{"headset": "Meta Quest 3", "space": "Room-scale", "haptics": "Full body"}'),
('Mobile Esports Station', 'mobile_esports', 'CODM & mobile gaming setup', 2.00, 8, '{"device": "Gaming tablet", "controller": "Backbone", "display": "External monitor"}');

-- Insert sample coworking spaces
INSERT INTO public.coworking_spaces (name, tier, capacity, location, amenities) VALUES
('Hot Desk A1', 'basic', 1, 'Open Floor', '["Power", "WiFi"]'),
('Hot Desk A2', 'basic', 1, 'Open Floor', '["Power", "WiFi"]'),
('Hot Desk A3', 'basic', 1, 'Open Floor', '["Power", "WiFi"]'),
('Standard Desk B1', 'standard', 1, 'Quiet Zone', '["Power", "WiFi", "Monitor"]'),
('Standard Desk B2', 'standard', 1, 'Quiet Zone', '["Power", "WiFi", "Monitor"]'),
('Premium Booth C1', 'premium', 1, 'Private Area', '["Power", "WiFi", "Monitor", "Phone booth"]'),
('Premium Booth C2', 'premium', 2, 'Private Area', '["Power", "WiFi", "Dual monitors", "Whiteboard"]'),
('VIP Suite D1', 'vip', 4, 'Executive Floor', '["Power", "WiFi", "Conference setup", "Mini kitchen"]');

-- Insert sample tournament
INSERT INTO public.tournaments (name, game, description, station_type, entry_fee, prize_pool, max_participants, xp_reward_winner, xp_reward_participation, status, start_date) VALUES
('CODM Championship', 'Call of Duty Mobile', 'Weekly mobile esports tournament', 'mobile_esports', 5.00, 100.00, 32, 500, 50, 'registration', now() + interval '7 days'),
('Gran Turismo VR Cup', 'Gran Turismo 7', 'VR racing championship', 'vr_racing', 10.00, 250.00, 16, 750, 75, 'upcoming', now() + interval '14 days'),
('FIFA 24 Showdown', 'FIFA 24', 'PS5 FIFA tournament', 'ps5', 5.00, 150.00, 24, 400, 40, 'registration', now() + interval '3 days');