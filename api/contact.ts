/**
 * POST /api/contact — Vercel Function (Node.js runtime, Web-standard handler).
 * Validates + sanitizes input, blocks spam (honeypot, min fill time, origin check, rate limit)
 * and delivers the request via Resend (email) and/or Telegram. Secrets live only in env vars.
 */
import { BLOB_URL_RE, BUDGETS, BUDGET_LABELS, MAX_FILES, type Budget } from './_uploads';

type Payload = {
  name?: unknown; phone?: unknown; email?: unknown; message?: unknown;
  consent?: unknown; company?: unknown; budget?: unknown; files?: unknown; elapsed?: unknown; lang?: unknown; page?: unknown;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d][\d\s()\-]{8,19}$/;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
// Best-effort in-memory limiter (per warm instance). For strict limits use Vercel WAF rate limiting or Upstash.
const hits = new Map<string, number[]>();

const json = (status: number, body: object) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const clean = (v: unknown, max: number) =>
  String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function rateLimited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > MAX_PER_WINDOW;
}

export async function POST(request: Request): Promise<Response> {
  const env = process.env;
  const origin = request.headers.get('origin');
  const allowed = (env.ALLOWED_ORIGINS || 'https://click-it.com.ua,https://www.click-it.com.ua').split(',').map((s) => s.trim()).filter(Boolean);
  const isLocal = origin ? /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) : false;
  const isVercelPreview = origin ? /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin) : false;
  if (origin && allowed.length && !allowed.includes(origin) && !isLocal && !isVercelPreview) return json(403, { error: 'forbidden' });

  if (!(request.headers.get('content-type') || '').includes('application/json')) return json(415, { error: 'unsupported_media_type' });
  const raw = await request.text();
  if (raw.length > 10_000) return json(413, { error: 'payload_too_large' });

  let body: Payload;
  try { body = JSON.parse(raw); } catch { return json(400, { error: 'invalid_json' }); }

  // Spam traps: filled honeypot or submitted faster than a human could → pretend success.
  if (clean(body.company, 200) || Number(body.elapsed) < 2500) return json(200, { ok: true });

  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) return json(429, { error: 'rate_limited' });

  const data = {
    name: clean(body.name, 80),
    phone: clean(body.phone, 24),
    email: clean(body.email, 120).toLowerCase(),
    message: clean(body.message, 2000),
    lang: clean(body.lang, 4),
    page: clean(body.page, 200),
    budget: clean(body.budget, 20),
  };
  const files = (Array.isArray(body.files) ? body.files : []).slice(0, MAX_FILES)
    .map((f) => ({ url: clean((f as { url?: unknown })?.url, 500), name: clean((f as { name?: unknown })?.name, 140) || 'file' }))
    .filter((f) => BLOB_URL_RE.test(f.url));
  const errors: string[] = [];
  if (data.name.length < 2) errors.push('name');
  if (!PHONE_RE.test(data.phone)) errors.push('phone');
  if (!EMAIL_RE.test(data.email)) errors.push('email');
  if (!(BUDGETS as readonly string[]).includes(data.budget)) errors.push('budget');
  if (body.consent !== true) errors.push('consent');
  if (errors.length) return json(422, { error: 'validation', fields: errors });

  const lines = [
    ['Name', data.name], ['Phone', data.phone], ['Email', data.email],
    ['Budget', BUDGET_LABELS[data.budget as Budget]],
    ['Message', data.message || '—'],
    ['Files', files.length ? files.map((f) => `${f.name}: ${f.url}`).join('\n') : '—'],
    ['Language', data.lang], ['Page', data.page],
  ] as const;

  const tasks: Promise<Response>[] = [];
  if (env.RESEND_API_KEY && env.CONTACT_TO_EMAIL) {
    const html = `<h2>New request from click-it.com.ua</h2><table cellpadding="6">${lines
      .map(([k, v]) => `<tr><td><b>${k}</b></td><td>${escapeHtml(v).replace(/\n/g, '<br>')}</td></tr>`).join('')}</table>`;
    tasks.push(fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL || 'Click IT website <onboarding@resend.dev>',
        to: env.CONTACT_TO_EMAIL.split(',').map((s) => s.trim()),
        reply_to: data.email,
        subject: `Click IT — new request: ${data.name}`,
        html,
        // Resend fetches each file by URL and attaches it to the email.
        ...(files.length ? { attachments: files.map((f) => ({ path: f.url, filename: f.name })) } : {}),
      }),
    }));
  }
  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    const text = `<b>New request — click-it.com.ua</b>\n` + lines.map(([k, v]) => `<b>${k}:</b> ${escapeHtml(v)}`).join('\n');
    tasks.push(fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    }));
  }

  if (!tasks.length) {
    if (env.NODE_ENV !== 'production' && !env.VERCEL) {
      console.info('[contact] no delivery channel configured — request logged (dev only):', data.name, data.email);
      return json(200, { ok: true, dev: true });
    }
    console.error('[contact] no delivery channel configured');
    return json(503, { error: 'not_configured' });
  }

  const results = await Promise.allSettled(tasks);
  const delivered = results.some((r) => r.status === 'fulfilled' && r.value.ok);
  if (!delivered) {
    console.error('[contact] delivery failed', results.map((r) => (r.status === 'fulfilled' ? r.value.status : String(r.reason))));
    return json(502, { error: 'delivery_failed' });
  }
  return json(200, { ok: true });
}

export function GET() {
  return json(405, { error: 'method_not_allowed' });
}
