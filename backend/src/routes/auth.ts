import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../lib/supabase';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    const { password_hash, ...userWithoutPassword } = user;

    res.json({ message: 'Login successful', token, user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, studentId, department, contactNumber } = req.body;

    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({ error: 'Email, password, first name, last name, and role are required' });
    }

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        role,
        student_id: studentId || null,
        department: department || null,
        contact_number: contactNumber || null,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to create user' });
    }

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    const { password_hash, ...userWithoutPassword } = newUser;

    res.status(201).json({ message: 'User registered successfully', token, user: userWithoutPassword });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.userId)
      .single();

    if (error || !user || !user.is_active) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { password_hash, ...userWithoutPassword } = user;

    res.json({ valid: true, user: userWithoutPassword });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.put('/profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { firstName, lastName } = req.body;
    const userId = req.user?.userId;
    const fs = require('fs');
    fs.appendFileSync('debug.log', `[${new Date().toISOString()}] Update Profile: userId=${userId}, firstName=${firstName}, lastName=${lastName}\n`);
    console.log('Update Profile Request:', { userId, firstName, lastName });

    const { data, error } = await supabase
      .from('users')
      .update({ first_name: firstName, last_name: lastName })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Supabase Update Error:', error);
      throw error;
    }
    if (!data) {
      return res.status(404).json({ error: 'User row not found' });
    }
    const { password_hash, ...userWithOutPassword } = data;
    res.json(userWithOutPassword);
  } catch (error: any) {
    const fs = require('fs');
    fs.appendFileSync('debug.log', `[${new Date().toISOString()}] Profile Error: ${error.message}\n`);
    console.error('Profile Update Catch Error:', error);
    res.status(500).json({ error: error.message || 'Failed to update profile' });
  }
});

router.put('/change-password', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?.userId;

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', userId)
      .single();

    if (fetchError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Incorrect current password' });
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: newHash })
      .eq('id', userId);

    if (updateError) throw updateError;
    res.json({ message: 'Password updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
