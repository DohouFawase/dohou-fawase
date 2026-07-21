"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart2,
  FolderKanban,
  Wrench,
  Briefcase,
  Mail,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  Calendar,
} from "lucide-react";

interface DashboardNavbarProps {
  unreadCount?: number;
}

export function DashboardNavbar({ unreadCount = 0 }: DashboardNavbarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentTab = searchParams.get("tab") || "overview";
  const currentPeriod = searchParams.get("period") || "all";

  // Navigation principale (Dashboard + Gestion CMS)
  const navTabs = [
    {
      id: "overview",
      label: "Vue Générale",
      icon: LayoutDashboard,
      href: `/dashboard/?tab=overview&period=${currentPeriod}`,
      isTab: true,
    },
    {
      id: "traffic",
      label: "Audience",
      icon: BarChart2,
      href: `/dashboard/?tab=traffic&period=${currentPeriod}`,
      isTab: true,
    },
    {
      id: "projects",
      label: "Projets",
      icon: FolderKanban,
      href: "/dashboard/projects",
      isTab: false,
    },
    {
      id: "skills",
      label: "Compétences",
      icon: Wrench,
      href: "/dashboard/skills",
      isTab: false,
    },
    {
      id: "experiences",
      label: "Expériences",
      icon: Briefcase,
      href: "/dashboard/experiences",
      isTab: false,
    },
  ];

  // Périodes temporelles pour le Dashboard
  const periods = [
    { label: "Tout", value: "all" },
    { label: "30j", value: "30d" },
    { label: "7j", value: "7d" },
    { label: "24h", value: "24h" },
  ];

  const isDashboardPage = pathname === "/dashboard/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* LOGO BRAND */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 text-black font-extrabold text-lg tracking-tight hover:opacity-80 transition-opacity"
            >
              <div className="p-2 bg-black text-white rounded-xl shadow-sm">
                <Sparkles className="w-4 h-4 text-orange-500" />
              </div>
              <span>Admin<span className="text-orange-600">.</span></span>
            </Link>
          </div>

          {/* DESKTOP NAVIGATION (ONGLÉTS & SESSIONS) */}
          <nav className="hidden lg:flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl border border-gray-200/60">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              
              // Vérifie si l'onglet est actif (route ou paramètre tab)
              const isActive = tab.isTab
                ? isDashboardPage && currentTab === tab.id
                : pathname.startsWith(tab.href);

              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-white text-black shadow-sm font-bold"
                      : "text-gray-600 hover:text-black hover:bg-white/50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-orange-600" : "text-gray-400"}`} />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ACTIONS / MESSAGE / PÉRIODE */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Filtre Période (Visible uniquement sur la page dashboard) */}
            {isDashboardPage && (
              <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1 text-xs">
                <Calendar className="w-3.5 h-3.5 text-gray-400 ml-1" />
                {periods.map((p) => (
                  <Link
                    key={p.value}
                    href={`/admin/dashboard?tab=${currentTab}&period=${p.value}`}
                    className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                      currentPeriod === p.value
                        ? "bg-black text-white font-bold"
                        : "text-gray-500 hover:text-black"
                    }`}
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            )}

            {isDashboardPage && <div className="h-4 w-[1px] bg-gray-200" />}

            {/* Boîte de Réception / Messages */}
            <Link
              href="/dashboard/messages"
              className={`relative p-2 rounded-lg transition-colors ${
                pathname.startsWith("/dashboard/messages")
                  ? "bg-black text-white"
                  : "text-gray-600 hover:text-black hover:bg-gray-100"
              }`}
              title="Messages"
            >
              <Mail className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-600"></span>
                </span>
              )}
            </Link>

            {/* Voir le Site Public */}
            <Link
              href="https://dohou-fawase.vercel.app/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-black hover:text-white rounded-lg transition-all"
            >
              <span>Voir le site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* BOUTON MENU MOBILE */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/dashboard/messages"
              className="relative p-2 text-gray-700 bg-gray-100 rounded-lg"
            >
              <Mail className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-orange-600" />
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:text-black"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* MENU MOBILE DÉROULANT */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-gray-200 bg-white px-4 pt-2 pb-6 space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase px-2 mb-2">
              Menu Admin
            </p>
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.isTab
                ? isDashboardPage && currentTab === tab.id
                : pathname.startsWith(tab.href);

              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-black text-white font-bold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Filtre de Période sur Mobile */}
          {isDashboardPage && (
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase px-2">
                Période
              </p>
              <div className="grid grid-cols-4 gap-1">
                {periods.map((p) => (
                  <Link
                    key={p.value}
                    href={`/admin/dashboard?tab=${currentTab}&period=${p.value}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-center py-1.5 rounded-md text-xs font-semibold ${
                      currentPeriod === p.value
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-gray-100">
            <Link
              href="https://dohou-fawase.vercel.app/"
              target="_blank"
              className="flex items-center justify-center gap-2 w-full py-2 bg-gray-100 text-black text-xs font-bold rounded-lg"
            >
              <span>Voir le site public</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}