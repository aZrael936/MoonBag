import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vakmtpsykwoqidumvbvo.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZha210cHN5a3dvcWlkdW12YnZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2NTk1NzIsImV4cCI6MjA1MjIzNTU3Mn0.XKEnjASaBDXlKkn0cW5iQ1Fsak2gXTQSmBr--k9srOc";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
