-- PAPERLESS CLEARANCE SYSTEM - CLEAN RESET
-- This will delete old tables and create the new broad structure

-- 0. CLEANUP (Delete existing tables in correct order)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS clearance_approvals CASCADE;
DROP TABLE IF EXISTS clearance_requests CASCADE;
DROP TABLE IF EXISTS clearance_requirements CASCADE;
DROP TABLE IF EXISTS clearance_periods CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. DEPARTMENTS
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ORGANIZATIONS
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  description TEXT,
  is_academic BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. USERS
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL,
  student_id TEXT,
  department_id UUID REFERENCES departments(id),
  organization_id UUID REFERENCES organizations(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CLEARANCE PERIODS
CREATE TABLE clearance_periods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CLEARANCE REQUIREMENTS
CREATE TABLE clearance_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  department_id UUID REFERENCES departments(id),
  period_type TEXT,
  is_mandatory BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. CLEARANCE REQUESTS
CREATE TABLE clearance_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id) NOT NULL,
  period_id UUID REFERENCES clearance_periods(id) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. CLEARANCE APPROVALS
CREATE TABLE clearance_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES clearance_requests(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  status TEXT DEFAULT 'pending',
  remarks TEXT,
  approved_by UUID REFERENCES users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. DOCUMENTS
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES clearance_requests(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. NOTIFICATIONS
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. AUDIT LOGS
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEED DATA
-- Populate initial organizations
INSERT INTO organizations (name, code, description) VALUES 
('Medical Clinic', 'CLINIC', 'Health and medical verification'),
('Student Affairs Services', 'SAS', 'Disciplinary and student conduct'),
('Accounting Office', 'ACCOUNTING', 'Balance and tuition verification'),
('Library Services', 'LIBRARY', 'Book returns and library dues'),
('Registrar Office', 'REGISTRAR', 'Academic records and final sign-off');

-- Create a test admin user (Password: password123)
INSERT INTO users (
  email, 
  password_hash, 
  first_name, 
  last_name, 
  role
) VALUES (
  'admin@test.com', 
  '$2a$12$LQv3c1yqBWVHxkd0LNJ6ueXeEEXGVasSXJDdrE7vIayUMjkipqn8y',
  'System', 
  'Administrator', 
  'ADMIN'
) ON CONFLICT (email) DO NOTHING;
