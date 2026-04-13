-- Seed admin user
-- Password: password123
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
