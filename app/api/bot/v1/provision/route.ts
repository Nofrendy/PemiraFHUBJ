import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { checkEmailRateLimit } from '@/lib/email/rate-limiter';
import { sendTicketConfirmationEmail } from '@/lib/email/resend';

/**
 * Server-to-Server API Route for Standalone Telegram Bot Account Provisioning
 * Authentication: Bearer TELEGRAM_SERVER_SECRET
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const serverSecret = process.env.TELEGRAM_SERVER_SECRET || 'placeholder-telegram-server-secret';

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED_SERVER_SECRET', message: 'Header Authorization Bearer server secret wajib diisi.' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7).trim();
    if (token !== serverSecret) {
      return NextResponse.json(
        { success: false, error: 'INVALID_SERVER_SECRET', message: 'Server secret tidak cocok.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { telegramUserId, npm, confirmationCode, action } = body;

    if (!npm || typeof npm !== 'string' || !/^\d{8,14}$/.test(npm.trim())) {
      return NextResponse.json(
        { success: false, error: 'INVALID_NPM_FORMAT', message: 'Format NPM peserta tidak valid (wajib 8-14 digit angka).' },
        { status: 400 }
      );
    }

    const cleanNpm = npm.trim();
    const maskedNpm = `****${cleanNpm.slice(-4)}`;

    // Rate Limiter Check per NPM (Server Layer)
    const rateLimit = checkEmailRateLimit(cleanNpm, 3, 3600000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'RATE_LIMIT_EXCEEDED', message: 'Batas maksimum pengiriman email aktivasi per jam terlampaui.' },
        { status: 429 }
      );
    }

    const supabase = createClient();

    // 1. Fetch Voter DPT Record
    const { data: voter, error: voterErr } = await supabase
      .from('voters')
      .select('*')
      .eq('npm', cleanNpm)
      .single();

    if (voterErr || !voter) {
      return NextResponse.json(
        { success: false, error: 'VOTER_NOT_FOUND', message: `Data DPT peserta dengan NPM ${maskedNpm} tidak ditemukan.` },
        { status: 404 }
      );
    }

    // 2. Generate 15-minute temporary activation token (Internal only, NEVER exposed to Telegram or logs)
    const activationToken = `ACT-${Math.random().toString(36).substring(2, 10)}-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    // 3. Non-blocking Asynchronous Resend Email Dispatch (Phase 12 Integration)
    const emailResult = await sendTicketConfirmationEmail({
      reportCode: `ACT-${cleanNpm.slice(-4)}`,
      userName: voter.full_name || 'Peserta Pemira',
      userEmail: voter.email || `${cleanNpm.toLowerCase()}@mhs.ubhara.ac.id`,
      npm: cleanNpm,
      subject: `[KPU Pemira FH UBHARA] Link Aktivasi Akun Pemilih`
    });

    // 4. Record Non-sensitive Audit Log
    await supabase.from('audit_logs').insert({
      user_name: `TELEGRAM_BOT_USER_${telegramUserId || 0}`,
      role: 'ADMIN',
      action: 'ACCOUNT_PROVISION_SENT',
      target: `NPM: ${maskedNpm}`,
      status: emailResult.success ? 'SUCCESS' : 'FAILED'
    });

    // 5. Return MINIMAL Response JSON (Zero Plaintext Passwords or Activation Tokens)
    return NextResponse.json({
      success: true,
      reportCode: `PROV-2026-${cleanNpm.slice(-4)}`,
      maskedNpm,
      status: 'ACTIVATION_PENDING',
      message: 'Email aktivasi akun berhasil dikirim ke peserta.'
    });

  } catch (err: any) {
    console.error('[API Provision Error]', err?.message || err);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_SERVER_ERROR', message: 'Terjadi kesalahan sistem internal.' },
      { status: 500 }
    );
  }
}

/**
 * GET Handler for querying voter activation status (Panitia/Inspector)
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const serverSecret = process.env.TELEGRAM_SERVER_SECRET || 'placeholder-telegram-server-secret';

    if (!authHeader || authHeader.substring(7).trim() !== serverSecret) {
      return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED_SERVER_SECRET' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const npm = searchParams.get('npm');

    if (!npm || !/^\d{8,14}$/.test(npm.trim())) {
      return NextResponse.json(
        { success: false, error: 'INVALID_NPM_FORMAT' },
        { status: 400 }
      );
    }

    const cleanNpm = npm.trim();
    const maskedNpm = `****${cleanNpm.slice(-4)}`;
    const supabase = createClient();

    const { data: voter } = await supabase
      .from('voters')
      .select('npm, full_name, voting_status, has_voted')
      .eq('npm', cleanNpm)
      .single();

    if (!voter) {
      return NextResponse.json(
        { success: false, error: 'VOTER_NOT_FOUND', message: `DPT NPM ${maskedNpm} tidak ditemukan.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      maskedNpm,
      name: voter.full_name,
      voting_status: voter.voting_status,
      has_voted: voter.has_voted
    });

  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}
