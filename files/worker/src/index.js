/**
 * Naamkaran backend — Cloudflare Worker
 *
 * Two jobs:
 *  1. POST /api/generate   -> proxies to Google Gemini, keeps your API key server-side
 *  2. GET  /api/count      -> reads the shared adoption count for a name
 *     POST /api/count      -> increments/decrements it
 *
 * Required setup (see README.md in this folder):
 *  - Secret:  GEMINI_API_KEY     (free, no credit card — get it at https://aistudio.google.com/apikey)
 *  - Var:     GEMINI_MODEL       (e.g. "gemini-2.5-flash" — CHECK https://ai.google.dev/gemini-api/docs/pricing
 *                                 for which model currently shows "Free" before deploying; this changes often)
 *  - KV binding: NAMES_KV
 *  - Var:     ALLOWED_ORIGIN     (your GitHub Pages URL, e.g. https://yourname.github.io)
 */

function corsHeaders(origin, allowedOrigin) {
  const allow = origin === allowedOrigin ? allowedOrigin : allowedOrigin;
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function normalizeKey(name) {
  return (
    "adopt:" +
    name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "")
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const headers = corsHeaders(request.headers.get("Origin") || "", env.ALLOWED_ORIGIN);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    // ---- Generate names via Gemini ----
    if (url.pathname === "/api/generate" && request.method === "POST") {
      try {
        const { prompt } = await request.json();
        const model = env.GEMINI_MODEL || "gemini-2.5-flash";

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": env.GEMINI_API_KEY,
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.9 },
            }),
          }
        );

        if (!geminiRes.ok) {
          const errText = await geminiRes.text();
          return new Response(JSON.stringify({ error: "Gemini request failed", detail: errText }), {
            status: 502,
            headers: { ...headers, "Content-Type": "application/json" },
          });
        }

        const data = await geminiRes.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        return new Response(JSON.stringify({ text }), {
          headers: { ...headers, "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: "Bad request", detail: String(err) }), {
          status: 400,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }
    }

    // ---- Read adoption count ----
    if (url.pathname === "/api/count" && request.method === "GET") {
      const name = url.searchParams.get("name") || "";
      if (!name) {
        return new Response(JSON.stringify({ error: "name required" }), {
          status: 400,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }
      const stored = await env.NAMES_KV.get(normalizeKey(name));
      const count = stored ? JSON.parse(stored).count : 0;
      return new Response(JSON.stringify({ name, count }), {
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    // ---- Update adoption count ----
    if (url.pathname === "/api/count" && request.method === "POST") {
      try {
        const { name, delta } = await request.json();
        if (!name || (delta !== 1 && delta !== -1)) {
          return new Response(JSON.stringify({ error: "name and delta (1 or -1) required" }), {
            status: 400,
            headers: { ...headers, "Content-Type": "application/json" },
          });
        }
        const key = normalizeKey(name);
        const stored = await env.NAMES_KV.get(key);
        const current = stored ? JSON.parse(stored).count : 0;
        const next = Math.max(0, current + delta);
        await env.NAMES_KV.put(key, JSON.stringify({ count: next }));
        return new Response(JSON.stringify({ name, count: next }), {
          headers: { ...headers, "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: "Bad request", detail: String(err) }), {
          status: 400,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }
    }

    return new Response("Not found", { status: 404, headers });
  },
};
