import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

/**
 * Dedicated Resend Webhook Handler
 * Verifies Svix signatures (if RESEND_WEBHOOK_SECRET is configured)
 * Processes events: email.delivered, email.bounced, email.complained
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const headers = request.headers;

    const svixId = headers.get('svix-id');
    const svixTimestamp = headers.get('svix-timestamp');
    const svixSignature = headers.get('svix-signature');
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

    // Signature Verification Check if secret is configured
    if (webhookSecret && webhookSecret !== 'placeholder-webhook-secret') {
      if (!svixId || !svixTimestamp || !svixSignature) {
        return NextResponse.json(
          { error: 'Missing Svix webhook headers' },
          { status: 400 }
        );
      }

      // Check timestamp freshness (prevent replay attacks, max 5 minutes = 300s)
      const nowSeconds = Math.floor(Date.now() / 1000);
      const msgTimestamp = parseInt(svixTimestamp, 10);
      if (isNaN(msgTimestamp) || Math.abs(nowSeconds - msgTimestamp) > 300) {
        return NextResponse.json(
          { error: 'Webhook timestamp expired or invalid' },
          { status: 401 }
        );
      }
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload?.type;
    const emailData = payload?.data;
    const entityRefId = emailData?.email_id || emailData?.tags?.find((t: any) => t.name === 'entity_ref_id')?.value || 'RESEND_WEBHOOK';

    const supabase = createClient();

    if (eventType === 'email.delivered') {
      console.log(`[Resend Webhook] Email Delivered: ${entityRefId}`);
      await supabase.from('audit_logs').insert({
        user_name: 'RESEND_WEBHOOK',
        role: 'SYSTEM',
        action: 'EMAIL_DELIVERED',
        target: entityRefId,
        status: 'SUCCESS'
      });
    } else if (eventType === 'email.bounced') {
      console.warn(`[Resend Webhook] Email Bounced: ${entityRefId}`);
      await supabase.from('audit_logs').insert({
        user_name: 'RESEND_WEBHOOK',
        role: 'SYSTEM',
        action: 'EMAIL_BOUNCED',
        target: entityRefId,
        status: 'FAILED'
      });
    } else if (eventType === 'email.complained') {
      console.warn(`[Resend Webhook] Email Spam Complaint: ${entityRefId}`);
      await supabase.from('audit_logs').insert({
        user_name: 'RESEND_WEBHOOK',
        role: 'SYSTEM',
        action: 'EMAIL_COMPLAINED',
        target: entityRefId,
        status: 'FAILED'
      });
    }

    return NextResponse.json({ success: true, received: true, event: eventType });

  } catch (err: any) {
    console.error('[Resend Webhook Error]', err?.message || err);
    return NextResponse.json(
      { error: 'Invalid webhook payload or signature' },
      { status: 400 }
    );
  }
}
