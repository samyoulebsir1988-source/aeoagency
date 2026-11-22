import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#F3F0E8",
          color: "#1B1916",
        }}
      >
        <div style={{ width: 18, background: "#8D3C2B" }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px 76px",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 24,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: "#5C564E",
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 68,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              maxWidth: 920,
            }}
          >
            {site.headline}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#3A352F" }}>
            Answer engine optimization
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
