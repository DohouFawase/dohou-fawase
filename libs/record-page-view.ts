import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function recordPageView(path: string, section?: string) {
  const headerList = await headers();

  const country = 
    headerList.get("x-vercel-ip-country") || 
    headerList.get("cf-ipcountry") || 
    "Inconnu";

  const supabase = await createClient();
  await supabase.from("page_views").insert({
    path,
    section: section || path,
    country: country === "BJ" ? "Bénin" : country,
  });
}