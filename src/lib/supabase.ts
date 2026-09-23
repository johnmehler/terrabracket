import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

export const supabaseConfigured =
	PUBLIC_SUPABASE_ANON_KEY.length > 0 && !PUBLIC_SUPABASE_ANON_KEY.startsWith('PASTE');

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
