Failed to update profile-- 1. ORGANIZATIONS
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. USERS
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL,
  student_id TEXT,
  department TEXT,
  contact_number TEXT,
  organization_id UUID REFERENCES organizations(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CLEARANCE PERIODS
CREATE TABLE clearance_periods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CLEARANCE REQUESTS
CREATE TABLE clearance_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id) NOT NULL,
  period_id UUID REFERENCES clearance_periods(id) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CLEARANCE APPROVALS
CREATE TABLE clearance_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES clearance_requests(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  status TEXT DEFAULT 'pending',
  remarks TEXT,
  approved_by UUID REFERENCES users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. DOCUMENTS
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES clearance_requests(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEED DATA
-- Create a test admin user (Password: password123)
INSERT INTO users (
  email, 
  password_hash, 
  first_name, 
  last_name, 
  role
) VALUES (
  'admin@test.com', 
  '$2a$12$R.S/Iu5kZ7XnVZ2H0H8u4.u6nC2Hh.m1x1.o1.u1.u1.u1.u1.u1',
  'System', 
  'Administrator', 
  'ADMIN'
) ON CONFLICT (email) DO NOTHING;
