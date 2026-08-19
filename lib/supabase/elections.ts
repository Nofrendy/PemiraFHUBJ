import { createClient } from './client';

export interface ElectionRecord {
  id: string;
  name: string;
  year: string;
  status: 'DRAFT' | 'SCHEDULED' | 'OPEN' | 'PAUSED' | 'CLOSED';
  start_time: string;
  end_time: string;
  total_voters: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetch current election operational status
 */
export async function getElectionStatus(): Promise<ElectionRecord | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('elections')
    .select('*')
    .limit(1)
    .single();

  if (error || !data) {
    console.error('Error fetching election status:', error);
    return {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'PEMIRA BEM FH UBHARA 2026',
      year: '2026',
      status: 'OPEN',
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
      total_voters: 0
    };
  }

  return data as ElectionRecord;
}
