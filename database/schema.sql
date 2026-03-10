-- Create database schema for Paperless Clearance System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table with role-based access
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'sub_organization', 'mother_organization', 'adviser', 'ncssc', 'clinic', 'sas', 'admin')),
  student_id VARCHAR(50) UNIQUE,
  department VARCHAR(100),
  contact_number VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organizations table
CREATE TABLE organizations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('sub_organization', 'mother_organization')),
  description TEXT,
  adviser_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clearance requests table
CREATE TABLE clearance_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES users(id),
  purpose TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  academic_year VARCHAR(20) NOT NULL,
  semester VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clearance approvals table (for each role to approve)
CREATE TABLE clearance_approvals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clearance_request_id UUID NOT NULL REFERENCES clearance_requests(id) ON DELETE CASCADE,
  approver_role VARCHAR(50) NOT NULL CHECK (approver_role IN ('sub_organization', 'mother_organization', 'adviser', 'ncssc', 'clinic', 'sas')),
  approver_id UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'skipped')),
  notes TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(clearance_request_id, approver_role)
);

-- Documents table
CREATE TABLE documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clearance_request_id UUID REFERENCES clearance_requests(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organization memberships
CREATE TABLE organization_memberships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('member', 'officer', 'president')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, organization_id)
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_student_id ON users(student_id);
CREATE INDEX idx_clearance_requests_student_id ON clearance_requests(student_id);
CREATE INDEX idx_clearance_requests_status ON clearance_requests(status);
CREATE INDEX idx_clearance_approvals_request_id ON clearance_approvals(clearance_request_id);
CREATE INDEX idx_clearance_approvals_approver_id ON clearance_approvals(approver_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clearance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE clearance_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_memberships ENABLE ROW LEVEL SECURITY;

-- Users can see their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Students can view their own clearance requests
CREATE POLICY "Students view own clearance requests" ON clearance_requests
  FOR SELECT USING (auth.uid()::text = student_id::text);

-- Students can create clearance requests
CREATE POLICY "Students create clearance requests" ON clearance_requests
  FOR INSERT WITH CHECK (auth.uid()::text = student_id::text);

-- Approvers can view clearance requests pending their approval
CREATE POLICY "Approvers view relevant clearance requests" ON clearance_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM clearance_approvals 
      WHERE clearance_approvals.clearance_request_id = clearance_requests.id 
      AND clearance_approvals.approver_role IN (
        SELECT role FROM users WHERE id::text = auth.uid()::text
      )
    )
  );

-- Approvers can update approval status
CREATE POLICY "Approvers update approvals" ON clearance_approvals
  FOR UPDATE USING (auth.uid()::text = approver_id::text);

-- Users can view their own notifications
CREATE POLICY "Users view own notifications" ON notifications
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Users can update notification read status
CREATE POLICY "Users update own notifications" ON notifications
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Insert sample admin user (password: admin123)
INSERT INTO users (email, password_hash, first_name, last_name, role) 
VALUES ('admin@paperless.edu', '$2a$10$rQZ8kHWKtGY5uKx4vK2vA.9J8K5K2vA.9J8K5K2vA.9J8K5K2vA.9J8K', 'System', 'Administrator', 'admin');
