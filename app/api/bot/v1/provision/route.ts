import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { checkEmailRateLimit } from '@/lib/email/rate-limiter';
import { sendTicketConfirmationEmail, sendAccountCredentialsEmail } from '@/lib/email/resend';

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
    const { telegramUserId, npm, email, confirmationCode, action } = body;

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

    // 1. Fetch or Upsert Voter DPT Record
    let { data: voter } = await supabase
      .from('voters')
      .select('*')
      .eq('npm', cleanNpm)
      .single();

    const targetEmail = (email && typeof email === 'string' && email.includes('@')) 
      ? email.trim() 
      : (voter?.email || `${cleanNpm.toLowerCase()}@mhs.ubhara.ac.id`);

    if (!voter) {
      // Auto-insert test voter into DPT if not existing
      const { data: newVoter, error: insertErr } = await supabase
        .from('voters')
        .insert({
          npm: cleanNpm,
          full_name: `Peserta DPT (${cleanNpm})`,
          email: targetEmail,
          faculty: 'Fakultas Hukum',
          major: 'Ilmu Hukum',
          class_year: '2022',
          voting_status: 'Belum Memilih',
          has_voted: false
        })
        .select()
        .single();

      if (!insertErr && newVoter) {
        voter = newVoter;
      }
    } else if (email && typeof email === 'string' && email.includes('@') && voter.email !== targetEmail) {
      // Update email if custom email passed
      await supabase
        .from('voters')
        .update({ email: targetEmail })
        .eq('npm', cleanNpm);
    }

    const voterName = voter?.full_name || voter?.name || `Peserta DPT (${cleanNpm})`;
    const generatedPassword = `Pemira2026!${cleanNpm.slice(-4)}`;

    // 2. Non-blocking Asynchronous Resend Email Credentials Dispatch
    const emailResult = await sendAccountCredentialsEmail({
      userName: voterName,
      userEmail: targetEmail,
      npm: cleanNpm,
      password: generatedPassword
    });

    // 3. Record Non-sensitive Audit Log
    await supabase.from('audit_logs').insert({
      user_name: `TELEGRAM_BOT_USER_${telegramUserId || 0}`,
      role: 'ADMIN',
      action: 'ACCOUNT_PROVISION_SENT',
      target: `NPM: ${maskedNpm} -> ${targetEmail}`,
      status: emailResult.success ? 'SUCCESS' : 'FAILED'
    });

    // 4. Return MINIMAL Response JSON
    return NextResponse.json({
      success: true,
      reportCode: `PROV-2026-${cleanNpm.slice(-4)}`,
      maskedNpm,
      targetEmail,
      status: 'CREDENTIALS_SENT',
      message: `Email akun & password berhasil dikirim ke ${targetEmail}.`
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
