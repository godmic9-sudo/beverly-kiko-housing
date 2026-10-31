import { NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@nile-squad/nylonpay-ts';
import { query } from '../../../lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Nylon Pay calls this when a payment changes status, even if the tenant closed the page.
// Setup: Nylon dashboard > Webhooks > URL = https://YOUR-DOMAIN/api/nylon-webhook
// then copy the signing secret into NYLONPAY_WEBHOOK_SECRET.

export async function POST(req) {
  const secret = process.env.NYLONPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ message: 'Webhook secret not configured.' }, { status: 500 });

  const raw = await req.text(); // must be the exact raw body for signature verification
  const signature = req.headers.get('x-nylon-signature') || '';

  let valid = false;
  try {
    valid = verifyWebhookSignature({ payload: raw, signature, secret });
  } catch {
    valid = false;
  }
  if (!valid) return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });

  let evt;
  try { evt = JSON.parse(raw); } catch { return NextResponse.json({ message: 'Bad JSON' }, { status: 400 }); }

  const reference = evt?.payload?.reference;
  const status = evt?.payload?.status;
  if (!reference) return NextResponse.json({ ok: true });

  if (status === 'successful') {
    await query(
      `UPDATE payments SET status = 'successful', paid_at = COALESCE(paid_at, now()), updated_at = now()
        WHERE reference = $1`,
      [reference]
    );
  } else if (status === 'failed' || status === 'cancelled') {
    await query(
      `UPDATE payments SET status = 'failed', failure_reason = $2, updated_at = now()
        WHERE reference = $1 AND status <> 'successful'`,
      [reference, status === 'cancelled' ? 'Cancelled' : 'Declined or failed']
    );
  }
  return NextResponse.json({ ok: true });
}
