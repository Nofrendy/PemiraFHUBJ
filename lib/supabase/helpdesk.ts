import { createClient } from './client';
import { getCurrentUserVoterRecord } from './voters';
import { sendTicketConfirmationEmail } from '../email/resend';

export interface HelpReportRecord {
  id: string;
  report_code: string;
  user_name: string;
  npm: string;
  category: 'Kendala Login' | 'Sistem Error' | 'Informasi Paslon' | 'Lainnya';
  subject: string;
  message: string;
  status: 'OPEN' | 'IN PROGRESS' | 'RESOLVED' | 'CLOSED';
  admin_response: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateHelpReportInput {
  user_name: string;
  npm: string;
  category: 'Kendala Login' | 'Sistem Error' | 'Informasi Paslon' | 'Lainnya';
  subject: string;
  message: string;
}

/**
 * Submit new student helpdesk report
 */
export async function createHelpReport(input: CreateHelpReportInput): Promise<{ success: boolean; message: string; report_code?: string }> {
  const supabase = createClient();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const reportCode = `HLP-2026-${randomSuffix}`;

  const payload = {
    report_code: reportCode,
    user_name: input.user_name.trim(),
    npm: input.npm.trim(),
    category: input.category,
    subject: input.subject.trim(),
    message: input.message.trim(),
    status: 'OPEN'
  };

  const { data, error } = await supabase
    .from('help_reports')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('Error creating help report:', error);
    return { success: false, message: error.message };
  }

  // Non-blocking Asynchronous Email Dispatch (Does NOT block or rollback database transaction!)
  sendTicketConfirmationEmail({
    reportCode: data.report_code,
    userName: data.user_name,
    npm: data.npm,
    subject: data.subject
  }).catch((err) => {
    console.warn('[Non-Blocking Email Error] Suppressed confirmation email failure:', err);
  });

  return {
    success: true,
    message: 'Laporan pengaduan berhasil dikirim ke Panitia KPU.',
    report_code: data.report_code
  };
}

/**
 * Fetch help reports created by current logged-in voter
 */
export async function getVoterHelpReports(): Promise<HelpReportRecord[]> {
  const supabase = createClient();
  const voter = await getCurrentUserVoterRecord();

  if (!voter) return [];

  const { data, error } = await supabase
    .from('help_reports')
    .select('*')
    .eq('npm', voter.npm)
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Error fetching voter help reports:', error);
    return [];
  }

  return data as HelpReportRecord[];
}

/**
 * Fetch specific help report by tracking code
 */
export async function getHelpReportByCode(code: string): Promise<HelpReportRecord | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('help_reports')
    .select('*')
    .eq('report_code', code.trim())
    .single();

  if (error || !data) {
    return null;
  }

  return data as HelpReportRecord;
}
