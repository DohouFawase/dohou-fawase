"use server";

import { createClient } from "@/utils/supabase/server";

export async function incrementCvDownloads() {
  try {
    const supabase = await createClient();

    const { data: currentStat } = await supabase
      .from("site_stats")
      .select("value")
      .eq("key", "cv_downloads")
      .maybeSingle();

    const currentCount = currentStat?.value ?? 0;

    const { error } = await supabase
      .from("site_stats")
      .upsert(
        { key: "cv_downloads", value: currentCount + 1 },
        { onConflict: "key" }
      );

    if (error) {
      console.error("Erreur Server Action cv_downloads:", error);
      return { success: false };
    }

    return { success: true, count: currentCount + 1 };
  } catch (err) {
    console.error("Erreur incrementCvDownloads:", err);
    return { success: false };
  }
}