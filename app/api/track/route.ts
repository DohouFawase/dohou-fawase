import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const { section } = await request.json();
    const headerList = await headers();

    // Récupération du pays
    const countryCode =
      headerList.get("x-vercel-ip-country") ||
      headerList.get("cf-ipcountry") ||
      "Inconnu";

    const countryName =
      countryCode === "BJ" ? "Bénin" :
      countryCode === "FR" ? "France" : countryCode;

    const supabase = await createClient();

    await supabase.from("page_views").insert({
      path: "/",
      section: section || "Accueil",
      country: countryName,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Tracking error" }, { status: 500 });
  }
}