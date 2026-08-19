import { createClient } from './client';
import { getCurrentUserVoterRecord } from './voters';

export interface SubmitVoteResult {
  success: boolean;
  message: string;
  voted_at?: string;
  code?: string;
}

/**
 * Submit anonymous vote for a candidate via atomic RPC submit_anonymous_vote
 */
export async function submitVote(candidateId: string): Promise<SubmitVoteResult> {
  const supabase = createClient();
  
  // 1. Resolve current logged in voter
  const voter = await getCurrentUserVoterRecord();
  if (!voter) {
    return {
      success: false,
      message: 'Sesi Anda tidak valid atau data DPT NPM Anda tidak ditemukan.',
      code: 'VOTER_NOT_FOUND'
    };
  }

  // 2. Pre-flight checks
  if (voter.account_status !== 'Active') {
    return {
      success: false,
      message: 'Akun pemilih Anda dalam status tidak aktif. Silakan hubungi Panitia KPU.',
      code: 'ACCOUNT_DISABLED'
    };
  }

  if (voter.has_voted || voter.voting_status === 'Sudah Memilih') {
    return {
      success: false,
      message: 'Anda sudah menggunakan hak pilih sebelumnya pada Pemira ini.',
      code: 'ALREADY_VOTED'
    };
  }

  // 3. Execute Atomic RPC Function
  try {
    const { data, error } = await supabase.rpc('submit_anonymous_vote', {
      p_voter_npm: voter.npm,
      p_candidate_id: candidateId
    });

    if (error) {
      const msg = error.message || '';
      if (msg.includes('ALREADY_VOTED')) {
        return { success: false, message: 'Anda telah menggunakan hak pilih sebelumnya.', code: 'ALREADY_VOTED' };
      }
      if (msg.includes('ACCOUNT_DISABLED')) {
        return { success: false, message: 'Akun pemilih Anda tidak aktif.', code: 'ACCOUNT_DISABLED' };
      }
      if (msg.includes('ELECTION_NOT_OPEN')) {
        return { success: false, message: 'Pemilihan saat ini tidak dalam fase OPEN (buka).', code: 'ELECTION_NOT_OPEN' };
      }
      if (msg.includes('INVALID_CANDIDATE')) {
        return { success: false, message: 'Pasangan calon yang dipilih tidak valid atau tidak aktif.', code: 'INVALID_CANDIDATE' };
      }
      return { success: false, message: 'Gagal mengirim suara: ' + msg, code: 'RPC_ERROR' };
    }

    return {
      success: true,
      message: data?.message || 'Suara Anda berhasil disimpan secara rahasia.',
      voted_at: data?.voted_at || new Date().toISOString()
    };
  } catch (err) {
    return {
      success: false,
      message: 'Terjadi kesalahan sistem: ' + (err as Error).message,
      code: 'SYSTEM_ERROR'
    };
  }
}
