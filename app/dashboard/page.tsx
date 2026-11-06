import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Eye,
  Globe2,
  Mail,
  MousePointer2,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { TrafficChart, type TrafficPoint } from "@/app/dashboard/components/TrafficChart";
import { DashboardBarChart } from "@/app/dashboard/components/DashboardBarChart";
import {
  getCVDownloadCount,
  getPreviousPeriodViewsCount,
  getRecentMessages,
  getTopProjects,
  getTotalViewsCount,
  getTraficStats,
  getTrafficByCountry,
  getUnreadMessagesCount,
  type TrafficEntry,
} from "@/libs/dashboard-queries";

export const dynamic = "force-dynamic";

function getTrafficChartData(entries: TrafficEntry[], period: string): TrafficPoint[] {
  const now = new Date();

  if (period === "all") {
    const firstMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11, 1));
    const monthlyCounts = new Map<string, number>();

    for (let index = 0; index < 12; index += 1) {
      const month = new Date(Date.UTC(firstMonth.getUTCFullYear(), firstMonth.getUTCMonth() + index, 1));
      monthlyCounts.set(`${month.getUTCFullYear()}-${month.getUTCMonth()}`, 0);
    }

    entries.forEach((entry) => {
      const date = new Date(entry.created_at);
      const monthKey = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
      if (monthlyCounts.has(monthKey)) {
        monthlyCounts.set(monthKey, (monthlyCounts.get(monthKey) ?? 0) + 1);
      }
    });

    return Array.from(monthlyCounts, ([key, value]) => {
      const [year, month] = key.split("-").map(Number);
      const date = new Date(Date.UTC(year, month, 1));
      return {
        label: date.toLocaleDateString("fr-FR", {
          month: "short",
          year: "2-digit",
          timeZone: "UTC",
        }),
        value,
      };
    });
  }

  const bucketSize = period === "24h" ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const bucketCount = period === "24h" ? 24 : period === "7d" ? 7 : 30;
  const startTime = now.getTime() - bucketCount * bucketSize;
  const counts = Array.from({ length: bucketCount }, () => 0);

  entries.forEach((entry) => {
    const bucket = Math.floor((new Date(entry.created_at).getTime() - startTime) / bucketSize);
    if (bucket >= 0 && bucket < bucketCount) counts[bucket] += 1;
  });

  return counts.map((value, index) => {
    const date = new Date(startTime + index * bucketSize);
    const label =
      period === "24h"
        ? date.toLocaleTimeString("fr-FR", { hour: "2-digit", timeZone: "UTC" })
        : date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
            timeZone: "UTC",
          });

    return { label, value };
  });
}

function formatSectionName(name: string) {
  return name.replace(/^\/+/, "").replaceAll("-", " ").replaceAll("_", " ") || "Accueil";
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

interface PageProps {
  searchParams: Promise<{ period?: string; tab?: string }>;
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const requestedPeriod = resolvedParams.period || "all";
  const requestedTab = resolvedParams.tab || "overview";
  const currentTab = requestedTab === "traffic" ? "traffic" : "overview";
  const currentPeriod = ["all", "30d", "7d", "24h"].includes(requestedPeriod)
    ? requestedPeriod
    : "all";

  const [
    traffic,
    topProjects,
    unreadMessages,
    cvDownloads,
    totalViews,
    countryTraffic,
    recentMessages,
    previousViews,
  ] =
    await Promise.all([
      getTraficStats(currentPeriod),
      getTopProjects(),
      getUnreadMessagesCount(),
      getCVDownloadCount(),
      getTotalViewsCount(currentPeriod),
      getTrafficByCountry(currentPeriod),
      getRecentMessages(currentPeriod),
      getPreviousPeriodViewsCount(currentPeriod),
    ]);

  const sectionsList = Object.entries(
    traffic.reduce<Record<string, number>>((counts, entry) => {
      const name = entry.section || entry.path || "Accueil";
      counts[name] = (counts[name] || 0) + 1;
      return counts;
    }, {}),
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  const pagesList = Object.entries(
    traffic.reduce<Record<string, number>>((counts, entry) => {
      const path = entry.path || "/";
      counts[path] = (counts[path] || 0) + 1;
      return counts;
    }, {}),
  )
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const trafficChartData = getTrafficChartData(traffic, currentPeriod);
  const recentLogs = traffic.slice(0, 5);
  const periodLabel =
    currentPeriod === "24h"
      ? "aujourd’hui"
      : currentPeriod === "7d"
        ? "sur 7 jours"
        : currentPeriod === "30d"
          ? "sur 30 jours"
          : "sur tout l’historique";
  const maxPageVisits = Math.max(...pagesList.map((page) => page.count), 1);
  const leadingCountry = countryTraffic[0];
  const leadingSection = sectionsList[0];
  const leadingProject = topProjects[0];
  const trafficChange =
    previousViews !== null && previousViews !== undefined
      ? previousViews === 0
        ? totalViews > 0
          ? null
          : 0
        : Math.round(((totalViews - previousViews) / previousViews) * 100)
      : null;
  const isAudienceView = currentTab === "traffic";

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-4 py-6 text-[#171717] sm:px-6 lg:px-10 lg:py-9">
      <div className="mx-auto max-w-7xl space-y-7">
        <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-700">
              <Sparkles className="h-3.5 w-3.5" />
              Espace portfolio
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {isAudienceView ? "Audience & portée" : "Vue d’ensemble"}
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              {isAudienceView
                ? "Explore les signaux de visite et les contenus qui retiennent l’attention."
                : "Comprends ce qui attire l’attention sur ton portfolio."}
            </p>
          </div>
        </header>

        <section className="relative overflow-hidden rounded-[1.75rem] bg-[#171717] p-6 text-white shadow-xl shadow-black/10 sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-32 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 left-1/3 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-orange-300">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                {isAudienceView ? `Le pouls de ton audience ${periodLabel}` : `Ton activité ${periodLabel}`}
              </p>
              <p className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">
                {totalViews.toLocaleString("fr-FR")}
              </p>
              <p className="mt-2 text-sm text-white/55">
                vues de page enregistrées sur le site
              </p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-2 text-xs">
                {trafficChange !== null && trafficChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-emerald-300" />
                ) : trafficChange !== null && trafficChange < 0 ? (
                  <TrendingDown className="h-4 w-4 text-orange-300" />
                ) : (
                  <Sparkles className="h-4 w-4 text-orange-300" />
                )}
                <span className="text-white/70">
                  {previousViews === null
                    ? "Choisis une période pour comparer"
                    : trafficChange === null
                      ? "Une nouvelle audience se dessine"
                      : trafficChange === 0
                        ? "Activité stable vs période précédente"
                        : `${Math.abs(trafficChange)} % ${
                            trafficChange > 0 ? "de hausse" : "de baisse"
                          } vs période précédente`}
                </span>
                {previousViews !== null && (
                  <span className="text-white/40">
                    · {previousViews.toLocaleString("fr-FR")} avant
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:min-w-72">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <div className="flex items-center gap-2 text-xs text-white/55">
                  <Eye className="h-4 w-4 text-orange-300" />
                  Sections suivies
                </div>
                <p className="mt-3 text-2xl font-semibold">{sectionsList.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <div className="flex items-center gap-2 text-xs text-white/55">
                  <Globe2 className="h-4 w-4 text-orange-300" />
                  Pays détectés
                </div>
                <p className="mt-3 text-2xl font-semibold">{countryTraffic.length}</p>
              </div>
            </div>
          </div>
        </section>

        {isAudienceView && (
          <section
            aria-labelledby="audience-radar-title"
            className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.06] bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-orange-100/70 blur-3xl" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="relative mx-auto grid aspect-square w-full max-w-[19rem] place-items-center">
                <div aria-hidden="true" className="absolute inset-0 rounded-full border border-orange-200/80" />
                <div aria-hidden="true" className="absolute inset-[12%] rounded-full border border-dashed border-orange-300/70" />
                <div aria-hidden="true" className="absolute inset-[25%] rounded-full border border-orange-100 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.12),transparent_68%)]" />
                <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-px w-[88%] -translate-x-1/2 -translate-y-1/2 rotate-[-35deg] bg-gradient-to-r from-transparent via-orange-300/70 to-transparent" />
                <span aria-hidden="true" className="absolute left-[18%] top-[29%] h-2.5 w-2.5 rounded-full bg-orange-500 ring-4 ring-orange-100" />
                <span aria-hidden="true" className="absolute right-[17%] top-[36%] h-2 w-2 rounded-full bg-amber-400 ring-4 ring-amber-100" />
                <span aria-hidden="true" className="absolute bottom-[20%] left-[39%] h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                <div className="relative grid h-28 w-28 place-items-center rounded-full border border-orange-100 bg-white text-center shadow-[0_12px_40px_rgba(234,88,12,0.12)]">
                  <div>
                    <Sparkles className="mx-auto h-4 w-4 text-orange-600" />
                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                      Radar
                    </p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums">
                      {totalViews.toLocaleString("fr-FR")}
                    </p>
                    <p className="text-[9px] text-neutral-400">vues de page</p>
                  </div>
                </div>
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-[#171717] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white">
                  Signaux d’audience
                </span>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-700">
                  Lecture de l’audience
                </p>
                <h2 id="audience-radar-title" className="mt-1 text-2xl font-semibold tracking-tight">
                  Les signaux forts
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  Une lecture rapide des données disponibles {periodLabel}.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-black/[0.06] bg-[#faf9f6] p-4">
                    <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                      <Globe2 className="h-3.5 w-3.5 text-orange-600" />
                      Premier signal géographique
                    </div>
                    <p className="mt-3 truncate text-base font-semibold">
                      {leadingCountry?.country ?? "Pas encore de données"}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {leadingCountry
                        ? `${Number(leadingCountry.total).toLocaleString("fr-FR")} visites · localisation approximative`
                        : "Les pays s’afficheront avec les prochaines visites."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-black/[0.06] bg-[#faf9f6] p-4">
                    <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                      <Eye className="h-3.5 w-3.5 text-orange-600" />
                      Section la plus consultée
                    </div>
                    <p className="mt-3 truncate text-base font-semibold">
                      {leadingSection ? formatSectionName(leadingSection.name) : "Pas encore de données"}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {leadingSection
                        ? `${leadingSection.count.toLocaleString("fr-FR")} consultations`
                        : "Les sections suivies apparaîtront ici."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-black/[0.06] bg-[#faf9f6] p-4">
                    <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                      <MousePointer2 className="h-3.5 w-3.5 text-orange-600" />
                      Projet le plus consulté
                    </div>
                    <p className="mt-3 truncate text-base font-semibold">
                      {leadingProject?.title ?? "Pas encore de données"}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {leadingProject
                        ? `${(leadingProject.views || 0).toLocaleString("fr-FR")} consultations · depuis le lancement`
                        : "Les vues des projets apparaîtront ici."}
                    </p>
                  </div>

                  <Link
                    href="/dashboard/messages"
                    className="group rounded-2xl border border-orange-200 bg-orange-50/70 p-4 transition hover:border-orange-300 hover:bg-orange-50"
                  >
                    <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-orange-700">
                      <Mail className="h-3.5 w-3.5" />
                      Demandes reçues
                    </div>
                    <p className="mt-3 text-base font-semibold text-[#171717]">
                      {recentMessages.total.toLocaleString("fr-FR")}{" "}
                      <span className="text-sm font-medium text-neutral-500">{periodLabel}</span>
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-orange-700">
                      Ouvrir la boîte de réception
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {!isAudienceView && (
        <section aria-label="Indicateurs clés" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <span className="rounded-xl bg-orange-50 p-2.5 text-orange-700">
                <MousePointer2 className="h-4 w-4" />
              </span>
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-medium text-neutral-500">
                {periodLabel}
              </span>
            </div>
            <p className="mt-5 text-3xl font-semibold tracking-tight">
              {traffic.length.toLocaleString("fr-FR")}
            </p>
            <p className="mt-1 text-xs font-medium text-neutral-500">Événements enregistrés</p>
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <span className="rounded-xl bg-rose-50 p-2.5 text-rose-700">
                <Mail className="h-4 w-4" />
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                  unreadMessages > 0
                    ? "bg-rose-50 text-rose-700"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {unreadMessages > 0 ? "À traiter" : "Tout est à jour"}
              </span>
            </div>
            <p className="mt-5 text-3xl font-semibold tracking-tight">{unreadMessages}</p>
            <div className="mt-1 flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-neutral-500">Messages non lus</p>
              <Link
                href="/dashboard/messages"
                className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700 hover:text-orange-800"
              >
                Boîte de réception <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <span className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
                <Mail className="h-4 w-4" />
              </span>
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-medium text-neutral-500">
                {periodLabel}
              </span>
            </div>
            <p className="mt-5 text-3xl font-semibold tracking-tight">
              {recentMessages.total.toLocaleString("fr-FR")}
            </p>
            <div className="mt-1 flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-neutral-500">Demandes reçues</p>
              <Link
                href="/dashboard/messages"
                className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700 hover:text-orange-800"
              >
                Voir <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <span className="rounded-xl bg-violet-50 p-2.5 text-violet-700">
                <ArrowDownToLine className="h-4 w-4" />
              </span>
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-medium text-neutral-500">
                Depuis le lancement
              </span>
            </div>
            <p className="mt-5 text-3xl font-semibold tracking-tight">
              {cvDownloads.toLocaleString("fr-FR")}
            </p>
            <p className="mt-1 text-xs font-medium text-neutral-500">Téléchargements du CV</p>
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <span className="rounded-xl bg-amber-50 p-2.5 text-amber-700">
                <Eye className="h-4 w-4" />
              </span>
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-medium text-neutral-500">
                {periodLabel}
              </span>
            </div>
            <p className="mt-5 truncate text-xl font-semibold capitalize tracking-tight">
              {sectionsList[0] ? formatSectionName(sectionsList[0].name) : "Pas encore de données"}
            </p>
            <p className="mt-1 text-xs font-medium text-neutral-500">
              {sectionsList[0]
                ? `${sectionsList[0].count.toLocaleString("fr-FR")} consultations · section populaire`
                : "La section la plus consultée apparaîtra ici"}
            </p>
          </div>
        </section>
        )}

        <section className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-700">
                Tendance
              </p>
              <h2 className="mt-1 text-lg font-semibold">L’activité de ton portfolio</h2>
              <p className="mt-1 text-xs text-neutral-500">
                Événements par {currentPeriod === "24h" ? "heure" : currentPeriod === "all" ? "mois" : "jour"}
                {currentPeriod === "all" ? " · 12 derniers mois" : ""}
              </p>
            </div>
            <span className="text-xs text-neutral-400">
              {traffic.length.toLocaleString("fr-FR")} événements dans cette période
            </span>
          </div>
          <TrafficChart data={trafficChartData} />
        </section>

        {!isAudienceView && <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-700">
                  Ce qui retient l’attention
                </p>
                <h2 className="mt-1 text-lg font-semibold">Projets les plus consultés</h2>
                <p className="mt-1 text-xs text-neutral-500">Classement depuis le lancement du site</p>
              </div>
              <Link
                href="/dashboard/projects"
                aria-label="Gérer les projets"
                className="rounded-xl border border-black/[0.07] p-2 text-neutral-400 transition hover:bg-neutral-50 hover:text-black"
              >
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            {topProjects.length > 0 ? (
              <DashboardBarChart
                label="Graphique des consultations par projet"
                data={topProjects.map((project) => ({
                  label: project.title,
                  value: project.views || 0,
                }))}
              />
            ) : (
              <p className="rounded-xl bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-400">
                Les consultations des projets apparaîtront ici.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-700">
                Portée géographique
              </p>
              <h2 className="mt-1 text-lg font-semibold">Pays d’origine</h2>
              <p className="mt-1 text-xs text-neutral-500">Localisation approximative, si disponible</p>
            </div>
            <DashboardBarChart
              label="Graphique des consultations par pays"
              color="dark"
              data={countryTraffic.slice(0, 6).map((country) => ({
                label: country.country,
                value: Number(country.total) || 0,
              }))}
            />
          </div>
        </section>}

        {!isAudienceView && <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-700">
                Parcours de navigation
              </p>
              <h2 className="mt-1 text-lg font-semibold">Pages les plus actives</h2>
            </div>
            {pagesList.length > 0 ? (
              <div className="space-y-4">
                {pagesList.map((page) => (
                  <div key={page.path} className="space-y-2">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="truncate font-medium">{page.path === "/" ? "Accueil" : page.path}</span>
                      <span className="shrink-0 tabular-nums text-neutral-500">
                        {page.count.toLocaleString("fr-FR")}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full rounded-full bg-orange-500"
                        style={{ width: `${Math.round((page.count / maxPageVisits) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-400">Aucune page consultée sur cette période.</p>
            )}

            {sectionsList.length > 0 && (
              <div className="mt-7 border-t border-neutral-100 pt-5">
                <p className="mb-3 text-xs font-semibold text-neutral-500">Sections les plus consultées</p>
                <div className="flex flex-wrap gap-2">
                  {sectionsList.slice(0, 5).map((section) => (
                    <span
                      key={section.name}
                      className="rounded-full bg-neutral-100 px-3 py-1.5 text-[11px] font-medium capitalize text-neutral-600"
                    >
                      {formatSectionName(section.name)}
                      <span className="ml-1.5 text-neutral-400">{section.count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-700">
                  Prospects
                </p>
                <h2 className="mt-1 text-lg font-semibold">Demandes récentes</h2>
              </div>
              <Link
                href="/dashboard/messages"
                className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-medium text-orange-700 transition hover:bg-orange-100"
              >
                Boîte de réception <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            {recentMessages.messages.length > 0 ? (
              <ol className="space-y-4">
                {recentMessages.messages.map((message) => (
                  <li key={message.id} className="flex gap-3">
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ring-4 ${
                        message.is_read
                          ? "bg-neutral-300 ring-neutral-100"
                          : "bg-orange-500 ring-orange-50"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <Link
                        href="/dashboard/messages"
                        className="block truncate text-xs font-semibold hover:text-orange-700"
                      >
                        {message.subject || "Demande sans objet"}
                      </Link>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-neutral-400">
                        <span className="max-w-[14rem] truncate">{message.email}</span>
                        <span aria-hidden="true">·</span>
                        <span>{formatDate(message.created_at)}</span>
                        {!message.is_read && (
                          <span className="rounded-full bg-orange-50 px-2 py-0.5 font-medium text-orange-700">
                            À lire
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-neutral-400">
                Aucune demande reçue {periodLabel}.
              </p>
            )}
          </div>
        </section>}

        {isAudienceView && (
          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-700">
                  Parcours de navigation
                </p>
                <h2 className="mt-1 text-lg font-semibold">Pages les plus actives</h2>
              </div>
              {pagesList.length > 0 ? (
                <div className="space-y-4">
                  {pagesList.map((page) => (
                    <div key={page.path} className="space-y-2">
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="truncate font-medium">{page.path === "/" ? "Accueil" : page.path}</span>
                        <span className="shrink-0 tabular-nums text-neutral-500">
                          {page.count.toLocaleString("fr-FR")}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                        <div
                          className="h-full rounded-full bg-orange-500"
                          style={{ width: `${Math.round((page.count / maxPageVisits) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-400">Aucune page consultée sur cette période.</p>
              )}
            </div>

            <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-700">
                  Fil d’activité
                </p>
                <h2 className="mt-1 text-lg font-semibold">Dernières visites enregistrées</h2>
              </div>
              {recentLogs.length > 0 ? (
                <ol className="space-y-4">
                  {recentLogs.map((entry, index) => (
                    <li key={`${entry.created_at}-${index}`} className="flex gap-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-400 ring-4 ring-orange-50" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium">
                          {formatSectionName(entry.section || entry.path || "Accueil")}
                        </p>
                        <p className="mt-1 text-[11px] text-neutral-400">
                          {entry.country || "Pays inconnu"} · {formatDate(entry.created_at)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-neutral-400">Aucune visite enregistrée sur cette période.</p>
              )}
            </div>
          </section>
        )}

        {!isAudienceView && <aside className="flex flex-col justify-between gap-4 rounded-2xl border border-orange-100 bg-orange-50/80 p-5 sm:flex-row sm:items-center sm:px-7">
          <div>
            <p className="text-sm font-semibold">Une personne veut te contacter ?</p>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-neutral-600">
              Les coordonnées ne sont disponibles que si un visiteur les partage dans ton formulaire.
              Consulte ses demandes et choisis toi-même si tu souhaites lui répondre.
            </p>
          </div>
          <Link
            href="/dashboard/messages"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#171717] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-orange-700"
          >
            Voir les messages <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </aside>}

        <p className="pb-2 text-center text-[11px] text-neutral-400">
          Statistiques agrégées : ce tableau de bord ne révèle pas l’identité ni les coordonnées des visiteurs.
        </p>
      </div>
    </main>
  );
}
