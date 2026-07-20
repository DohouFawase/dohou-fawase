import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const { path } = await request.json();

    // Récupération du pays depuis l'en-tête Vercel/Cloudflare (par défaut 'Inconnu')
    const country = request.headers.get("x-vercel-ip-country") || "Visiteur";

    const supabase = await createClient();
    await supabase.from("page_views").insert({
      path,
      country,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur de suivi" }, { status: 500 });
  }
}