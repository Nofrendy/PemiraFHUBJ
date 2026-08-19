import { createClient } from './client';
import { getElectionStatus, ElectionRecord } from './elections';

export interface CandidateVoteAggregate {
  candidate_id: string;
  number: string;
  name: string;
  chairman: string;
  vice_chairman: string;
  status: string;
  total_votes: number;
  percentage: number;
}

export interface LiveCountResponse {
  candidates: CandidateVoteAggregate[];
  election: ElectionRecord | null;
  totalVotesCast: number;
  totalVotersTarget: number;
  turnoutPercentage: number;
  lastUpdated: string;
}

/**
 * Fetch initial & polling live count data from candidate_vote_counts aggregate view
 */
export async function getLiveCountData(): Promise<LiveCountResponse> {
  const supabase = createClient();

  const [cRes, eData] = await Promise.all([
    supabase
      .from('candidate_vote_counts')
      .select('*')
      .eq('status', 'Active')
      .order('number', { ascending: true }),
    getElectionStatus()
  ]);

  const rawCandidates = cRes.data || [];
  const totalVotesCast = rawCandidates.reduce((sum, item) => sum + (item.total_votes || 0), 0);
  const totalVotersTarget = eData?.total_voters || 0;
  const turnoutPercentage = totalVotersTarget > 0 ? Number(((totalVotesCast / totalVotersTarget) * 100).toFixed(2)) : 0;

  const candidates: CandidateVoteAggregate[] = rawCandidates.map((item) => {
    const votes = item.total_votes || 0;
    const pct = totalVotesCast > 0 ? Number(((votes / totalVotesCast) * 100).toFixed(1)) : 0;
    return {
      candidate_id: item.candidate_id,
      number: item.number,
      name: item.name,
      chairman: item.chairman,
      vice_chairman: item.vice_chairman,
      status: item.status,
      total_votes: votes,
      percentage: pct
    };
  });

  return {
    candidates,
    election: eData,
    totalVotesCast,
    totalVotersTarget,
    turnoutPercentage,
    lastUpdated: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB'
  };
}

/**
 * Subscribe to public status updates via Supabase Realtime channel (public.elections table ONLY)
 * ZERO subscription to public.votes or public.voters tables to preserve 100% ballot & DPT privacy
 */
export function subscribeToLiveCount(
  onUpdate: () => void,
  onStatusChange?: (status: 'SUBSCRIBED' | 'CLOSED' | 'CHANNEL_ERROR') => void
) {
  const supabase = createClient();

  const channel = supabase
    .channel('live-count-status-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'elections' },
      () => {
        onUpdate();
      }
    )
    .subscribe((status) => {
      if (onStatusChange) {
        if (status === 'SUBSCRIBED') onStatusChange('SUBSCRIBED');
        else if (status === 'CLOSED') onStatusChange('CLOSED');
        else if (status === 'CHANNEL_ERROR') onStatusChange('CHANNEL_ERROR');
      }
    });

  return () => {
    supabase.removeChannel(channel);
  };
}
