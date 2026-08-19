import { checkEmailRateLimit, hasProcessedEmailEvent, markEmailEventProcessed } from './rate-limiter';
import { createClient } from '../supabase/client';

export interface TicketConfirmationParams {
  reportCode: string;
  userName: string;
  userEmail?: string;
  npm: string;
  subject: string;
}

export interface TicketReplyNotificationParams {
  reportCode: string;
  userName: string;
  userEmail?: string;
  npm: string;
  subject: string;
  status: string;
  adminResponse: string;
}

/**
 * Send Helpdesk Ticket Confirmation Email (Server-Side Only)
 */
export async function sendTicketConfirmationEmail(params: TicketConfirmationParams): Promise<{ success: boolean; message: string; eventKey: string }> {
  const eventKey = `${params.reportCode}:created`;

  // 1. Idempotency Check
  if (hasProcessedEmailEvent(eventKey)) {
    return { success: true, message: 'Email konfirmasi sudah pernah dikirim (Idempotent Duplicate Ignored).', eventKey };
  }

  // 2. Rate Limiting Check per NPM
  const rateLimit = checkEmailRateLimit(params.npm, 3, 3600000);
  if (!rateLimit.allowed) {
    console.warn(`[Resend RateLimit Exceeded] Discarding email dispatch for NPM ${params.npm}`);
    return { success: false, message: 'Batas maksimum pengiriman email per jam telah terlampaui.', eventKey };
  }

  const resendApiKey = process.env.RESEND_API_KEY;

  try {
    if (!resendApiKey || resendApiKey === 'placeholder-resend-key') {
      // Simulation mode when API key is not configured or in development
      console.log(`[Resend Simulation] Ticket Confirmation Email sent for ${params.reportCode} to ${params.npm}`);
      markEmailEventProcessed(eventKey);
      return { success: true, message: 'Email konfirmasi berhasil dikirim (Simulation).', eventKey };
    }

    const recipient = params.userEmail || `${params.npm.toLowerCase()}@mhs.ubhara.ac.id`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
        'X-Entity-Ref-ID': eventKey
      },
      body: JSON.stringify({
        from: 'KPU Pemira FH UBHARA <pemira@resend.dev>',
        to: [recipient],
        subject: `[KPU Pemira FH UBHARA] Konfirmasi Laporan Bantuan #${params.reportCode}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background-color: #ffffff;">
            <h2 style="color: #8b0000; font-family: Georgia, serif; border-bottom: 2px solid #8b0000; padding-bottom: 12px;">Konfirmasi Tiket Pengaduan Pemira 2026</h2>
            <p>Halo <strong>${params.userName}</strong> (${params.npm}),</p>
            <p>Laporan pengaduan bantuan Anda telah berhasil diterima oleh Panitia KPU Pemira BEM FH UBHARA 2026.</p>
            <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <p style="margin: 0; font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: bold;">Kode Tiket Pengaduan</p>
              <p style="margin: 4px 0 0 0; font-size: 20px; font-family: monospace; font-weight: bold; color: #0f172a;">${params.reportCode}</p>
              <p style="margin: 12px 0 0 0; font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: bold;">Subjek Laporan</p>
              <p style="margin: 4px 0 0 0; font-size: 14px; color: #334155;">${params.subject}</p>
            </div>
            <p>Anda dapat memantau status penanganan dan balasan resmi KPU melalui portal resmi di menu <strong>Pusat Bantuan &gt; Tiket Saya</strong>.</p>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px;">
              Pesan ini dikirimkan secara otomatis oleh Sistem Pemira BEM FH UBHARA 2026. Harap jangan membalas langsung email ini.
            </p>
          </div>
        `
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[Resend Error] API returned status ${res.status}: ${errText}`);
      
      // Log non-blocking audit failure (Zero credentials exposed)
      await logEmailAudit('EMAIL_CONFIRMATION_FAILED', params.reportCode, 'FAILED');
      return { success: false, message: 'Gagal mengirim email via Resend API.', eventKey };
    }

    markEmailEventProcessed(eventKey);
    await logEmailAudit('EMAIL_CONFIRMATION_SENT', params.reportCode, 'SUCCESS');

    return { success: true, message: 'Email konfirmasi berhasil dikirim.', eventKey };

  } catch (err: any) {
    // Non-blocking catch: Email failure NEVER rolls back DB transaction!
    console.error(`[Resend Exception] Async dispatch error for ${params.reportCode}:`, err?.message || err);
    await logEmailAudit('EMAIL_DISPATCH_EXCEPTION', params.reportCode, 'FAILED');
    return { success: false, message: 'Terjadi exception pada pengiriman email non-blocking.', eventKey };
  }
}

/**
 * Send Helpdesk Ticket Reply Notification Email (Server-Side Only)
 */
export async function sendTicketReplyNotificationEmail(params: TicketReplyNotificationParams): Promise<{ success: boolean; message: string; eventKey: string }> {
  const eventKey = `${params.reportCode}:replied:${params.status}`;

  if (hasProcessedEmailEvent(eventKey)) {
    return { success: true, message: 'Notifikasi balasan email sudah pernah dikirim.', eventKey };
  }

  const rateLimit = checkEmailRateLimit(params.npm, 5, 3600000);
  if (!rateLimit.allowed) {
    return { success: false, message: 'Batas maksimum pengiriman notifikasi email terlampaui.', eventKey };
  }

  const resendApiKey = process.env.RESEND_API_KEY;

  try {
    if (!resendApiKey || resendApiKey === 'placeholder-resend-key') {
      console.log(`[Resend Simulation] Ticket Reply Email sent for ${params.reportCode} (${params.status})`);
      markEmailEventProcessed(eventKey);
      return { success: true, message: 'Notifikasi balasan email berhasil dikirim (Simulation).', eventKey };
    }

    const recipient = params.userEmail || `${params.npm.toLowerCase()}@mhs.ubhara.ac.id`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
        'X-Entity-Ref-ID': eventKey
      },
      body: JSON.stringify({
        from: 'KPU Pemira FH UBHARA <pemira@resend.dev>',
        to: [recipient],
        subject: `[KPU Pemira FH UBHARA] Balasan Laporan #${params.reportCode} (${params.status})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background-color: #ffffff;">
            <h2 style="color: #8b0000; font-family: Georgia, serif; border-bottom: 2px solid #8b0000; padding-bottom: 12px;">Update Status Tiket Pengaduan</h2>
            <p>Halo <strong>${params.userName}</strong>,</p>
            <p>Tiket pengaduan Anda <strong>#${params.reportCode}</strong> telah di-update ke status <strong style="color: #2563eb;">${params.status}</strong> oleh Panitia KPU.</p>
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <p style="margin: 0; font-size: 12px; text-transform: uppercase; color: #166534; font-weight: bold;">Tanggapan Resmi Panitia KPU</p>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #14532d; leading-height: 1.6;">${params.adminResponse}</p>
            </div>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px;">
              Pesan ini dikirimkan secara otomatis oleh Sistem Pemira BEM FH UBHARA 2026.
            </p>
          </div>
        `
      })
    });

    if (!res.ok) {
      await logEmailAudit('EMAIL_REPLY_FAILED', params.reportCode, 'FAILED');
      return { success: false, message: 'Gagal mengirim email balasan via Resend API.', eventKey };
    }

    markEmailEventProcessed(eventKey);
    await logEmailAudit('EMAIL_REPLY_SENT', params.reportCode, 'SUCCESS');

    return { success: true, message: 'Email notifikasi balasan berhasil dikirim.', eventKey };

  } catch (err: any) {
    console.error(`[Resend Exception] Async reply dispatch error for ${params.reportCode}:`, err?.message || err);
    await logEmailAudit('EMAIL_DISPATCH_EXCEPTION', params.reportCode, 'FAILED');
    return { success: false, message: 'Terjadi exception pada pengiriman email balasan non-blocking.', eventKey };
  }
}

/**
 * Non-sensitive Audit Logger for Email Dispatches (Zero secrets/credentials logged)
 */
async function logEmailAudit(action: string, targetCode: string, status: 'SUCCESS' | 'FAILED') {
  try {
    const supabase = createClient();
    await supabase.from('audit_logs').insert({
      user_name: 'RESEND_EMAIL_SERVICE',
      role: 'SYSTEM',
      action,
      target: targetCode,
      status
    });
  } catch (err) {
    // Ignore audit log insertion error to maintain strict non-blocking behavior
  }
}
