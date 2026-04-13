-- PAPERLESS CLEARANCE SYSTEM - DATABASE SCHEMA
-- Last Updated: 2026-04-12

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ORGANIZATIONS
-- These are the offices that sign off on clearances (e.g., Clinic, SAS, Library)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. USERS
-- Includes Students, Officers (linked to orgs), and Admins
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL, -- 'STUDENT', 'ADMIN', 'CLINIC', etc.
  student_id TEXT,    -- Used for students
  department TEXT,    -- Used for students
  contact_number TEXT,
  organization_id UUID REFERENCES organizations(id), -- Linked if the user is an officer
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CLEARANCE PERIODS
-- To track different semesters or school years
CREATE TABLE clearance_periods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, -- e.g., '1st Semester 2023-2024'
  is_active BOOLEAN DEFAULT true,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CLEARANCE REQUESTS
-- The main request submitted by a student
CREATE TABLE clearance_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id) NOT NULL,
  period_id UUID REFERENCES clearance_periods(id) NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'partially_approved', 'approved', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CLEARANCE APPROVALS
-- Individual signature steps for each request
CREATE TABLE clearance_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES clearance_requests(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  remarks TEXT,
  approved_by UUID REFERENCES users(id), -- The officer who signed it
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Create a test admin user

-- 6. DOCUMENTS
-- Files uploaded by students for their clearance requests
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES clearance_requests(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Password will be 'password123' (hashed for bcrypt)
INSERT INTO users (
  email, 
  password_hash, 
  first_name, 
  last_name, 
  role
) VALUES (
  'admin@test.com', 
  '$2a$12$R.S/Iu5kZ7XnVZ2H0H8u4.u6nC2Hh.m1x1.o1.u1.u1.u1.u1.u1', -- this is 'password123'
  'System', 
  'Administrator', 
  'ADMIN'
);
