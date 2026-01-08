import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        'Missing Supabase credentials. Using mock authentication.\n' +
        'To enable real authentication:\n' +
        '1. Create a Supabase project at https://supabase.com\n' +
        '2. Add these to .env.local:\n' +
        '   VITE_SUPABASE_URL=your_url\n' +
        '   VITE_SUPABASE_ANON_KEY=your_key'
    );
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);

export default supabase;
