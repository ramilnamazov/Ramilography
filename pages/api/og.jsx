import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

export default async function handler(req) {
  try {
    const { origin } = new URL(req.url);

    // Fetch hero image manifest built at request time via a relative fetch
    const manifestRes = await fetch(`${origin}/api/hero-manifest`);
    const { images } = await manifestRes.json();

    const picked = images[Math.floor(Math.random() * images.length)];
    const imgUrl = `${origin}/images/hero/${encodeURIComponent(picked)}`;

    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            position: "relative",
            backgroundColor: "#070d0b",
          }}
        >
          {/* Hero photo background */}
          <img
            src={imgUrl}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.62,
            }}
          />

          {/* Gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(7,13,11,0.96) 0%, rgba(7,13,11,0.55) 50%, rgba(7,13,11,0.1) 100%)",
              display: "flex",
            }}
          />

          {/* Text block */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "48px 64px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <span
              style={{
                color: "#a88753",
                fontSize: "15px",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                fontFamily: "serif",
              }}
            >
              Luxury Cinematic Photography
            </span>
            <span
              style={{
                color: "#f5f3ef",
                fontSize: "76px",
                fontWeight: "600",
                letterSpacing: "0.06em",
                fontFamily: "serif",
                lineHeight: 1,
              }}
            >
              Ramilography
            </span>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (err) {
    return new Response("Failed to generate OG image: " + err.message, {
      status: 500,
    });
  }
}
