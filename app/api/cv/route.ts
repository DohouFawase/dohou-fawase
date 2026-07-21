import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();

    // 1. Récupérer la valeur actuelle
    const { data: currentStat } = await supabase
      .from("site_stats")
      .select("value")
      .eq("key", "cv_downloads")
      .maybeSingle();

    const currentCount = currentStat?.value ?? 0;

    // 2. Mettre à jour ou insérer la nouvelle valeur
    const { error } = await supabase
      .from("site_stats")
      .upsert(
        { key: "cv_downloads", value: currentCount + 1 },
        { onConflict: "key" }
      );

    if (error) {
      console.error("Erreur mise à jour cv_downloads:", error);
      return NextResponse.json(
        { error: "Impossible de mettre à jour les statistiques" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, downloads: currentCount + 1 });
  } catch (err) {
    console.error("Erreur API CV Stats:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}