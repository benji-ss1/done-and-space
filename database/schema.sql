-- ============================================================
-- DONE & SPACE PROPERTIES — DATABASE SCHEMA
-- Supabase / PostgreSQL
-- Zambia | ZMW | Phase 1
-- ============================================================

-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- BRANCHES
-- ============================================================
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  province TEXT NOT NULL CHECK (province IN (
    'Lusaka','Copperbelt','Central','Eastern','Western',
    'Northern','Luapula','North-Western','Southern','Muchinga'
  )),
  address TEXT,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN (
    'super_admin','admin','manager','agent','staff','compliance'
  )),
  branch_id UUID REFERENCES branches(id),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_branch ON users(branch_id);

-- ============================================================
-- REFRESH TOKENS
-- ============================================================
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked BOOLEAN DEFAULT false,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash);

-- ============================================================
-- PROPERTIES
-- ============================================================
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_no TEXT UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  listing_type TEXT NOT NULL CHECK (listing_type IN ('sale','let')),
  property_type TEXT NOT NULL CHECK (property_type IN (
    'apartment','house','land','commercial','mixed_use','townhouse'
  )),
  price NUMERIC(15,2) NOT NULL,
  currency TEXT DEFAULT 'ZMW',
  bedrooms INT,
  bathrooms INT,
  size_sqm NUMERIC(10,2),
  address TEXT NOT NULL,
  area TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Lusaka',
  province TEXT NOT NULL CHECK (province IN (
    'Lusaka','Copperbelt','Central','Eastern','Western',
    'Northern','Luapula','North-Western','Southern','Muchinga'
  )),
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  features TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft','pending_review','approved','published',
    'under_offer','sold','let','expired','archived'
  )),
  mandate_type TEXT CHECK (mandate_type IN ('exclusive','open')),
  mandate_expiry DATE,
  listed_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  branch_id UUID REFERENCES branches(id),
  view_count INT DEFAULT 0,
  inquiry_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_type ON properties(listing_type);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_branch ON properties(branch_id);
CREATE INDEX idx_properties_agent ON properties(listed_by);

-- ============================================================
-- PROPERTY IMAGES
-- ============================================================
CREATE TABLE property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- PROPERTY DOCUMENTS
-- ============================================================
CREATE TABLE property_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL CHECK (doc_type IN (
    'certificate_of_title','leasehold_title','mandate',
    'survey','rates_clearance','offer_letter','other'
  )),
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMPTZ,
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- LEADS / CRM
-- ============================================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'website' CHECK (source IN (
    'website','whatsapp','referral','agent','walk_in',
    'social','facebook','email','other'
  )),
  interest_type TEXT NOT NULL CHECK (interest_type IN (
    'buy','rent','sell','let','invest'
  )),
  budget_min NUMERIC(15,2),
  budget_max NUMERIC(15,2),
  currency TEXT DEFAULT 'ZMW',
  preferred_area TEXT,
  preferred_province TEXT,
  bedrooms_needed INT,
  property_type_interest TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN (
    'new','contacted','qualified','warm','hot','cold','lost','converted'
  )),
  assigned_to UUID REFERENCES users(id),
  property_id UUID REFERENCES properties(id),
  next_action_date DATE,
  branch_id UUID REFERENCES branches(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned ON leads(assigned_to);
CREATE INDEX idx_leads_branch ON leads(branch_id);
CREATE INDEX idx_leads_created ON leads(created_at DESC);

-- ============================================================
-- LEAD INTERACTIONS
-- ============================================================
CREATE TABLE lead_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'call','email','whatsapp','viewing','note','meeting','sms'
  )),
  notes TEXT NOT NULL,
  outcome TEXT,
  next_action TEXT,
  next_action_date DATE,
  logged_by UUID REFERENCES users(id),
  interaction_date TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_interactions_lead ON lead_interactions(lead_id);

-- ============================================================
-- DEALS
-- ============================================================
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_no TEXT UNIQUE NOT NULL,
  lead_id UUID REFERENCES leads(id),
  property_id UUID REFERENCES properties(id) NOT NULL,
  agent_id UUID REFERENCES users(id) NOT NULL,
  deal_type TEXT NOT NULL CHECK (deal_type IN ('sale','let')),
  stage TEXT NOT NULL DEFAULT 'qualification' CHECK (stage IN (
    'qualification','viewing_scheduled','viewing_done',
    'offer_made','negotiation','under_contract',
    'completed','fallen_through'
  )),
  agreed_price NUMERIC(15,2),
  currency TEXT DEFAULT 'ZMW',
  commission_rate NUMERIC(5,2) DEFAULT 5.00,
  commission_amount NUMERIC(15,2),
  agent_split_percent NUMERIC(5,2) DEFAULT 50.00,
  agent_commission NUMERIC(15,2),
  company_commission NUMERIC(15,2),
  commission_status TEXT DEFAULT 'pending' CHECK (commission_status IN (
    'pending','approved','paid','disputed'
  )),
  probability INT DEFAULT 20 CHECK (probability BETWEEN 0 AND 100),
  expected_close_date DATE,
  actual_close_date DATE,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_deals_stage ON deals(stage);
CREATE INDEX idx_deals_agent ON deals(agent_id);
CREATE INDEX idx_deals_property ON deals(property_id);

-- ============================================================
-- VIEWINGS
-- ============================================================
CREATE TABLE viewings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES deals(id),
  property_id UUID REFERENCES properties(id) NOT NULL,
  lead_id UUID REFERENCES leads(id) NOT NULL,
  agent_id UUID REFERENCES users(id) NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INT DEFAULT 60,
  status TEXT DEFAULT 'scheduled' CHECK (status IN (
    'scheduled','completed','cancelled','no_show','rescheduled'
  )),
  client_feedback TEXT,
  agent_notes TEXT,
  outcome TEXT CHECK (outcome IN (
    'interested','not_interested','offer_expected','needs_time',null
  )),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_viewings_scheduled ON viewings(scheduled_at);
CREATE INDEX idx_viewings_agent ON viewings(agent_id);

-- ============================================================
-- AGENT APPLICATIONS (CAREERS)
-- ============================================================
CREATE TABLE agent_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  province TEXT NOT NULL,
  city TEXT,
  experience_years INT DEFAULT 0,
  current_employer TEXT,
  motivation TEXT,
  cv_url TEXT,
  cv_storage_path TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN (
    'new','screening','interview_scheduled',
    'interview_done','offer_made','hired','rejected'
  )),
  interview_date TIMESTAMPTZ,
  notes TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- AUDIT LOG
-- ============================================================
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_value JSONB,
  new_value JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_log(created_at DESC);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_properties_updated BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_leads_updated BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_deals_updated BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-generate deal reference
CREATE OR REPLACE FUNCTION generate_deal_reference()
RETURNS TRIGGER AS $$
DECLARE
  seq INT;
BEGIN
  SELECT COUNT(*) + 1 INTO seq FROM deals;
  NEW.reference_no = 'DL-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(seq::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_deal_reference BEFORE INSERT ON deals
  FOR EACH ROW WHEN (NEW.reference_no IS NULL OR NEW.reference_no = '')
  EXECUTE FUNCTION generate_deal_reference();

-- Auto-calculate commission on deal update
CREATE OR REPLACE FUNCTION calculate_commission()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.agreed_price IS NOT NULL AND NEW.commission_rate IS NOT NULL THEN
    NEW.commission_amount = ROUND(NEW.agreed_price * NEW.commission_rate / 100, 2);
    NEW.agent_commission = ROUND(NEW.commission_amount * NEW.agent_split_percent / 100, 2);
    NEW.company_commission = NEW.commission_amount - NEW.agent_commission;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_commission BEFORE INSERT OR UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION calculate_commission();

-- Get least loaded agent in a branch
CREATE OR REPLACE FUNCTION get_least_loaded_agent(p_branch_id UUID DEFAULT NULL)
RETURNS TABLE(id UUID, full_name TEXT, open_leads BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.full_name,
    COUNT(l.id) FILTER (WHERE l.status NOT IN ('lost','converted')) AS open_leads
  FROM users u
  LEFT JOIN leads l ON l.assigned_to = u.id
  WHERE u.role = 'agent'
    AND u.is_active = true
    AND (p_branch_id IS NULL OR u.branch_id = p_branch_id)
  GROUP BY u.id, u.full_name
  ORDER BY open_leads ASC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Dashboard KPI summary
CREATE OR REPLACE FUNCTION get_dashboard_stats(p_branch_id UUID DEFAULT NULL)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'active_listings', (
      SELECT COUNT(*) FROM properties
      WHERE status = 'published'
      AND (p_branch_id IS NULL OR branch_id = p_branch_id)
    ),
    'pending_approvals', (
      SELECT COUNT(*) FROM properties
      WHERE status = 'pending_review'
      AND (p_branch_id IS NULL OR branch_id = p_branch_id)
    ),
    'total_leads', (
      SELECT COUNT(*) FROM leads
      WHERE (p_branch_id IS NULL OR branch_id = p_branch_id)
    ),
    'new_leads', (
      SELECT COUNT(*) FROM leads
      WHERE status = 'new'
      AND (p_branch_id IS NULL OR branch_id = p_branch_id)
    ),
    'hot_leads', (
      SELECT COUNT(*) FROM leads
      WHERE status = 'hot'
      AND (p_branch_id IS NULL OR branch_id = p_branch_id)
    ),
    'active_deals', (
      SELECT COUNT(*) FROM deals
      WHERE stage NOT IN ('completed','fallen_through')
    ),
    'deals_closing', (
      SELECT COUNT(*) FROM deals
      WHERE stage IN ('under_contract','negotiation')
    ),
    'commission_pipeline', (
      SELECT COALESCE(SUM(commission_amount), 0)
      FROM deals
      WHERE stage NOT IN ('completed','fallen_through')
      AND commission_status = 'pending'
    ),
    'commission_earned_month', (
      SELECT COALESCE(SUM(company_commission), 0)
      FROM deals
      WHERE stage = 'completed'
      AND actual_close_date >= DATE_TRUNC('month', NOW())
    )
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS (used by backend)
-- Frontend uses anon key with these policies for public reads only

-- Public can read published properties
CREATE POLICY "public_read_published_properties"
  ON properties FOR SELECT
  TO anon
  USING (status = 'published');

-- ============================================================
-- SEED: Default super admin + Lusaka branch
-- ============================================================
-- Password: Admin@DSP2026 (bcrypt hash)
INSERT INTO branches (id, name, province, address, email, phone) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Lusaka HQ', 'Lusaka', 'Cairo Road, Lusaka', 'lusaka@doneandspace.co.zm', '+260977000001');

INSERT INTO users (id, email, password_hash, full_name, role, branch_id) VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'admin@doneandspace.co.zm',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMUdfMJJGUhJdThPCXxijhH3sW',
    'System Administrator',
    'super_admin',
    '00000000-0000-0000-0000-000000000001'
  );
