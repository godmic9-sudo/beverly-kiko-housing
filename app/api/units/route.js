import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Public: only what a tenant needs to pick a unit. Tenant names/phones are NOT exposed here.
export async function GET() {
  try {
    const { rows } = await query(
      'SELECT id, name, location, price FROM units ORDER BY created_at, id'
    );
    return NextResponse.json({ units: rows });
  } catch (err) {
    console.error('GET /api/units failed:', err);
    return NextResponse.json({ message: 'Could not load units.' }, { status: 500 });
  }
}
