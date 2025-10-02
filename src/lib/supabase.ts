
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = '';  
const supabaseAnonKey = '';  // Supabase anon public key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
