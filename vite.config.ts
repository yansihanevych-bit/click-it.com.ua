import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

/** Dev only: serve /api/contact + /api/upload from api/*.ts so the form works without `vercel dev`. */
function devApi(): Plugin {
  return {
    name: 'click-it-dev-api',
    apply: 'serve',
    configureServer(server) {
      for (const name of ['contact', 'upload']) {
        server.middlewares.use(`/api/${name}`, async (req, res) => {
          const chunks: Buffer[] = [];
          for await (const c of req) chunks.push(c as Buffer);
          const mod = await server.ssrLoadModule(`/api/${name}.ts`);
          const request = new Request(`http://localhost/api/${name}`, {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body: req.method === 'POST' ? Buffer.concat(chunks) : undefined,
          });
          const response: Response = await (req.method === 'POST' ? mod.POST(request) : mod.GET());
          res.statusCode = response.status;
          response.headers.forEach((v, k) => res.setHeader(k, v));
          res.end(await response.text());
        });
      }
    },
    transformIndexHtml: {
      order: 'pre',
      handler: (html, ctx) => (ctx.server ? html.replace('<!--app-lang-->', 'uk') : html),
    },
  };
}

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  return {
    plugins: [react(), devApi()],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    build: { target: 'es2022', cssCodeSplit: false, sourcemap: false, assetsInlineLimit: 2048 },
    ssr: { noExternal: ['react-router'] },
  };
});
