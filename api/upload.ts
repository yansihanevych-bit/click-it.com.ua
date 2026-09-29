/**
 * POST /api/upload — issues short-lived client tokens for Vercel Blob uploads from the contact form.
 * Files go straight from the browser to Blob storage (no 4.5 MB function body limit);
 * the form then sends only the resulting URLs to /api/contact.
 * Requires BLOB_READ_WRITE_TOKEN (created automatically when a Blob store is connected to the project).
 */
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { FILE_TYPES, MAX_FILE_BYTES, fileExt } from './_uploads';

const json = (status: number, body: object) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, number[]>();
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
  if (!env.BLOB_READ_WRITE_TOKEN) return json(503, { error: 'uploads_not_configured' });

  const origin = request.headers.get('origin');
  const allowed = (env.ALLOWED_ORIGINS || 'https://click-it.com.ua,https://www.click-it.com.ua').split(',').map((s) => s.trim()).filter(Boolean);
  const isLocal = origin ? /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) : false;
  const isVercelPreview = origin ? /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin) : false;
  if (!origin || (!allowed.includes(origin) && !isLocal && !isVercelPreview)) return json(403, { error: 'forbidden' });

  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) return json(429, { error: 'rate_limited' });

  const raw = await request.text();
  if (raw.length > 4000) return json(413, { error: 'payload_too_large' });
  let body: HandleUploadBody;
  try { body = JSON.parse(raw); } catch { return json(400, { error: 'invalid_json' }); }
  if (body?.type !== 'blob.generate-client-token') return json(400, { error: 'unsupported' });

  try {
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname) => {
        const type = FILE_TYPES[fileExt(pathname)];
        if (!type || !pathname.startsWith('contact/')) throw new Error('file_type');
        return {
          allowedContentTypes: [type],
          maximumSizeInBytes: MAX_FILE_BYTES,
          addRandomSuffix: true,
          validUntil: Date.now() + 5 * 60 * 1000,
        };
      },
    });
    return json(200, result);
  } catch (e) {
    return json(400, { error: e instanceof Error ? e.message : 'upload_error' });
  }
}

export function GET() {
  return json(405, { error: 'method_not_allowed' });
}
