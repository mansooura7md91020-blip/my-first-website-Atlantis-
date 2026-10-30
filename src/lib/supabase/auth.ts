import "server-only";
import { cookies } from "next/headers";
import { dbRequest, supabaseConfig } from "./rest";

export const ADMIN_COOKIE = "atlantis_admin_access";

export async function getAdminToken(): Promise<string | null> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const config = supabaseConfig();
  if (!config) return null;
  try {
    // A token is NOT enough; verify it with Supabase and look up admin membership via RLS.
    const userResponse = await fetch(`${config.url}/auth/v1/user`, {
      headers: { apikey: config.key, Authorization: `Bearer ${token}` }, cache: "no-store",
    });
    if (!userResponse.ok) return null;
    const user = await userResponse.json();
    if (!user?.id) return null;
    const matches = await dbRequest(`admin_users?select=user_id&user_id=eq.${encodeURIComponent(user.id)}&limit=1`, { token });
    return Array.isArray(matches) && matches.length === 1 ? token : null;
  } catch {
    return null;
  }
}
