import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../../auth';
import { query } from '../../../../lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { rows } = await query(
    `SELECT reference, unit_name AS "unitName", tenant_name AS "tenantName",
            tenant_email AS "tenantEmail", tenant_phone AS "tenantPhone", network,
            months, amount, status, failure_reason AS "failureReason",
            created_at AS "createdAt", paid_at AS "paidAt"
       FROM payments ORDER BY created_at DESC LIMIT 200`
  );
  return NextResponse.json({ payments: rows });
}
