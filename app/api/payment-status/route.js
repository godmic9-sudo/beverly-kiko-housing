import { NextResponse } from 'next/server';
import { createNylonPay } from '@nile-squad/nylonpay-ts';
import { query } from '../../../lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/payment-status?reference=...
// -> { status: 'pending' | 'success' | 'failed', receipt?: {...} }
// Nylon statuses: pending, processing, on_hold, successful, failed, cancelled

function receiptFrom(p) {
  return {
    txId: 'TXN-' + p.reference.slice(0, 8).toUpperCase(),
    tenantName: p.tenant_name,
    unitName: p.unit_name,
    months: p.months,
    phone: p.tenant_phone,
    network: p.network,
    total: p.amount,
    date: new Date(p.paid_at || p.updated_at).toLocaleString('en-UG', { timeZone: 'Africa/Kampala' }),
  };
}

export async function GET(req) {
  const reference = new URL(req.url).searchParams.get('reference');
  if (!reference) return NextResponse.json({ status: 'error', message: 'reference is required' }, { status: 400 });

  const found = await query('SELECT * FROM payments WHERE reference = $1', [reference]);
  let p = found.rows[0];
  if (!p) return NextResponse.json({ status: 'error', message: 'Unknown payment.' }, { status: 404 });

  // Already settled (by an earlier poll or by the webhook)
  if (p.status === 'successful') return NextResponse.json({ status: 'success', receipt: receiptFrom(p) });
  if (p.status === 'failed') return NextResponse.json({ status: 'failed', message: p.failure_reason || undefined });

  const apiKey = process.env.NYLONPAY_API_KEY;
  const apiSecret = process.env.NYLONPAY_API_SECRET;
  if (!apiKey || !apiSecret) {
    return NextResponse.json({ status: 'error', message: 'Missing Nylon Pay environment variables.' }, { status: 500 });
  }

  try {
    const nylonpay = createNylonPay({ apiKey, apiSecret });
    const result = await nylonpay.getStatus({ reference });
    if (!result.isOk) return NextResponse.json({ status: 'pending' });

    const raw = String(result.value.status || '').toLowerCase();
    if (raw === 'successful') {
      const upd = await query(
        `UPDATE payments SET status = 'successful', paid_at = COALESCE(paid_at, now()), updated_at = now()
          WHERE reference = $1 RETURNING *`,
        [reference]
      );
      return NextResponse.json({ status: 'success', receipt: receiptFrom(upd.rows[0]) });
    }
    if (raw === 'failed' || raw === 'cancelled') {
      await query(
        `UPDATE payments SET status = 'failed', failure_reason = $2, updated_at = now()
          WHERE reference = $1 AND status <> 'successful'`,
        [reference, raw === 'cancelled' ? 'Cancelled' : 'Declined or failed']
      );
      return NextResponse.json({ status: 'failed' });
    }
    return NextResponse.json({ status: 'pending', rawStatus: raw });
  } catch (error) {
    console.error('Nylon Pay status error:', error);
    return NextResponse.json({ status: 'pending' });
  }
}
