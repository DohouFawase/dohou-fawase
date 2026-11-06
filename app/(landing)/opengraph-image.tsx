import { ImageResponse } from "next/og";

export const alt = "Dohou Gbenoupko Fawase — Produit, design et ingénierie logicielle";
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
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "68px 82px",
          color: "#fff",
          background:
            "radial-gradient(circle at 88% 12%, rgba(234,88,12,.32), transparent 34%), linear-gradient(135deg,#1b1b1b 0%,#090909 100%)",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#f97316",
            }}
          />
          <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: 3 }}>
            DOHOU GBENOUPKO FAWASE
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <span style={{ fontSize: 82, fontWeight: 700, letterSpacing: -4 }}>
            Des idées
          </span>
          <span
            style={{
              fontSize: 82,
              fontWeight: 700,
              letterSpacing: -4,
              color: "#fb923c",
            }}
          >
            en produits.
          </span>
          <span style={{ marginTop: 16, color: "#d4d4d4", fontSize: 26 }}>
            Produit · Design · Ingénierie logicielle
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,.2)",
            paddingTop: 24,
            color: "#a3a3a3",
            fontSize: 18,
            letterSpacing: 2,
          }}
        >
          PRODUIT · WEB ET MOBILE · FREELANCE
        </div>
      </div>
    ),
    { ...size },
  );
}
