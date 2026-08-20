import { createClient } from './client';

export interface CandidateRecord {
  id: string;
  number: string;
  name: string;
  chairman: string;
  vice_chairman: string;
  photo_url: string;
  visi: string;
  misi: string[];
  status: 'Active' | 'Disabled';
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetch all active candidate paslons for Public Web
 */
export async function getActiveCandidates(): Promise<CandidateRecord[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .eq('status', 'Active')
    .order('number', { ascending: true });

  if (error || !data) {
    console.error('Error fetching active candidates:', error);
    return [];
  }

  return data.map((c) => ({
    ...c,
    misi: Array.isArray(c.misi) ? c.misi : typeof c.misi === 'string' ? JSON.parse(c.misi) : []
  })) as CandidateRecord[];
}

/**
 * Fetch candidate details by ID or Number
 */
export async function getCandidateByNumber(number: string): Promise<CandidateRecord | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .eq('number', number)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    ...data,
    misi: Array.isArray(data.misi) ? data.misi : typeof data.misi === 'string' ? JSON.parse(data.misi) : []
  } as CandidateRecord;
}
