"use client";

import { useTranslations } from "next-intl";

export default function Principles() {
  const t = useTranslations("Principles");

  const PRINCIPLES = [
    { n: "01", title: t("items.feel.title"), desc: t("items.feel.desc") },
    { n: "02", title: t("items.ship.title"), desc: t("items.ship.desc") },
    { n: "03", title: t("items.document.title"), desc: t("items.document.desc") },
    { n: "04", title: t("items.stack.title"), desc: t("items.stack.desc") },
  ];

  return (
    <section className="w-full bg-white text-black">
      <div className="mx-auto container  px-6 pt-14 pb-24 sm:px-10 lg:px-16">
        <div className="mb-10 inline-flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-600/40 text-[11px] font-bold text-orange-600">
            06
          </span>
          <span className="text-[11px] font-semibold tracking-widest text-black/40">
            {t("eyebrow")}
          </span>
        </div>

        <h2 className="max-w-4xl text-[2.4rem] font-extrabold leading-[1.1] tracking-tight text-black sm:text-5xl">
          {t("headlinePrefix")}{" "}
          <span className="font-serif italic text-orange-600">
            {t("headlineHighlight")}
          </span>
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <div
              key={p.n}
              className="rounded-2xl border border-black/10 bg-black/1.5 p-8"
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-orange-600">
                  {p.n}
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-black/35">
                  {t("badge")}
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-bold text-black">
                {p.title}
              </h3>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-black/60">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}