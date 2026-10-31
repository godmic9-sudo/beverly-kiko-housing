import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// Works with any Postgres: Vercel Postgres / Neon, Supabase, Railway, local.
// Set DATABASE_URL (use the *pooled* connection string on serverless).

const g = globalThis;

function getPool() {
  if (!g.__bkPool) {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
    // Supabase/Neon need SSL. We strip ?sslmode from the URL and set ssl ourselves, because newer
    // `pg` versions treat sslmode=require as strict verification, which fails on pooler certificates.
    const url = new URL(process.env.DATABASE_URL);
    const isLocal = ['localhost', '127.0.0.1', ''].includes(url.hostname) || process.env.DATABASE_URL.includes('host=/');
    url.searchParams.delete('sslmode');
    g.__bkPool = new Pool({
      connectionString: url.toString(),
      ssl: isLocal ? false : { rejectUnauthorized: false },
      max: 3,
      idleTimeoutMillis: 10_000,
    });
  }
  return g.__bkPool;
}

const SEED_UNITS = [
  ['1', 'Beverly Heights - Unit A1', 'Kololo, Kampala', 1800000, 'Abram Carter (+256770000001)', true],
  ['2', 'Beverly Suites - Unit B4', 'Naalya, Kampala', 850000, 'Kiko Housing (+256750000002)', true],
  ['3', 'Beverly Manor - Unit C2', 'Ntinda, Kampala', 1200000, 'N/A (N/A)', false],
  ['4', 'Beverly Villa - Unit 05', 'Muyenga, Kampala', 2500000, 'N/A (N/A)', false],
  ['5', 'Beverly Haven - Unit D1', 'Entebbe Road', 950000, 'N/A (N/A)', false],
];

async function init() {
  const client = await getPool().connect();
  try {
    // Everything below runs in ONE transaction with a transaction-scoped advisory lock, so two cold
    // starts can't race, and it stays correct behind Supabase's transaction pooler (port 6543).
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(727274)');

    await client.query(`
      CREATE TABLE IF NOT EXISTS units (
        id         TEXT PRIMARY KEY,
        name       TEXT NOT NULL,
        location   TEXT NOT NULL,
        price      INTEGER NOT NULL CHECK (price > 0),
        tenant     TEXT NOT NULL DEFAULT 'N/A',
        occupied   BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      -- No foreign key on unit_id on purpose: deleting a unit must not erase payment history.
      CREATE TABLE IF NOT EXISTS payments (
        reference      TEXT PRIMARY KEY,
        unit_id        TEXT,
        unit_name      TEXT NOT NULL,
        tenant_name    TEXT NOT NULL,
        tenant_email   TEXT NOT NULL,
        tenant_phone   TEXT NOT NULL,
        network        TEXT,
        months         TEXT[] NOT NULL,
        amount         INTEGER NOT NULL,
        status         TEXT NOT NULL DEFAULT 'pending',
        failure_reason TEXT,
        created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
        paid_at        TIMESTAMPTZ
      );
      CREATE INDEX IF NOT EXISTS payments_created_idx ON payments (created_at DESC);
      CREATE TABLE IF NOT EXISTS admins (
        username      TEXT PRIMARY KEY,
        password_hash TEXT NOT NULL,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE TABLE IF NOT EXISTS login_failures (
        username TEXT NOT NULL,
        at       TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS login_failures_idx ON login_failures (username, at);
      CREATE TABLE IF NOT EXISTS meta (
        key   TEXT PRIMARY KEY,
        value TEXT
      );
    `);

    // Supabase exposes public tables through its Data API. Turn on Row Level Security with no policies,
    // so that API can never read these tables. This app connects as the database owner, which bypasses RLS.
    for (const t of ['units', 'payments', 'admins', 'login_failures', 'meta']) {
      await client.query(`ALTER TABLE ${t} ENABLE ROW LEVEL SECURITY`);
    }

    // Seed the original demo units once (never again, so deleting them sticks)
    const seeded = await client.query(`SELECT 1 FROM meta WHERE key = 'seeded_units'`);
    if (seeded.rowCount === 0) {
      for (const u of SEED_UNITS) {
        await client.query(
          `INSERT INTO units (id, name, location, price, tenant, occupied) VALUES ($1,$2,$3,$4,$5,$6)
           ON CONFLICT (id) DO NOTHING`,
          u
        );
      }
      await client.query(`INSERT INTO meta (key, value) VALUES ('seeded_units', '1')`);
    }

    // The admin from ADMIN_USERNAME / ADMIN_PASSWORD always exists and its password
    // always matches the env var. To reset a forgotten password: change the env var and redeploy.
    const adminUser = (process.env.ADMIN_USERNAME || '').trim().toLowerCase();
    const adminPass = process.env.ADMIN_PASSWORD || '';
    if (adminUser && adminPass) {
      const existing = await client.query('SELECT password_hash FROM admins WHERE username = $1', [adminUser]);
      if (existing.rowCount === 0) {
        await client.query('INSERT INTO admins (username, password_hash) VALUES ($1, $2)', [
          adminUser,
          await bcrypt.hash(adminPass, 10),
        ]);
      } else if (!(await bcrypt.compare(adminPass, existing.rows[0].password_hash))) {
        await client.query('UPDATE admins SET password_hash = $2 WHERE username = $1', [
          adminUser,
          await bcrypt.hash(adminPass, 10),
        ]);
      }
    }
    await client.query('COMMIT');
  } catch (err) {
    try { await client.query('ROLLBACK'); } catch {}
    throw err;
  } finally {
    client.release();
  }
}

function ready() {
  if (!g.__bkReady) {
    g.__bkReady = init().catch((err) => {
      g.__bkReady = null; // allow a retry on the next request
      throw err;
    });
  }
  return g.__bkReady;
}

export async function query(text, params) {
  await ready();
  return getPool().query(text, params);
}

// ---- admin login throttling (5 failures per username per 15 minutes) ----
export async function isThrottled(username) {
  const { rows } = await query(
    `SELECT count(*)::int AS n FROM login_failures WHERE username = $1 AND at > now() - interval '15 minutes'`,
    [username]
  );
  return rows[0].n >= 5;
}
export async function recordLoginFailure(username) {
  await query('INSERT INTO login_failures (username) VALUES ($1)', [username]);
}
export async function clearLoginFailures(username) {
  await query('DELETE FROM login_failures WHERE username = $1', [username]);
}
