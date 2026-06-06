
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('super_admin', 'institution_admin', 'staff', 'user');
CREATE TYPE public.institution_type AS ENUM ('hotel', 'garden', 'sports', 'university', 'airbnb');
CREATE TYPE public.price_unit AS ENUM ('hour', 'night', 'month');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_self_select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_self_update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_self_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles_self_select" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- ============ INSTITUTIONS ============
CREATE TABLE public.institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type public.institution_type NOT NULL,
  campus TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Debrecen',
  description TEXT,
  image_url TEXT,
  rating NUMERIC(2,1) DEFAULT 4.5,
  contact_email TEXT,
  contact_phone TEXT,
  amenities TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.institutions TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.institutions TO authenticated;
GRANT ALL ON public.institutions TO service_role;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "institutions_public_read" ON public.institutions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "institutions_admin_insert" ON public.institutions FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'institution_admin'));
CREATE POLICY "institutions_admin_update" ON public.institutions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'institution_admin'));
CREATE POLICY "institutions_super_delete" ON public.institutions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

-- ============ SPACES ============
CREATE TABLE public.spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  capacity INT NOT NULL DEFAULT 1,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  price_unit public.price_unit NOT NULL DEFAULT 'hour',
  image_url TEXT,
  amenities TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.spaces TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.spaces TO authenticated;
GRANT ALL ON public.spaces TO service_role;
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
CREATE POLICY "spaces_public_read" ON public.spaces FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "spaces_admin_write" ON public.spaces FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'institution_admin')) WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'institution_admin'));

-- ============ BOOKINGS ============
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  total_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  status public.booking_status NOT NULL DEFAULT 'confirmed',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bookings_own_select" ON public.bookings FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "bookings_own_insert" ON public.bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bookings_own_update" ON public.bookings FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "bookings_own_delete" ON public.bookings FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'super_admin'));

-- ============ updated_at trigger ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_institutions_updated BEFORE UPDATE ON public.institutions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_spaces_updated BEFORE UPDATE ON public.spaces FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ Auto-create profile on signup ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), NEW.email)
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ SEED DATA (Debrecen) ============
WITH ins AS (
  INSERT INTO public.institutions (name, type, campus, address, description, image_url, rating, contact_email, contact_phone, amenities) VALUES
  ('Hotel Divinus', 'hotel', 'Main Building', 'Nagyerdei krt. 1, Debrecen 4032', 'Premium 4-star wellness hotel adjacent to the Great Forest, steps from the University of Debrecen Main Building.', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200', 4.7, 'reservations@hoteldivinus.hu', '+36 52 540 400', ARRAY['Wellness','Pool','Restaurant','Parking','WiFi']),
  ('Hotel Lycium', 'hotel', 'Main Building', 'Hunyadi u. 1-3, Debrecen 4025', 'Modern 4-star city-centre hotel with conference facilities.', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200', 4.5, 'info@hotellycium.hu', '+36 52 506 600', ARRAY['Restaurant','Bar','Conference','WiFi']),
  ('Aquaticum Resort', 'hotel', 'Main Building', 'Nagyerdei park 1, Debrecen 4032', 'Thermal spa hotel inside Nagyerdei park.', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200', 4.6, 'info@aquaticum.hu', '+36 52 514 100', ARRAY['Thermal Spa','Pool','Wellness']),
  ('Kassai úti Sportcsarnok', 'sports', 'Kassai', 'Kassai út 26, Debrecen 4028', 'University sports hall hosting basketball, handball and indoor football.', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200', 4.4, 'sport@unideb.hu', '+36 52 512 900', ARRAY['Locker Rooms','Showers','Parking']),
  ('Agrár Kampusz Atlétikai Pálya', 'sports', 'Agrár', 'Böszörményi út 138, Debrecen 4032', 'Outdoor athletics track at the Agricultural campus.', 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200', 4.3, 'agrar.sport@unideb.hu', '+36 52 508 444', ARRAY['Track','Field','Lighting']),
  ('Főépület Díszterem', 'university', 'Main Building', 'Egyetem tér 1, Debrecen 4032', 'Historic ceremonial hall in the University of Debrecen Main Building.', 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200', 4.9, 'rendezveny@unideb.hu', '+36 52 512 900', ARRAY['Stage','AV System','Piano']),
  ('Ótemető Kollégium', 'university', 'Ótemető', 'Ótemető u. 2-4, Debrecen 4028', 'Student dormitory event rooms and study halls.', 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200', 4.2, 'otemeto@unideb.hu', '+36 52 512 700', ARRAY['Study Rooms','WiFi']),
  ('Nagyerdei Közösségi Kert', 'garden', 'Main Building', 'Pallagi út 5, Debrecen 4032', 'Community garden plots near the Great Forest for monthly rental.', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200', 4.6, 'kert@debrecen.hu', '+36 52 511 200', ARRAY['Water','Tools Shed','Compost']),
  ('Belvárosi Apartman – Piac utca', 'airbnb', 'Main Building', 'Piac u. 45, Debrecen 4025', 'Stylish two-bedroom apartment on Debrecen''s main pedestrian street.', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200', 4.8, 'host@piac45.hu', '+36 30 555 1234', ARRAY['WiFi','Kitchen','Washer','Balcony'])
  RETURNING id, name, type
)
INSERT INTO public.spaces (institution_id, name, description, capacity, price, price_unit, image_url, amenities) 
SELECT i.id, s.name, s.description, s.capacity, s.price, s.price_unit::public.price_unit, s.image_url, s.amenities
FROM ins i
JOIN (VALUES
  ('Hotel Divinus', 'Deluxe Double Room', 'King bed, park view, wellness access', 2, 32000, 'night', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200', ARRAY['WiFi','Wellness','Breakfast']),
  ('Hotel Divinus', 'Executive Suite', 'Two-room suite with balcony', 3, 58000, 'night', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200', ARRAY['WiFi','Wellness','Lounge Access']),
  ('Hotel Lycium', 'Standard Double Room', 'Comfortable city-view double', 2, 26500, 'night', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200', ARRAY['WiFi','Breakfast']),
  ('Hotel Lycium', 'Conference Hall A', 'Up to 120 seats theatre layout', 120, 45000, 'hour', 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=1200', ARRAY['Projector','Mic','WiFi']),
  ('Aquaticum Resort', 'Thermal Suite', 'Direct access to thermal spa', 2, 42000, 'night', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200', ARRAY['Spa','WiFi','Breakfast']),
  ('Kassai úti Sportcsarnok', 'Main Court', 'Full basketball / handball court', 30, 12000, 'hour', 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=1200', ARRAY['Scoreboard','Locker Rooms']),
  ('Kassai úti Sportcsarnok', 'Fitness Room', 'Equipped fitness studio', 15, 6000, 'hour', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200', ARRAY['Mats','Mirrors']),
  ('Agrár Kampusz Atlétikai Pálya', 'Athletics Track', '400m tartan track', 50, 8000, 'hour', 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1200', ARRAY['Lighting','Stands']),
  ('Főépület Díszterem', 'Ceremonial Hall', 'Historic 400-seat hall', 400, 0, 'hour', 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200', ARRAY['Stage','Piano','AV']),
  ('Főépület Díszterem', 'Senate Room', 'Formal meeting room for 40', 40, 0, 'hour', 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=1200', ARRAY['Projector','WiFi']),
  ('Ótemető Kollégium', 'Study Hall', 'Quiet study hall for 60 students', 60, 0, 'hour', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200', ARRAY['WiFi','Whiteboards']),
  ('Nagyerdei Közösségi Kert', 'Garden Plot A (20 m²)', 'Sunny plot with water access', 4, 7500, 'month', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200', ARRAY['Water','Tools']),
  ('Nagyerdei Közösségi Kert', 'Garden Plot B (40 m²)', 'Larger plot near compost area', 6, 12500, 'month', 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1200', ARRAY['Water','Compost']),
  ('Belvárosi Apartman – Piac utca', 'Entire Apartment', '2 bedrooms · 1 bath · sleeps 4', 4, 28500, 'night', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200', ARRAY['WiFi','Kitchen','Washer'])
) AS s(inst_name, name, description, capacity, price, price_unit, image_url, amenities)
ON s.inst_name = i.name;
