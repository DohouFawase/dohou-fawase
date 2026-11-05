import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid tracking data" }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const requestedPath = typeof payload.path === "string" ? payload.path.trim() : "/";
  const path = requestedPath.split(/[?#]/, 1)[0] || "/";
  if (path.length > 512 || !path.startsWith("/") || path.startsWith("//")) {
    return NextResponse.json({ error: "Invalid page path" }, { status: 400 });
  }

  const requestedSection = typeof payload.section === "string" ? payload.section.trim() : "";
  const section = (requestedSection || "Accueil").slice(0, 100);
  const headerList = await headers();

  const countryCode =
    headerList.get("x-vercel-ip-country") ||
    headerList.get("cf-ipcountry") ||
    "Inconnu";

  const countryName =
    countryCode === "BJ" ? "Bénin" :
    countryCode === "FR" ? "France" : countryCode;

  const supabase = await createClient();
  const { error } = await supabase.from("page_views").insert({
    path,
    section,
    country: countryName,
  });

  if (error) {
    console.error("Erreur d’enregistrement du suivi:", error);
    return NextResponse.json({ error: "Tracking error" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
