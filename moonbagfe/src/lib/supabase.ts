import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wdtwfhazmdizhdiajoyk.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkdHdmaGF6bWRpemhkaWFqb3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwNjA1MTEsImV4cCI6MjA0ODYzNjUxMX0.kR5sIBH4Dk2sjQFuXdnqDBPdPnNzF88FSM_2585XiEE";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
