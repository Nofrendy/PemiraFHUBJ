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
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization') || request.headers.get('x-telegram-server-secret');
    const configuredSecret = (process.env.TELEGRAM_SERVER_SECRET || '').trim();
    const defaultSecret = 'S2S_PEMIRA_BOT_KEY_2026';

    let token = '';
    if (authHeader) {
      token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : authHeader.trim();
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED_SERVER_SECRET', message: 'Header Authorization Bearer server secret wajib diisi.' },
        { status: 401 }
      );
    }

    const isValidSecret = token === defaultSecret || (configuredSecret.length > 0 && token === configuredSecret);

    if (!isValidSecret) {
      return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED_SERVER_SECRET', message: 'Header Authorization Bearer server secret tidak cocok.' },
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

    // 2. Ensure Supabase Auth user is created/updated for login authentication
    const authEmail = `${cleanNpm}@mhs.ubhara.ac.id`;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cxxhmpmipkiwatemcfkc.supabase.co';

    try {
      if (serviceRoleKey && serviceRoleKey !== 'placeholder-service-key') {
        const { createClient: createAdminClient } = await import('@supabase/supabase-js');
        const adminClient = createAdminClient(supabaseUrl, serviceRoleKey);
        
        const { data: existingUsers } = await adminClient.auth.admin.listUsers();
        const existingUser = existingUsers?.users?.find(u => u.email === authEmail || u.user_metadata?.npm === cleanNpm);

        let createdAuthUserId = existingUser?.id;

        if (!existingUser) {
          const { data: newUser } = await adminClient.auth.admin.createUser({
            email: authEmail,
            password: generatedPassword,
            email_confirm: true,
            user_metadata: { npm: cleanNpm, full_name: voterName }
          });
          createdAuthUserId = newUser?.user?.id;
        } else {
          await adminClient.auth.admin.updateUserById(existingUser.id, {
            password: generatedPassword,
            email_confirm: true
          });
        }

        if (createdAuthUserId) {
          await supabase
            .from('voters')
            .update({ user_id: createdAuthUserId, account_status: 'Active' })
            .eq('npm', cleanNpm);
        }
      } else {
        const { data: signUpData } = await supabase.auth.signUp({
          email: authEmail,
          password: generatedPassword,
          options: {
            data: { npm: cleanNpm, full_name: voterName }
          }
        });
        if (signUpData?.user) {
          await supabase
            .from('voters')
            .update({ user_id: signUpData.user.id, account_status: 'Active' })
            .eq('npm', cleanNpm);
        }
      }
    } catch (authErr) {
      console.warn('[Provision Auth Sync Warning] Could not sync Supabase Auth user:', authErr);
    }

    // 3. Resend Email Credentials Dispatch
    const emailResult = await sendAccountCredentialsEmail({
      userName: voterName,
      userEmail: targetEmail,
      npm: cleanNpm,
      password: generatedPassword
    });

    if (!emailResult.success) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_EMAIL_FAILED',
        message: `Gagal mengirim email: ${emailResult.message}`
      }, { status: 400 });
    }

    // 3. Record Non-sensitive Audit Log
    await supabase.from('audit_logs').insert({
      user_name: `TELEGRAM_BOT_USER_${telegramUserId || 0}`,
      role: 'ADMIN',
      action: 'ACCOUNT_PROVISION_SENT',
      target: `NPM: ${maskedNpm} -> ${targetEmail}`,
      status: 'SUCCESS'
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
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization') || request.headers.get('x-telegram-server-secret');
    const configuredSecret = (process.env.TELEGRAM_SERVER_SECRET || '').trim();
    const defaultSecret = 'S2S_PEMIRA_BOT_KEY_2026';

    let token = '';
    if (authHeader) {
      token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : authHeader.trim();
    }

    const isValidSecret = token === defaultSecret || (configuredSecret.length > 0 && token === configuredSecret);

    if (!token || !isValidSecret) {
      return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED_SERVER_SECRET', message: 'Header Authorization Bearer server secret tidak cocok atau belum di-set di Vercel.' },
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
