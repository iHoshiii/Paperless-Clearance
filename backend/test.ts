import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { supabase } from './src/lib/supabase';

async function createAdmin() {
    console.log('--- ADMIN CREATION TOOL ---');

    const email = 'admin@test.com';
    const password = 'password123';

    try {
        // 1. Delete existing
        await supabase.from('users').delete().eq('email', email);
        console.log('Cleaned up existing user...');

        // 2. Hash password using your local library
        const passwordHash = await bcrypt.hash(password, 12);

        // 3. Insert
        const { error } = await supabase.from('users').insert({
            email,
            password_hash: passwordHash,
            first_name: 'System',
            last_name: 'Administrator',
            role: 'admin', // lowercase to match your frontend
            is_active: true
        });

        if (error) throw error;

        console.log('SUCCESS!');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('---------------------------');
    } catch (err) {
        console.error('ERROR:', err);
    }
    process.exit();
}

createAdmin();
