
-- Create hotspots table for WiFi locations
CREATE TABLE public.hotspots (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status TEXT NOT NULL DEFAULT 'active',
    signal_strength INTEGER DEFAULT 100,
    capacity INTEGER DEFAULT 50,
    current_users INTEGER DEFAULT 0,
    is_solar_powered BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create plans table for internet packages
CREATE TABLE public.plans (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration_hours INTEGER NOT NULL,
    data_limit_mb INTEGER,
    speed_mbps INTEGER NOT NULL DEFAULT 10,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vouchers table
CREATE TABLE public.vouchers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    plan_id UUID REFERENCES public.plans(id) ON DELETE CASCADE NOT NULL,
    user_id UUID,
    is_used BOOLEAN DEFAULT false,
    activated_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID
);

-- Create user_plans table for active subscriptions
CREATE TABLE public.user_plans (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    plan_id UUID REFERENCES public.plans(id) ON DELETE CASCADE NOT NULL,
    voucher_id UUID REFERENCES public.vouchers(id),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    data_used_mb INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active',
    payment_status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.hotspots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;

-- Hotspots policies (public read, admin manage)
CREATE POLICY "Anyone can view hotspots" ON public.hotspots FOR SELECT USING (true);
CREATE POLICY "Admins can manage hotspots" ON public.hotspots FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Plans policies (public read, admin manage)
CREATE POLICY "Anyone can view active plans" ON public.plans FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage plans" ON public.plans FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Vouchers policies
CREATE POLICY "Users can view their own vouchers" ON public.vouchers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage vouchers" ON public.vouchers FOR ALL USING (has_role(auth.uid(), 'admin'));

-- User plans policies
CREATE POLICY "Users can view their own plans" ON public.user_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own plans" ON public.user_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage user plans" ON public.user_plans FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Fix payments INSERT policy (missing)
CREATE POLICY "Users can create their own payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_hotspots_updated_at BEFORE UPDATE ON public.hotspots FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample hotspots
INSERT INTO public.hotspots (name, location, latitude, longitude, status, signal_strength, capacity, is_solar_powered) VALUES
('Lekki Hub', 'Lekki Phase 1, Lagos', 6.4541, 3.4714, 'active', 95, 100, true),
('VI Central', 'Victoria Island, Lagos', 6.4281, 3.4219, 'active', 88, 75, true),
('Ikeja Tech Park', 'Ikeja GRA, Lagos', 6.6018, 3.3515, 'active', 92, 50, true),
('Yaba Digital', 'Yaba, Lagos', 6.5095, 3.3711, 'active', 85, 80, true),
('Surulere Connect', 'Surulere, Lagos', 6.5000, 3.3500, 'active', 78, 60, false);

-- Insert sample plans
INSERT INTO public.plans (name, description, price, duration_hours, data_limit_mb, speed_mbps, is_active) VALUES
('Quick Connect', '1 hour of fast internet', 0.50, 1, 500, 10, true),
('Day Pass', 'Full day unlimited access', 2.00, 24, 5000, 20, true),
('Weekly Explorer', '7 days of connectivity', 10.00, 168, 20000, 25, true),
('Monthly Pro', '30 days premium access', 35.00, 720, NULL, 50, true);
