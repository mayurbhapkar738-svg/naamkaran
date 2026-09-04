/**
 * Naamkaran backend — Cloudflare Worker
 *
 * Two jobs:
 *  1. POST /api/generate   -> calls the Google Gemini API server-side
 *  2. GET  /api/count      -> reads the shared adoption count for a name
 *     POST /api/count      -> increments/decrements it
 *
 * Required Cloudflare setup:
 *  - Secret: GEMINI_API_KEY
 *  - Var: GEMINI_MODEL (set to gemini-3.7-flash)
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

    // ---- Generate names via Google Gemini API ----
    if (url.pathname === "/api/generate" && request.method === "POST") {
      try {
        const { prompt } = await request.json();

        if (!prompt || typeof prompt !== "string") {
          return new Response(JSON.stringify({ error: "prompt required" }), {
            status: 400,
            headers: { ...headers, "Content-Type": "application/json" },
          });
        }

        if (!env.GEMINI_API_KEY) {
          console.error("GEMINI_API_KEY is not configured");
          return new Response(JSON.stringify({ error: "Gemini API key is not configured" }), {
            status: 500,
            headers: { ...headers, "Content-Type": "application/json" },
          });
        }

        const model = env.GEMINI_MODEL || "gemini-3.7-flash";

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": env.GEMINI_API_KEY,
            },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: prompt }],
                },
              ],
            }),
          }
        );

        const responseText = await geminiRes.text();
        let data;
        try {
          data = JSON.parse(responseText);
        } catch {
          data = null;
        }

        if (!geminiRes.ok) {
          console.error("Gemini API error", geminiRes.status, responseText);
          return new Response(
            JSON.stringify({
              error: "Gemini request failed",
              upstream_status: geminiRes.status,
              detail: data?.error?.message || responseText.slice(0, 1000),
            }),
            {
              status: geminiRes.status >= 400 && geminiRes.status < 500 ? geminiRes.status : 502,
              headers: { ...headers, "Content-Type": "application/json" },
            }
          );
        }

        const text = data?.candidates?.[0]?.content?.parts
          ?.map((part) => part?.text || "")
          .join("") || "";

        if (!text) {
          console.error("Gemini returned no generated text", data);
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
            status: 500,
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
