"use client";

import { createClient } from "@/utils/supabase/client";
import { useTranslations } from "next-intl";

const CV_FILE_PATH = "/resumen/fawase_dohou.pdf";
const CV_DOWNLOAD_NAME = "CV_DOHOU_Fawase.pdf";

export default function About() {
  const t = useTranslations("About");

  const SERVICES = [
    { n: "01", title: t("services.design.title"), desc: t("services.design.desc") },
    { n: "02", title: t("services.dev.title"), desc: t("services.dev.desc") },
    { n: "03", title: t("services.branding.title"), desc: t("services.branding.desc") },
    { n: "04", title: t("services.architecture.title"), desc: t("services.architecture.desc") },
  ];

  const FACTS = [
    { label: t("facts.focus.label"), value: t("facts.focus.value") },
    { label: t("facts.shipped.label"), value: t("facts.shipped.value") },
    { label: t("facts.experience.label"), value: t("facts.experience.value") },
    { label: t("facts.availableFor.label"), value: t("facts.availableFor.value") },
  ];

  const handleDownloadCV = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    try {
      const supabase = createClient();
      supabase.rpc("increment_cv_downloads").then(({ error }) => {
        if (error) console.error("Erreur RPC CV:", error);
      });
    } catch (error) {
      console.error("Erreur lors de l'incrémentation du compteur CV:", error);
    }

    const link = document.createElement("a");
    link.href = CV_FILE_PATH;
    link.download = CV_DOWNLOAD_NAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="w-full bg-white text-black" id="about">
      <div className="mx-auto container px-6 pt-14 pb-24 sm:px-10 lg:px-16">
        <div className="mb-10 inline-flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-600/40 text-[11px] font-bold text-orange-600">
            01
          </span>
          <span className="text-[11px] font-semibold tracking-widest text-black/40">
            {t("eyebrow")}
          </span>
        </div>

        <h2 className="max-w-4xl text-[2.4rem] font-extrabold leading-[1.1] tracking-tight text-black sm:text-5xl">
          {t("headlineLine1")}
        </h2>
        <p className="mt-1 max-w-4xl font-serif text-[2.4rem] italic leading-[1.1] text-orange-600 sm:text-5xl">
          {t("headlineLine2")}
        </p>

        <div className="mt-14 grid grid-cols-1 gap-16 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <div className="space-y-6 text-[15px] leading-relaxed text-black/65">
              <p>
                {t.rich("bioP1", {
                  name: (chunks) => (
                    <span className="font-bold text-black">{chunks}</span>
                  ),
                })}
              </p>
              <p>{t("bioP2")}</p>
              <p>{t("bioP3")}</p>
            </div>

            <div className="mt-8">
             <a
                href={CV_FILE_PATH}
                onClick={handleDownloadCV}
                className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-[12px] font-bold tracking-widest text-white transition hover:bg-black/85"
              >
                {t("downloadCV")} <span>↓</span>
              </a>
            </div>

            <div className="mt-10 grid grid-cols-2 border border-black/10">
              {FACTS.map((fact, i) => (
                <div
                  key={fact.label}
                  className={[
                    "px-6 py-5",
                    i % 2 === 0 ? "border-r border-black/10" : "",
                    i < 2 ? "border-b border-black/10" : "",
                  ].join(" ")}
                >
                  <div className="text-[10px] font-semibold tracking-widest text-black/40">
                    {fact.label}
                  </div>
                  <div className="mt-2 text-[15px] font-bold text-black">
                    {fact.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 text-[11px] font-semibold tracking-widest text-black/40">
              {t("servicesEyebrow")}
            </div>
            <div className="space-y-4">
              {SERVICES.map((s) => (
                <div
                  key={s.n}
                  className="rounded-2xl border border-black/10 bg-black/1.5 p-6 transition hover:border-black/20"
                >
                  <div className="text-[11px] font-bold text-orange-600">
                    {s.n}
                  </div>
                  <h3 className="mt-1 text-lg font-bold text-black">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-black/55">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}