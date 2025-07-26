// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';

const SUPABASE_URL = "https://yqkbmpyanyeetyjdjxhr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlxa2JtcHlhbnllZXR5amRqeGhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNDQ4OTYsImV4cCI6MjA2ODkyMDg5Nn0.6GOLlfvfqRs0u-mBOnV7hRvywuHnH7gI4qaYwX1D7VE";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: AsyncStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
