import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Open /api/health on your site to see what is missing. It never reveals secret values.
// You can delete this file once everything works.

function hint(err) {
  const m = `${err?.code || ''} ${err?.message || ''}`;
  if (/DATABASE_URL is not set/.test(m)) return 'DATABASE_URL is missing. Add it in Vercel > Settings > Environment Variables (for Production), then redeploy.';
  if (/Invalid URL/.test(m)) return 'DATABASE_URL is not a valid URL. If your password has special characters (@ / : # ?) URL-encode them, e.g. @ becomes %40.';
  if (/Tenant or user not found/i.test(m)) return 'Supabase says the user is wrong. Use the exact "Transaction pooler" string from Supabase > Connect (the user looks like postgres.<project-ref>).';
  if (/password authentication failed/i.test(m)) return 'Wrong database password. Reset it in Supabase > Project Settings > Database, update DATABASE_URL, redeploy.';
  if (/ENOTFOUND|EAI_AGAIN/.test(m)) return 'The database host name could not be found. Re-copy the connection string from Supabase.';
  if (/ECONNREFUSED|ETIMEDOUT|ENETUNREACH/.test(m)) return 'Could not reach the database. Use the "Transaction pooler" string (port 6543), not "Direct connection".';
  if (/self.signed|certificate/i.test(m)) return 'SSL certificate problem talking to the database.';
  return 'Database error. See the message field.';
}

export async function GET() {
  const present = (k) => Boolean(process.env[k] && process.env[k].trim());
  const env = {
    DATABASE_URL: present('DATABASE_URL'),
    AUTH_SECRET: present('AUTH_SECRET'),
    ADMIN_USERNAME: present('ADMIN_USERNAME'),
    ADMIN_PASSWORD: present('ADMIN_PASSWORD'),
    NYLONPAY_API_KEY: present('NYLONPAY_API_KEY'),
    NYLONPAY_API_SECRET: present('NYLONPAY_API_SECRET'),
    NYLONPAY_WEBHOOK_SECRET: present('NYLONPAY_WEBHOOK_SECRET'),
  };
  const missing = Object.entries(env).filter(([k, v]) => !v && k !== 'NYLONPAY_WEBHOOK_SECRET').map(([k]) => k);

  let db;
  try {
    const { rows } = await query(
      `SELECT (SELECT count(*) FROM units)::int AS units, (SELECT count(*) FROM admins)::int AS admins`
    );
    db = { ok: true, ...rows[0] };
  } catch (err) {
    let message = String(err?.message || err);
    const pw = (() => { try { return decodeURIComponent(new URL(process.env.DATABASE_URL).password); } catch { return ''; } })();
    if (pw) message = message.split(pw).join('***');
    db = { ok: false, message: message.slice(0, 300), hint: hint(err) };
  }

  return NextResponse.json({
    ok: missing.length === 0 && db.ok,
    missingEnvVars: missing,
    env,
    database: db,
    note: 'If you just added env vars in Vercel, you must redeploy for them to take effect.',
  });
}
