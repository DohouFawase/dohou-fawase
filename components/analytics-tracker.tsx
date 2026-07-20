"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedSection = useRef<string | null>(null);

  // 1. Tracking des changements de page (Pathname)
  useEffect(() => {
    const trackPageView = async () => {
      try {
        await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            path: pathname,
            section: pathname === "/" ? "hero" : pathname.replace("/", "")
          }),
        });
      } catch (err) {
        console.error("Erreur tracking page:", err);
      }
    };

    trackPageView();
  }, [pathname]);

  // 2. Tracking des sections au Scroll (uniquement sur les pages avec sections, comme la landing page)
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;

            if (lastTrackedSection.current !== sectionId) {
              lastTrackedSection.current = sectionId;

              fetch("/api/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  path: pathname,
                  section: sectionId,
                }),
              }).catch(() => {});
            }
          }
        });
      },
      { threshold: 0.5 } // Déclenche quand 50% de la section est visible
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}