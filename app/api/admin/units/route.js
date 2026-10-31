import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { requireAdmin } from '../../../../auth';
import { query } from '../../../../lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { rows } = await query(
    'SELECT id, name, location, price, tenant, occupied FROM units ORDER BY created_at, id'
  );
  return NextResponse.json({ units: rows });
}

export async function POST(req) {
  if (!(await requireAdmin())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ message: 'Invalid body' }, { status: 400 }); }

  const name = String(body?.name || '').trim().slice(0, 120);
  const location = String(body?.location || '').trim().slice(0, 120) || 'Kampala, Uganda';
  const price = Number(body?.price);
  const tenantRaw = String(body?.tenant || '').trim().slice(0, 160);
  const tenant = tenantRaw || 'N/A';

  if (!name) return NextResponse.json({ message: 'Unit title is required.' }, { status: 400 });
  if (!Number.isInteger(price) || price < 500) {
    return NextResponse.json({ message: 'Monthly rent must be a whole number of at least UGX 500.' }, { status: 400 });
  }

  const occupied = tenant !== 'N/A';
  const { rows } = await query(
    `INSERT INTO units (id, name, location, price, tenant, occupied)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, name, location, price, tenant, occupied`,
    [randomUUID(), name, location, price, tenant, occupied]
  );
  return NextResponse.json({ unit: rows[0] }, { status: 201 });
}
