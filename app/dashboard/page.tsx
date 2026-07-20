import { 
  getTraficStats, 
  getTopProjects, 
  getUnreadMessagesCount, 
  getCVDownloadCount,
  getTotalViewsCount,
  getTrafficByCountry
} from "@/libs/dashboard-queries";

export default async function AdminDashboardPage() {
  // Chargement en parallèle de TOUTES les statistiques !
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

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-black">Dashboard Analytique</h1>
        <p className="text-sm text-gray-500 mt-1">Vue d'ensemble de l'activité de ton portfolio.</p>
      </div>

      {/* ---------------- 1. Cartes de résumé (KPIs) ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Vues du site */}
        <div className="p-6 bg-white border border-black/10 rounded-xl shadow-sm">
          <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">Total Vues du Site</p>
          <p className="text-3xl font-extrabold text-black mt-2">{totalViews}</p>
        </div>

        {/* Messages non lus */}
        <div className="p-6 bg-white border border-black/10 rounded-xl shadow-sm">
          <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">Messages Non Lus</p>
          <p className="text-3xl font-extrabold text-orange-600 mt-2">{unreadMessages}</p>
        </div>

        {/* Téléchargements CV */}
        <div className="p-6 bg-white border border-black/10 rounded-xl shadow-sm">
          <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">Téléchargements CV</p>
          <p className="text-3xl font-extrabold text-black mt-2">{cvDownloads}</p>
        </div>
      </div>

      {/* ---------------- 2. Grille de métriques détaillées ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* TOP Projets les plus vus */}
        <div className="p-6 bg-white border border-black/10 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold text-black mb-4">Projets les plus vus</h2>
          
          {topProjects && topProjects.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {topProjects.map((project) => (
                <li key={project.id} className="py-3 flex justify-between items-center text-sm">
                  <span className="font-medium text-black">{project.title}</span>
                  <span className="font-bold text-orange-600 px-2.5 py-1 bg-orange-50 rounded-full text-xs">
                    {project.views_count || 0} vues
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 italic">Aucune donnée de vue pour le moment.</p>
          )}
        </div>

        {/* Repartition par Pays */}
        <div className="p-6 bg-white border border-black/10 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold text-black mb-4">Trafic par Pays</h2>
          
          {countryTraffic && countryTraffic.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {countryTraffic.map((item) => (
                <li key={item.country} className="py-3 flex justify-between items-center text-sm">
                  <span className="font-medium text-black">{item.country}</span>
                  <span className="font-bold text-gray-600">
                    {item.total} visite{item.total > 1 ? "s" : ""}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 italic">Aucune visite enregistrée pour le moment.</p>
          )}
        </div>

      </div>
    </div>
  );
}