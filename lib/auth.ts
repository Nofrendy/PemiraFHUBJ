import { createClient } from "./supabase/client";

/**
 * Maps NPM (Nomor Pokok Mahasiswa) to standard institutional email format
 * Example: "202310115001" -> "202310115001@mhs.ubhara.ac.id"
 */
export function npmToEmail(npm: string): string {
  const cleanNpm = npm.trim();
  if (cleanNpm.includes("@")) {
    return cleanNpm;
  }
  return `${cleanNpm}@mhs.ubhara.ac.id`;
}

/**
 * Logs in a Voter using NPM & Password via Supabase Auth
 */
export async function loginVoter(npm: string, password: string) {
  const supabase = createClient();
  const email = npmToEmail(npm);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Logs out current Voter session
 */
export async function logoutVoter() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Gets current active Voter session
 */
export async function getVoterSession() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Gets current authenticated Voter user object
 */
export async function getCurrentVoterUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
