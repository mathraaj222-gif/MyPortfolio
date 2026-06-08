import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';

dotenv.config();

const supabaseURL =process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseURL || !supabaseAnonKey) {
    throw new Error(
        "Critical Database Setup Failed. SUPABASE_URL, and SUPABASE_ANON_KEY must be set in the environment variables."
    );
}

export const db = createClient(supabaseURL, supabaseAnonKey);