import { 
  getTraficStats, 
  getTopProjects, 
  getUnreadMessagesCount, 
  getCVDownloadCount,
  getTotalViewsCount,
  getTrafficByCountry
} from "@/libs/dashboard-queries";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
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

  // Max pour les projets
  const maxProjectViews = topProjects && topProjects.length > 0 
    ? Math.max(...topProjects.map((p) => p.views_count || 0), 1) 
    : 1;

  // Max pour le trafic par pays
  const maxCountryVisits = countryTraffic && countryTraffic.length > 0
    ? Math.max(...countryTraffic.map((c) => Number(c.total) || 0), 1)
    : 1;

  // Extraction / Préparation des sections les plus visitées (sur la base de trafic)
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

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-black">Dashboard Analytique</h1>
        <p className="text-sm text-gray-500 mt-1">Vue d'ensemble de l'activité globale de ton portfolio.</p>
      </div>

      {/* ---------------- 1. Cartes KPI de résumé ---------------- */}
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
            <p className="text-xs text-gray-400 mt-1">Trafic global accumulé</p>
          </div>
        </div>

        {/* Messages non lus */}
        <div className="p-6 bg-white border border-black/10 rounded-xl shadow-sm space-y-3">
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
          <div>
            <p className="text-3xl font-extrabold text-orange-600">{unreadMessages}</p>
            <p className="text-xs text-gray-400 mt-1">
              {unreadMessages === 0 ? "Aucun nouveau message" : `${unreadMessages} demande${unreadMessages > 1 ? 's' : ''} en attente`}
            </p>
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
            <p className="text-xs text-gray-400 mt-1">Téléchargements totaux</p>
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
                const views = project.views_count || 0;
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

      {/* ---------------- 3. GRAND GRAPHIQUE GLOBAL EN BAS ---------------- */}
      <div className="p-8 bg-white border border-black/10 rounded-xl shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-black">Analyse Globale des Sections du Site</h2>
            <p className="text-xs text-gray-500">Visualisation de l'attention accordée à chaque partie du portfolio (SPA / Navigation).</p>
          </div>
          <span className="text-xs font-bold text-black px-3 py-1 bg-gray-100 rounded-full">
            {sectionsList.length} sections suivies
          </span>
        </div>

        {sectionsList.length > 0 ? (
          <div className="space-y-6 pt-2">
            {sectionsList.map((sec) => {
              const pct = Math.round((sec.count / maxSectionVisits) * 100);
              const shareOfTotal = totalViews > 0 ? Math.round((sec.count / totalViews) * 100) : 0;

              return (
                <div key={sec.name} className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
                      <span className="text-black capitalize">{sec.name.replace("/", "").replace("-", " ") || "Page Principale"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 font-normal">~{shareOfTotal}% du trafic</span>
                      <span className="text-xs font-extrabold text-black px-2.5 py-1 bg-gray-100 rounded-md">
                        {sec.count} vue{sec.count > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Grande barre de jauge réactive */}
                  <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden p-0.5">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-black h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center space-y-2">
            <p className="text-sm text-gray-400 italic">Aucune donnée de section enregistrée pour le moment.</p>
            <p className="text-xs text-gray-400">Les données s'afficheront dès que des visiteurs parcourront le site.</p>
          </div>
        )}
      </div>

    </div>
  );
}