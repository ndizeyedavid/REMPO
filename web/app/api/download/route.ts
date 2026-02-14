import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const now = new Date();

  const headers = req.headers;
  const forwardedFor = headers.get("x-forwarded-for") || "";
  const ip = forwardedFor.split(",")[0]?.trim() || "unknown";
  const userAgent = headers.get("user-agent") || "unknown";
  const referer = headers.get("referer") || "unknown";
  const acceptLanguage = headers.get("accept-language") || "unknown";

  const repoOwner = "ndizeyedavid";
  const repoName = "REMPO";

  let downloadUrl = `https://github.com/${repoOwner}/${repoName}/releases/latest`;

  try {
    const releaseRes = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`,
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
        cache: "no-store",
      }
    );

    if (releaseRes.ok) {
      const release = (await releaseRes.json()) as {
        assets?: Array<{ name: string; browser_download_url: string }>;
        html_url?: string;
      };

      const assets = release.assets || [];

      const preferred =
        assets.find((a) => a.name.toLowerCase().endsWith(".exe")) ||
        assets.find((a) => a.name.toLowerCase().includes("setup")) ||
        assets[0];

      if (preferred?.browser_download_url) {
        downloadUrl = preferred.browser_download_url;
      } else if (release.html_url) {
        downloadUrl = release.html_url;
      }
    }
  } catch {
    // ignore and fallback to releases/latest
  }

  const mailerooKey = process.env.MAILEROO_SENDING_KEY;
  const mailFrom = process.env.MAILEROO_FROM;
  const mailTo = process.env.MAILEROO_TO;

  if (mailerooKey && mailFrom && mailTo) {
    const subject = `REMPO download: ${now.toISOString()}`;

    const html = `
      <div style="font-family: ui-sans-serif, system-ui; line-height: 1.6">
        <h2 style="margin: 0 0 12px 0;">New REMPO Download</h2>
        <p style="margin: 0 0 16px 0;">A user clicked download on the website.</p>

        <table style="border-collapse: collapse; width: 100%; max-width: 720px;">
          <tr><td style="padding: 6px 0; color: #555; width: 160px;">Time</td><td style="padding: 6px 0;">${now.toISOString()}</td></tr>
          <tr><td style="padding: 6px 0; color: #555;">IP</td><td style="padding: 6px 0;">${escapeHtml(ip)}</td></tr>
          <tr><td style="padding: 6px 0; color: #555;">User-Agent</td><td style="padding: 6px 0;">${escapeHtml(userAgent)}</td></tr>
          <tr><td style="padding: 6px 0; color: #555;">Referrer</td><td style="padding: 6px 0;">${escapeHtml(referer)}</td></tr>
          <tr><td style="padding: 6px 0; color: #555;">Accept-Language</td><td style="padding: 6px 0;">${escapeHtml(acceptLanguage)}</td></tr>
          <tr><td style="padding: 6px 0; color: #555;">Download URL</td><td style="padding: 6px 0;"><a href="${downloadUrl}">${downloadUrl}</a></td></tr>
        </table>
      </div>
    `;

    try {
      const mailRes = await fetch("https://smtp.maileroo.com/api/v2/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${mailerooKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: { address: mailFrom, display_name: "REMPO Website" },
          to: { address: mailTo },
          subject,
          html,
          tags: {
            event: "download",
            project: "REMPO",
          },
        }),
      });

      const responseText = await mailRes.text();

      if (!mailRes.ok) {
        console.error("[download] Maileroo API error", {
          status: mailRes.status,
          statusText: mailRes.statusText,
          responseText,
        });
      } else {
        console.log("[download] Maileroo email queued successfully", {
          status: mailRes.status,
          responseText,
        });
      }
    } catch (error) {
      // ignore email errors; still allow download
      console.error("[download] Maileroo request failed", error);
    }
  } else {
    console.warn("[download] Maileroo not configured (missing env)", {
      hasKey: Boolean(mailerooKey),
      hasFrom: Boolean(mailFrom),
      hasTo: Boolean(mailTo),
    });
  }

  return NextResponse.json({ ok: true, downloadUrl });
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
