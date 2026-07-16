"use client";

import { useEffect, useState } from "react";

const FOOTER_LINKS = [
    { label: "TWITTER", href: "https://x.com/omo_iya_oniRice" },
    { label: "GITHUB", href: "https://github.com/DohouFawase" }, // Ton profil GitHub mis à jour
    { label: "LINKEDIN", href: "https://linkedin.com/in/dohou-fawase" },
    { label: "WHATSAPP", href: "https://wa.me/+2290197395756" },
];

export default function CtaFooter() {
    const [currentYear, setCurrentYear] = useState(2026);

    // Évite les bugs d'hydratation en mettant à jour l'année côté client uniquement
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentYear(new Date().getFullYear());
    }, []);

    return (
        <section className="w-full bg-white text-black">
            <div className="mx-auto container px-6 pb-10 py-14 sm:px-10 lg:px-16">
                {/* ---------------- BANNIÈRE D'APPEL À L'ACTION ---------------- */}
                <div className="rounded-3xl border border-black/10 px-6 py-16 text-center sm:px-16">
                    <p className="text-[11px] font-semibold tracking-widest text-orange-600">
                        CONSTRUISONS QUELQUE CHOSE ENSEMBLE
                    </p>
                    <h2 className="mx-auto mt-4 max-w-2xl text-[2.1rem] font-extrabold leading-tight tracking-tight text-black sm:text-4xl">
                        Vous avez un produit en tête ? Je peux vous aider à le concevoir et le livrer.
                    </h2>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                        <button className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-6 py-3 text-[12px] font-bold tracking-widest text-white transition hover:bg-orange-500">
                            LANCER UN PROJET →
                        </button>
                        <button className="inline-flex items-center gap-2 rounded-full border border-black/15 px-6 py-3 text-[12px] font-bold tracking-widest text-black transition hover:bg-black/5">
                            DISCUTER SUR WHATSAPP
                        </button>
                    </div>
                </div>

                {/* ---------------- PIED DE PAGE ---------------- */}
                <footer className="mt-14">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="text-2xl font-extrabold text-black">
                                OMO iya oniRice
                                <span className="text-orange-600">.</span>
                            </div>
                            <p className="mt-1 text-[11px] font-semibold tracking-widest text-black/40">
                                INGÉNIEUR LOGICIEL · DU DESIGN AU DÉVELOPPEMENT
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-6">
                            {FOOTER_LINKS.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] font-semibold tracking-widest text-black/50 transition hover:text-black"
                                >
                                    {link.label} ↗
                                </a>
                            ))}
                        </div>

                        <a
                            href="#top"
                            className="text-[11px] font-semibold tracking-widest text-black/50 transition hover:text-black"
                        >
                            ↑ RETOUR EN HAUT
                        </a>
                    </div>

                    <div className="mt-8 flex flex-col gap-2 border-t border-black/10 py-6 text-[11px] font-semibold tracking-widest text-black/35 sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            © {currentYear} GBENOUPKO FAWASE DOHOu · OMO IYA ONIRICE. TOUS DROITS RÉSERVÉS.
                        </p>
                        <p>CONSTRUIT AVEC NEXT.JS · BÉNIN</p>
                    </div>
                </footer>
            </div>
        </section>
    );
}