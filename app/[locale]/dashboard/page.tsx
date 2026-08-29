/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { 
  getTraficStats, 
  getTopProjects, 
  getUnreadMessagesCount, 
  getCVDownloadCount,
  getTotalViewsCount,
  getTrafficByCountry
} from "@/libs/dashboard-queries";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentPeriod = resolvedParams.period || "all";

  // Chargement en parallèle des statistiques
  const [
    trafic, 
    topProjects, 
    unreadMessages, 
    cvDownloads, 
    totalViews, 
    countryTraffic
  ] = await Promise.all([
    getTraficStats(),
    getTopProjects(),
    getUnreadMessagesCount(),
    getCVDownloadCount(),
    getTotalViewsCount(),
    getTrafficByCountry(),
  ]);

  // Max pour les calculs de barres (Utilisation de .views au lieu de .views_count)
  const maxProjectViews = topProjects && topProjects.length > 0 
    ? Math.max(...topProjects.map((p) => p.views || 0), 1) 
    : 1;

  const maxCountryVisits = countryTraffic && countryTraffic.length > 0
    ? Math.max(...countryTraffic.map((c) => Number(c.total) || 0), 1)
    : 1;

  // Calcul des sections
  const sectionsData = (trafic || []).reduce((acc: Record<string, number>, item: any) => {
    const key = item.section || item.path || "Accueil (Hero)";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const sectionsList = Object.entries(sectionsData)
    .map(([name, count]) => ({ name, count: Number(count) }))
    .sort((a, b) => b.count - a.count);

  const maxSectionVisits = sectionsList.length > 0 
    ? Math.max(...sectionsList.map((s) => s.count), 1) 
    : 1;

  // Simulation des dernières activités à partir du trafic récent
  const recentLogs = (trafic || []).slice(0, 5);

  return (
    <div className="p-8 space-y-8 bg-amber-50 min-h-screen">
      {/* ---------------- EN-TÊTE + FILTRE CHRONO ---------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Dashboard Analytique</h1>
          <p className="text-sm text-gray-500 mt-1">Vue d'ensemble de l'activité de ton portfolio.</p>
        </div>

        {/* Filtres Temporels */}
        <div className="inline-flex p-1 bg-gray-100 rounded-lg text-xs font-semibold">
          {[
            { label: "Tout", value: "all" },
            { label: "30 jours", value: "30d" },
            { label: "7 jours", value: "7d" },
            { label: "Aujourd'hui", value: "24h" },
          ].map((period) => (
            <Link
              key={period.value}
              href={`/dashboard?period=${period.value}`}
              className={`px-3 py-1.5 rounded-md transition-all ${
                currentPeriod === period.value
                  ? "bg-white text-black shadow-sm font-bold"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {period.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ---------------- 1. Cartes KPI ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Total Vues du site */}
        <div className="p-6 bg-white border border-black/10 rounded-xl shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">Total Vues du Site</p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
              En hausse
            </span>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-black">{totalViews}</p>
            <p className="text-xs text-gray-400 mt-1">Visites enregistrées sur le site</p>
          </div>
        </div>

        {/* Messages non lus + Bouton rapide */}
        <div className="p-6 bg-white border border-black/10 rounded-xl shadow-sm space-y-3 relative group">
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">Messages Non Lus</p>
            {unreadMessages > 0 ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
                À traiter
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                À jour
              </span>
            )}
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-3xl font-extrabold text-orange-600">{unreadMessages}</p>
              <p className="text-xs text-gray-400 mt-1">
                {unreadMessages === 0 ? "Aucune nouvelle demande" : `${unreadMessages} message(s) en attente`}
              </p>
            </div>
            <Link 
              href="/dashboard/messages" 
              className="text-xs font-bold text-black underline hover:text-orange-600 transition-colors"
            >
              Voir la boîte →
            </Link>
          </div>
        </div>

        {/* Téléchargements CV */}
        <div className="p-6 bg-white border border-black/10 rounded-xl shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">Téléchargements CV</p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
              Actif
            </span>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-black">{cvDownloads}</p>
            <p className="text-xs text-gray-400 mt-1">Intérêt direct des recruteurs</p>
          </div>
        </div>

      </div>

      {/* ---------------- 2. Grille Intermédiaire (Projets & Pays) ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Projets les plus vus */}
        <div className="p-6 bg-white border border-black/10 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold text-black mb-6">Projets les plus vus</h2>
          
          {topProjects && topProjects.length > 0 ? (
            <div className="space-y-5">
              {topProjects.map((project) => {
                const views = project.views || 0; // 👈 Correctement mappé ici
                const percentage = Math.round((views / maxProjectViews) * 100);

                return (
                  <div key={project.id} className="space-y-1.5">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-black truncate max-w-[200px] sm:max-w-[280px]">
                        {project.title}
                      </span>
                      <span className="text-xs font-bold text-orange-600 px-2 py-0.5 bg-orange-50 rounded-md">
                        {views} vue{views > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-orange-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">Aucune donnée de vue pour le moment.</p>
          )}
        </div>

        {/* Trafic par Pays */}
        <div className="p-6 bg-white border border-black/10 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold text-black mb-6">Trafic par Pays</h2>
          
          {countryTraffic && countryTraffic.length > 0 ? (
            <div className="space-y-5">
              {countryTraffic.map((item) => {
                const total = Number(item.total) || 0;
                const percentage = Math.round((total / maxCountryVisits) * 100);

                return (
                  <div key={item.country} className="space-y-1.5">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-black">{item.country}</span>
                      <span className="text-xs font-semibold text-gray-600">
                        {total} visite{total > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-black h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">Aucune visite enregistrée pour le moment.</p>
          )}
        </div>

      </div>

      {/* ---------------- 3. SECTION BAS : GRAPH + LIVE LOG ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Graphique des sections */}
        <div className="lg:col-span-2 p-6 bg-white border border-black/10 rounded-xl shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-black">Analyse Globale des Sections</h2>
              <p className="text-xs text-gray-500">Comportement de navigation des visiteurs.</p>
            </div>
            <span className="text-xs font-bold text-black px-2.5 py-1 bg-gray-100 rounded-md">
              {sectionsList.length} sections
            </span>
          </div>

          {sectionsList.length > 0 ? (
            <div className="space-y-5">
              {sectionsList.map((sec) => {
                const pct = Math.round((sec.count / maxSectionVisits) * 100);
                return (
                  <div key={sec.name} className="space-y-1.5">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-black capitalize">{sec.name.replace("/", "").replace("-", " ") || "Page Principale"}</span>
                      <span className="text-xs font-extrabold text-black">
                        {sec.count} vue{sec.count > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden p-0.5">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-black h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">Aucune donnée disponible.</p>
          )}
        </div>

        {/* Live Activity Feed */}
        <div className="p-6 bg-white border border-black/10 rounded-xl shadow-sm space-y-6">
          <div className="pb-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-black">Activité Récente</h2>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          {recentLogs.length > 0 ? (
            <div className="space-y-4">
              {recentLogs.map((log: any, idx: number) => (
                <div key={idx} className="flex gap-3 items-start text-xs">
                  <div className="p-1.5 rounded-full bg-orange-50 text-orange-600 mt-0.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <p className="font-semibold text-black">
                      Visite sur <span className="text-orange-600">{log.section || log.path || "Accueil"}</span>
                    </p>
                    <p className="text-gray-400">
                      {log.country ? `Depuis ${log.country}` : "Origine inconnue"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">Aucune activité récente.</p>
          )}
        </div>

      </div>
    </div>
  );
}