import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { query, isThrottled, recordLoginFailure, clearLoginFailures } from './lib/db';

class ServerError extends CredentialsSignin {
  code = 'server_error';
}

// Compared against when the username doesn't exist, so response time doesn't reveal valid usernames
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10);

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 }, // admin stays signed in for 8 hours
  providers: [
    Credentials({
      credentials: { username: {}, password: {} },
      async authorize(credentials) {
        try {
          return await checkCredentials(credentials);
        } catch (err) {
          // Database down / misconfigured: log it and fail the login cleanly instead of crashing
          console.error('Admin login failed because of a server error:', err);
          return null;
        }
      },
    }),
  ],
});

async function checkCredentials(credentials) {
        const username = String(credentials?.username || '').trim().toLowerCase();
        const password = String(credentials?.password || '');
        if (!username || !password) return null;

        let rows;
        try {
          if (await isThrottled(username)) return null;
          ({ rows } = await query('SELECT username, password_hash FROM admins WHERE username = $1', [username]));
        } catch (err) {
          console.error('Admin login: database error:', err?.message);
          throw new ServerError();
        }
        const valid = await bcrypt.compare(password, rows[0]?.password_hash || DUMMY_HASH);
        try {
          if (!valid || rows.length === 0) {
            await recordLoginFailure(username);
            return null;
          }
          await clearLoginFailures(username);
        } catch (err) {
          console.error('Admin login: database error:', err?.message);
          throw new ServerError();
        }
        return { id: username, name: username };
}

// Use at the top of every admin API route
export async function requireAdmin() {
  try {
    const session = await auth();
    return session?.user ? session : null;
  } catch (err) {
    console.error('Session check failed (is AUTH_SECRET set?):', err);
    return null;
  }
}
