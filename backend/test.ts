console.log('Test script is running...');
console.log('Current workspace:', process.cwd());
import dotenv from 'dotenv';
dotenv.config();
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Loaded' : 'Not Loaded');
