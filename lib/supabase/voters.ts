import { createClient } from './client';

export interface VoterRecord {
  id: string;
  user_id: string | null;
  npm: string;
  name: string;
  email: string;
  angkatan: string;
  prodi: string;
  voting_status: 'Belum Memilih' | 'Sudah Memilih';
  has_voted: boolean;
  voted_at: string | null;
  account_status: 'Active' | 'Pending' | 'Disabled';
  created_at: string;
  updated_at: string;
}

/**
 * Fetch DPT voter record for the specified NPM
 */
export async function getVoterByNpm(npm: string): Promise<VoterRecord | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('voters')
    .select('*')
    .eq('npm', npm)
    .maybeSingle();

  if (error || !data) {
    return null;
  }
  return data as VoterRecord;
}

/**
 * Fetch voter participation status for current logged in user
 */
export async function getCurrentUserVoterRecord(): Promise<VoterRecord | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Try finding voter by user_id
  const { data, error } = await supabase
    .from('voters')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!error && data) {
    return data as VoterRecord;
  }

  // Fallback try finding voter by email or NPM metadata
  const npm = user.user_metadata?.npm;
  if (npm) {
    return getVoterByNpm(npm);
  }

  return null;
}
