/**
 * Naamkaran backend — Cloudflare Worker
 *
 * Two jobs:
 *  1. POST /api/generate   -> runs Gemini 3.7 Flash through Cloudflare Workers AI
 *  2. GET  /api/count      -> reads the shared adoption count for a name
 *     POST /api/count      -> increments/decrements it
 *
 * Required Cloudflare setup:
 *  - Workers AI binding: AI
 *  - KV binding: NAMES_KV
 *  - Var: ALLOWED_ORIGIN (your GitHub Pages origin)
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
    const origin = request.headers.get("Origin") || "";
    const headers = corsHeaders(origin, env.ALLOWED_ORIGIN);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    // ---- Generate names via Cloudflare Workers AI / Gemini 3.7 Flash ----
    if (url.pathname === "/api/generate" && request.method === "POST") {
      try {
        const { prompt } = await request.json();

        if (!prompt || typeof prompt !== "string") {
          return new Response(JSON.stringify({ error: "prompt required" }), {
            status: 400,
            headers: { ...headers, "Content-Type": "application/json" },
          });
        }

        if (!env.AI) {
          throw new Error("Workers AI binding 'AI' is not configured");
        }

        const result = await env.AI.run("google/gemini-3.7-flash", {
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.9,
          },
        });

        const text =
          result?.candidates?.[0]?.content?.parts
            ?.map((part) => part?.text || "")
            .join("") ||
          result?.response ||
          result?.text ||
          "";

        if (!text) {
          console.error("Workers AI returned no generated text", result);
          return new Response(
            JSON.stringify({ error: "Gemini returned no generated text" }),
            {
              status: 502,
              headers: { ...headers, "Content-Type": "application/json" },
            }
          );
        }

        return new Response(JSON.stringify({ text }), {
          headers: { ...headers, "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error("/api/generate failed", err);
        return new Response(
          JSON.stringify({ error: "Gemini generation failed", detail: String(err) }),
          {
            status: 502,
            headers: { ...headers, "Content-Type": "application/json" },
          }
        );
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
