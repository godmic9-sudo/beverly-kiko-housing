import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { createNylonPay, parseError } from '@nile-squad/nylonpay-ts';
import { query } from '../../../lib/db';
import { MONTHS } from '../../../lib/months';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Env vars: NYLONPAY_API_KEY, NYLONPAY_API_SECRET (npk_test_/nps_test_ first, live later)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function bad(message, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function POST(req) {
  const apiKey = process.env.NYLONPAY_API_KEY;
  const apiSecret = process.env.NYLONPAY_API_SECRET;
  if (!apiKey || !apiSecret) {
    return bad('Missing environment variables: NYLONPAY_API_KEY or NYLONPAY_API_SECRET.', 500);
  }

  let body;
  try { body = await req.json(); } catch { return bad('Invalid request body.'); }

  const unitId = String(body?.unitId || '');
  const name = String(body?.name || '').trim().slice(0, 100);
  const email = String(body?.email || '').trim().toLowerCase().slice(0, 160);
  const network = String(body?.network || '').slice(0, 40);
  const months = Array.isArray(body?.months) ? [...new Set(body.months.map(String))] : [];

  if (name.length < 2) return bad('Please enter your full name.');
  if (!EMAIL_RE.test(email)) return bad('Please enter a valid email address.');
  if (months.length === 0 || months.some((m) => !MONTHS.includes(m))) return bad('Please select valid month(s).');

  // Normalise phone to +256XXXXXXXXX
  let cleanPhone = String(body?.phone || '').replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) cleanPhone = '256' + cleanPhone.slice(1);
  if (cleanPhone && !cleanPhone.startsWith('256')) cleanPhone = '256' + cleanPhone;
  if (cleanPhone.length !== 12) return bad('Please enter a valid Uganda phone number, e.g. 0770000000.');
  cleanPhone = '+' + cleanPhone;

  // The amount is ALWAYS computed here from the database price. Nothing the browser sends can change it.
  const unitRes = await query('SELECT id, name, price FROM units WHERE id = $1', [unitId]);
  const unit = unitRes.rows[0];
  if (!unit) return bad('That unit no longer exists. Please refresh the page.', 404);
  const amount = unit.price * months.length;

  const reference = randomUUID();

  // Record the attempt BEFORE asking for money, so a payment can never exist without a record
  await query(
    `INSERT INTO payments (reference, unit_id, unit_name, tenant_name, tenant_email, tenant_phone,
                           network, months, amount, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pending')`,
    [reference, unit.id, unit.name, name, email, cleanPhone, network, months, amount]
  );

  // The SDK does NOT throw when the server rejects a payment at initiation; this hook captures that.
  let initError = null;
  const nylonpay = createNylonPay({
    apiKey,
    apiSecret,
    hooks: {
      afterCollect: {
        fn: (result) => { if (!result.isOk) initError = String(result.error); },
        onError: (e) => console.error('afterCollect hook failed:', e),
      },
    },
  });

  async function markFailed(reason) {
    await query(
      `UPDATE payments SET status = 'failed', failure_reason = $2, updated_at = now() WHERE reference = $1`,
      [reference, String(reason).slice(0, 300)]
    );
  }

  try {
    await nylonpay.collectPayment({
      amount,
      currency: 'UGX',
      customer: { name, phoneNumber: cleanPhone, email },
      description: `Rent ${unit.name} - ${months.join(', ')}`.slice(0, 100),
      reference,
      metadata: { unitId: unit.id, unit: unit.name, months: months.join(', ') },
      tags: ['rent'],
    });

    if (initError) {
      const msg = parseError(initError).message;
      console.error('Nylon Pay initiation failed:', initError);
      await markFailed(msg);
      return bad(`Could not start payment: ${msg}`, 502);
    }

    return NextResponse.json({ success: true, reference, message: 'Payment prompt sent. Check your phone.' });
  } catch (error) {
    // Thrown only for invalid input (e.g. amount below the minimum)
    console.error('Nylon Pay collect error:', error);
    await markFailed(error?.message || 'Could not start payment.');
    return bad(error?.message || 'Could not start payment.');
  }
}
