-- Portfolio CMS Database Schema for PostgreSQL
-- Compatible with Supabase, Vercel Postgres, and standard PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROJECTS TABLE
-- =====================================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  content TEXT,
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  image_url TEXT,
  screenshots TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_published ON projects(published);
CREATE INDEX idx_projects_order ON projects(order_index);
CREATE INDEX idx_projects_slug ON projects(slug);

-- =====================================================
-- BLOG POSTS TABLE
-- =====================================================
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  tags TEXT[] DEFAULT '{}',
  category TEXT,
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  reading_time INTEGER, -- in minutes
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published, published_at DESC);
CREATE INDEX idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);

-- =====================================================
-- SKILLS TABLE
-- =====================================================
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency INTEGER NOT NULL CHECK (proficiency >= 0 AND proficiency <= 100),
  icon TEXT,
  color TEXT,
  years_experience DECIMAL(3, 1),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_order ON skills(order_index);

-- =====================================================
-- EXPERIENCES (Work History)
-- =====================================================
CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT,
  responsibilities TEXT[] DEFAULT '{}',
  achievements TEXT[] DEFAULT '{}',
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN DEFAULT false,
  location TEXT,
  company_url TEXT,
  company_logo TEXT,
  technologies TEXT[] DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_experiences_current ON experiences(current);
CREATE INDEX idx_experiences_order ON experiences(order_index);

-- =====================================================
-- EDUCATION
-- =====================================================
CREATE TABLE education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN DEFAULT false,
  grade TEXT,
  location TEXT,
  logo TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_education_order ON education(order_index);

-- =====================================================
-- CERTIFICATIONS
-- =====================================================
CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  credential_id TEXT,
  credential_url TEXT,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_certifications_order ON certifications(order_index);

-- =====================================================
-- TESTIMONIALS
-- =====================================================
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_role TEXT,
  client_company TEXT,
  client_avatar TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_testimonials_featured ON testimonials(featured);
CREATE INDEX idx_testimonials_published ON testimonials(published);
CREATE INDEX idx_testimonials_order ON testimonials(order_index);

-- =====================================================
-- ABOUT (Personal Information)
-- =====================================================
CREATE TABLE about (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  bio TEXT NOT NULL,
  bio_short TEXT,
  tagline TEXT,
  avatar_url TEXT,
  resume_url TEXT,
  location TEXT,
  email TEXT,
  phone TEXT,
  available_for_work BOOLEAN DEFAULT true,
  years_experience INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- JOURNEY (Career Timeline)
-- =====================================================
CREATE TABLE journey (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_journey_year ON journey(year DESC);
CREATE INDEX idx_journey_order ON journey(order_index);

-- =====================================================
-- VALUES (Core Values)
-- =====================================================
CREATE TABLE core_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_core_values_order ON core_values(order_index);

-- =====================================================
-- SOCIAL LINKS
-- =====================================================
CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_social_links_order ON social_links(order_index);

-- =====================================================
-- CONTACT FORM SUBMISSIONS (Optional)
-- =====================================================
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_created ON contact_submissions(created_at DESC);

-- =====================================================
-- PAGE VIEWS / ANALYTICS (Optional)
-- =====================================================
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_page_views_path ON page_views(page_path);
CREATE INDEX idx_page_views_created ON page_views(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) - Supabase
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view published projects"
  ON projects FOR SELECT
  USING (published = true);

CREATE POLICY "Public can view published blog posts"
  ON blog_posts FOR SELECT
  USING (published = true);

CREATE POLICY "Public can view skills"
  ON skills FOR SELECT
  USING (true);

CREATE POLICY "Public can view experiences"
  ON experiences FOR SELECT
  USING (true);

CREATE POLICY "Public can view education"
  ON education FOR SELECT
  USING (true);

CREATE POLICY "Public can view certifications"
  ON certifications FOR SELECT
  USING (true);

CREATE POLICY "Public can view published testimonials"
  ON testimonials FOR SELECT
  USING (published = true);

CREATE POLICY "Public can view about"
  ON about FOR SELECT
  USING (true);

CREATE POLICY "Public can view journey"
  ON journey FOR SELECT
  USING (true);

CREATE POLICY "Public can view core values"
  ON core_values FOR SELECT
  USING (true);

CREATE POLICY "Public can view social links"
  ON social_links FOR SELECT
  USING (true);

-- Authenticated users (admin) can do everything
CREATE POLICY "Authenticated users can manage projects"
  ON projects FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage blog posts"
  ON blog_posts FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage skills"
  ON skills FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage experiences"
  ON experiences FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage education"
  ON education FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage certifications"
  ON certifications FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage testimonials"
  ON testimonials FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage about"
  ON about FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage journey"
  ON journey FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage core values"
  ON core_values FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage social links"
  ON social_links FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view contact submissions"
  ON contact_submissions FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view analytics"
  ON page_views FOR SELECT
  USING (auth.role() = 'authenticated');

-- Anyone can insert contact form submissions
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

-- Anyone can track page views
CREATE POLICY "Anyone can track page views"
  ON page_views FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON experiences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON certifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_about_updated_at BEFORE UPDATE ON about
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journey_updated_at BEFORE UPDATE ON journey
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_core_values_updated_at BEFORE UPDATE ON core_values
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_links_updated_at BEFORE UPDATE ON social_links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- HEALTH CHECK
-- =====================================================
CREATE TABLE health_check (
  id INTEGER PRIMARY KEY,
  last_ping TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO health_check (id, last_ping) VALUES (1, NOW());

-- Enable RLS
ALTER TABLE health_check ENABLE ROW LEVEL SECURITY;

-- Allow public read/update for health check (or restrict as needed)
-- For now, allowing public access as requested
CREATE POLICY "Public can view health check"
  ON health_check FOR SELECT
  USING (true);

CREATE POLICY "Public can update health check"
  ON health_check FOR UPDATE
  USING (true);


-- =====================================================
-- SEED DATA (Optional - Example)
-- =====================================================

-- Insert default about record (only one should exist)
INSERT INTO about (
  bio,
  bio_short,
  tagline,
  available_for_work,
  years_experience
) VALUES (
  'I am a full-stack developer passionate about creating beautiful, performant web applications.',
  'Full-stack developer with expertise in React, Next.js, and Node.js.',
  'Building the future, one line of code at a time.',
  true,
  5
);

-- Example social links
INSERT INTO social_links (platform, url, icon, order_index) VALUES
  ('GitHub', 'https://github.com/yourusername', 'github', 1),
  ('LinkedIn', 'https://linkedin.com/in/yourusername', 'linkedin', 2),
  ('Twitter', 'https://twitter.com/yourusername', 'twitter', 3),
  ('Email', 'mailto:your@email.com', 'mail', 4);

-- Example skill categories
INSERT INTO skills (name, category, proficiency, icon, order_index) VALUES
  ('React', 'Frontend', 90, 'react', 1),
  ('Next.js', 'Frontend', 85, 'nextjs', 2),
  ('TypeScript', 'Languages', 88, 'typescript', 3),
  ('Node.js', 'Backend', 82, 'nodejs', 4),
  ('PostgreSQL', 'Database', 80, 'database', 5);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
-- Schema created successfully!
-- Next steps:
-- 1. Configure environment variables
-- 2. Test connection
-- 3. Migrate data from localStorage
-- 4. Update application code to use database
