export const ADMIN_COOKIE = 'qv_admin_token';

/** Derives a session token from the admin password (Web Crypto — works in both Node and Edge runtimes). */
export async function computeAdminToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`quest-vault-admin:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
