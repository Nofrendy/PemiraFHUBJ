import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cxxhmpmipkiwatemcfkc.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4eGhtcG1pcGtpd2F0ZW1jZmtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMTc1ODcsImV4cCI6MjEwMjY5MzU4N30.agj1zun9goEYONpoa2Pv9Aym8hTv0U1JnVrytAYPF6E";

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
