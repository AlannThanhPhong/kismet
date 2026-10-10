import { getRsvpSummary } from "@/lib/rsvp-summary";
import { hasGuestbookAccess } from "@/lib/guestbook-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    if (!await hasGuestbookAccess(slug, request.headers.get("cookie") ?? ""))
      return new Response("Vui lòng nhập mật khẩu", { status: 401, headers: { "Cache-Control": "no-store" } });
  } catch { return new Response("Chưa kết nối được sổ lưu bút", { status: 503 }); }
  const encoder = new TextEncoder();
  let stopped = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const stream = new ReadableStream({
    start(controller) {
      const stop = () => {
        if (stopped) return;
        stopped = true;
        clearTimeout(timer);
        request.signal.removeEventListener("abort", stop);
        controller.close();
      };
      request.signal.addEventListener("abort", stop, { once: true });
      const startedAt = Date.now();
      let previous = "";
      const tick = async () => {
        if (stopped) return;
        try {
          if (!await hasGuestbookAccess(slug, request.headers.get("cookie") ?? "")) {
            if (!stopped) controller.enqueue(encoder.encode('event: locked\ndata: {}\n\n'));
            stop(); return;
          }
          const summary = await getRsvpSummary(slug);
          if (stopped) return;
          if (!summary) { controller.enqueue(encoder.encode('event: unavailable\ndata: {}\n\n')); stop(); return; }
          const json = JSON.stringify(summary);
          if (json !== previous) {
            controller.enqueue(encoder.encode(`data: ${json}\n\n`));
            previous = json;
          } else controller.enqueue(encoder.encode(": keepalive\n\n"));
        } catch {
          if (!stopped) controller.enqueue(encoder.encode('event: unavailable\ndata: {}\n\n'));
          stop(); return;
        }
        if (Date.now() - startedAt > 45000) stop();
        else timer = setTimeout(tick, 2000);
      };
      if (request.signal.aborted) stop();
      else void tick();
    },
    cancel() { stopped = true; clearTimeout(timer); },
  });
  return new Response(stream, { headers: {
    "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", "X-Accel-Buffering": "no",
  } });
}
