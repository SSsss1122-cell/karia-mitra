import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tkdegywzonhbzdjfxosq.supabase.co"
const supabaseAnonKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZGVneXd6b25oYnpkamZ4b3NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNzc0OTQsImV4cCI6MjA3Njk1MzQ5NH0.8M93KhrKWyxSacDwpebVElk6v3syDJCJElSs6O3NBoI"

// ✅ Handle missing env
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables are not set.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
