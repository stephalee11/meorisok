import { connection, NextResponse, type NextRequest } from "next/server";
import { hasSession } from "@/lib/auth";
import { getTasks, refreshTasks } from "@/lib/notion";

const ERROR = { error: "couldn't reach notion. try again in a sec." };
const UNAUTHORIZED = () => NextResponse.json({ error: "log in first." }, { status: 401 });

/** Cached task list (60s). */
export async function GET() {
  await connection(); // request time only, never prerendered at build
  if (!(await hasSession())) return UNAUTHORIZED();
  try {
    return NextResponse.json(await getTasks());
  } catch {
    return NextResponse.json(ERROR, { status: 502 });
  }
}

/** POST /api/tasks?refresh=1 throws away the cache and refetches. */
export async function POST(req: NextRequest) {
  if (!(await hasSession())) return UNAUTHORIZED();
  if (req.nextUrl.searchParams.get("refresh") !== "1") {
    return NextResponse.json({ error: "add ?refresh=1" }, { status: 400 });
  }
  try {
    return NextResponse.json(await refreshTasks());
  } catch {
    return NextResponse.json(ERROR, { status: 502 });
  }
}
