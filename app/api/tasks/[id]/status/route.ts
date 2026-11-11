import { NextResponse, type NextRequest } from "next/server";
import { describe, updateStatus, WriteError } from "@/lib/notion";
import { isStatusKey } from "@/lib/status";

const ID = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;
const ERROR = "couldn't reach notion. try again in a sec.";

/** PATCH { sourceId, status } -> sets the page's Notion status. Only status is writable. */
export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/tasks/[id]/status">) {
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => null)) as { sourceId?: unknown; status?: unknown } | null;

  if (!ID.test(id) || !body || typeof body.sourceId !== "string" || !isStatusKey(body.status)) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  try {
    return NextResponse.json(await updateStatus(id, body.sourceId, body.status));
  } catch (err) {
    console.error(`[meorisok] status update for ${id} failed:`, describe(err));
    const status = err instanceof WriteError && err.status < 500 ? err.status : 502;
    // Never pass Notion's own error text to the browser.
    return NextResponse.json({ error: status === 502 ? ERROR : "can't update that ticket." }, { status });
  }
}
