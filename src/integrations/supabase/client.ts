
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';

const SUPABASE_URL = "https://txisyzhqemzxzumxywxr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4aXN5emhxZW16eHp1bXh5d3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNjA1NzIsImV4cCI6MjA2OTYzNjU3Mn0.rdLV_D3rowm0Pd8rrQBxeFJIhO4UjhpQg19Ni_V4lTQ";
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
