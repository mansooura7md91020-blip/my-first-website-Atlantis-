/** Native Supabase REST client: no extra npm package required.
 * Publishable key grants no admin rights. Database RLS enforces authorization.
 */
export function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !key || !/^https:\/\/[a-z0-9.-]+\.supabase\.co$/i.test(url)) return null;
  return { url, key };
}

export async function dbRequest(
  path: string,
  options: { method?: string; body?: unknown; token?: string; extraHeaders?: Record<string, string> } = {}
) {
  const config = supabaseConfig();
  if (!config) throw new Error("Supabase URL and publishable key are not configured.");
  const headers: Record<string, string> = {
    apikey: config.key,
    ...options.extraHeaders,
  };
  // Publishable keys are not JWTs: Authorization header is only for real user tokens.
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store",
  });
  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase database error ${response.status}: ${details.slice(0, 400)}`);
  }
  if (response.status === 204) return null;
  const body = await response.text();
  return body ? JSON.parse(body) : null;
}
