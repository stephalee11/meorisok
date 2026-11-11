import "server-only";

import { cookies } from "next/headers";
import { isValidSession, SESSION_COOKIE } from "./session";

/** Check the session close to the data (route handlers, the app layout), not only in proxy.ts. */
export async function hasSession(): Promise<boolean> {
  const jar = await cookies();
  return isValidSession(jar.get(SESSION_COOKIE)?.value);
}
