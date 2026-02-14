import { NextResponse } from "next/server";

type RateState = { count: number; resetAt: number };

function getClientIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for") || "";
  const ip = forwardedFor.split(",")[0]?.trim();
  return ip || "unknown";
}

function getRateStore() {
  const g = globalThis as any;
  if (!g.__rempoAiRateStore) {
    g.__rempoAiRateStore = new Map<string, RateState>();
  }
  return g.__rempoAiRateStore as Map<string, RateState>;
}

export async function POST(req: Request) {
  const ip = getClientIp(req);

  const limit = 30;
  const windowMs = 60_000;
  const now = Date.now();
  const store = getRateStore();
  const state = store.get(ip);
  if (!state || state.resetAt <= now) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
  } else {
    if (state.count >= limit) {
      return NextResponse.json(
        { ok: false, error: "Rate limit exceeded" },
        { status: 429 }
      );
    }
    state.count += 1;
    store.set(ip, state);
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "GROQ_API_KEY is not configured" },
      { status: 500 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const prompt = typeof body?.prompt === "string" ? body.prompt : "";
  if (!prompt.trim()) {
    return NextResponse.json(
      { ok: false, error: "prompt is required" },
      { status: 400 }
    );
  }

  if (prompt.length > 6000) {
    return NextResponse.json(
      { ok: false, error: "prompt is too large" },
      { status: 413 }
    );
  }

  const modelIn = typeof body?.model === "string" ? body.model.trim() : "";
  const model = modelIn || "llama-3.3-70b-versatile";

  const temperature =
    typeof body?.temperature === "number" ? body.temperature : 0.5;
  const max_tokens =
    typeof body?.max_tokens === "number" ? body.max_tokens : 150;

  if (temperature < 0 || temperature > 2) {
    return NextResponse.json(
      { ok: false, error: "temperature must be between 0 and 2" },
      { status: 400 }
    );
  }
  if (max_tokens < 1 || max_tokens > 600) {
    return NextResponse.json(
      { ok: false, error: "max_tokens must be between 1 and 600" },
      { status: 400 }
    );
  }

  try {
    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature,
          max_tokens,
        }),
      }
    );

    const raw = await groqRes.text();
    if (!groqRes.ok) {
      return NextResponse.json(
        { ok: false, error: "Groq request failed", details: raw },
        { status: 502 }
      );
    }

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid Groq response" },
        { status: 502 }
      );
    }

    const summary =
      parsed?.choices?.[0]?.message?.content || "No summary generated.";

    return NextResponse.json({ ok: true, summary });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500 }
    );
  }
}
