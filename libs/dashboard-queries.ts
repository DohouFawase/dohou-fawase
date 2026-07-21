import { createClient } from "@/utils/supabase/server";

// Helper interne pour calculer le filtre de date selon le paramètre 'period'
function getStartDateISO(period?: string): string | null {
  const now = new Date();
  if (period === "24h") {
    now.setHours(now.getHours() - 24);
    return now.toISOString();
  }
  if (period === "7d") {
    now.setDate(now.getDate() - 7);
    return now.toISOString();
  }
  if (period === "30d") {
    now.setDate(now.getDate() - 30);
    return now.toISOString();
  }
  return null; // Si 'all' ou non défini
}

// 1. Nombre total de téléchargements du CV
export async function getCVDownloadCount() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_stats")
    .select("value")
    .eq("key", "cv_downloads")
    .maybeSingle();

  if (error) {
    console.error("Erreur getCVDownloadCount:", error);
    return 0;
  }

  return data?.value ?? 0;
}

// 2. Statistiques de trafic avec détail (Supporte le filtre de période)
export async function getTraficStats(period?: string) {
  const supabase = await createClient();
  const startDate = getStartDateISO(period);

  let query = supabase
    .from("page_views")
    .select("created_at, country, path, section")
    .order("created_at", { ascending: false });

  if (startDate) {
    query = query.gte("created_at", startDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erreur getTraficStats:", error);
    return [];
  }

  return data || [];
}

// 3. Nombre de messages non lus
export async function getUnreadMessagesCount() {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);

  if (error) {
    console.error("Erreur getUnreadMessagesCount:", error);
    return 0;
  }

  return count || 0;
}

// 4. Projets les plus vus (Top 5)
export async function getTopProjects() {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, title, views, image_url") // 👈 'views' au lieu de 'views_count'
    .order("views", { ascending: false })    // 👈 Tri mis à jour
    .limit(5);

  if (error) {
    console.error("Erreur getTopProjects:", error);
    return [];
  }

  return projects || [];
}

// 5. Total des vues globales sur le site (Filtrable par période)
export async function getTotalViewsCount(period?: string) {
  const supabase = await createClient();
  const startDate = getStartDateISO(period);

  let query = supabase
    .from("page_views")
    .select("*", { count: "exact", head: true });

  if (startDate) {
    query = query.gte("created_at", startDate);
  }

  const { count, error } = await query;

  if (error) {
    console.error("Erreur getTotalViewsCount:", error);
    return 0;
  }

  return count || 0;
}

// 6. Répartition du trafic PAR PAYS (Filtrable par période)
export async function getTrafficByCountry(period?: string) {
  const supabase = await createClient();
  const startDate = getStartDateISO(period);

  // Tentative via la procédure stockée RPC si elle supporte le paramètre
  const { data: rpcData, error: rpcError } = await supabase.rpc(
    "get_traffic_by_country",
    startDate ? { start_date: startDate } : {}
  );

  if (!rpcError && rpcData) {
    return rpcData as { country: string; total: number }[];
  }

  // Fallback direct sur la table page_views si la fonction RPC est classique
  let query = supabase.from("page_views").select("country");
  if (startDate) {
    query = query.gte("created_at", startDate);
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error("Erreur récupération pays:", error);
    return [];
  }

  // Agrégation JS par pays
  const countryCounts: Record<string, number> = {};
  data.forEach((row) => {
    const country = row.country || "Inconnu";
    countryCounts[country] = (countryCounts[country] || 0) + 1;
  });

  return Object.entries(countryCounts)
    .map(([country, total]) => ({ country, total }))
    .sort((a, b) => b.total - a.total);
}

// 7. Fonction d'incrémentation d'un projet (Client side)
export const handleViewProject = async (projectId: string) => {
  const { createClient: createClientWeb } = await import("@/utils/supabase/client");
  const supabase = createClientWeb();
  await supabase.rpc("increment_project_views", { project_id: projectId });
};