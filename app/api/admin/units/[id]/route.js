import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../../../auth';
import { query } from '../../../../../lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(_req, { params }) {
  if (!(await requireAdmin())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  await query('DELETE FROM units WHERE id = $1', [params.id]);
  return NextResponse.json({ ok: true });
}
