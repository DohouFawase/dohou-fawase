import { ArrowDownRight, ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="w-full bg-white px-4 py-5 text-black sm:px-6 sm:py-7 lg:px-8 lg:py-9"
    >
      <div className="relative mx-auto flex min-h-[680px] w-full max-w-[1320px] flex-col justify-between overflow-hidden rounded-[1.5rem] border border-orange-600/25 bg-white px-6 py-7 shadow-[0_20px_80px_rgba(0,0,0,0.035)] sm:min-h-[720px] sm:rounded-[2rem] sm:px-10 sm:py-9 lg:min-h-[min(780px,calc(100svh-8rem))] lg:px-12 lg:py-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-600/10 blur-[100px] sm:h-96 sm:w-96"
        />

        <header className="relative z-10 flex items-center justify-between gap-4">
          <a
            href="#"
            className="text-xs font-bold tracking-[0.08em] text-black sm:text-sm"
          >
            DOHOU GBENOUPKO FAWASE
          </a>
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-2 text-[9px] font-semibold tracking-[0.12em] text-black/60 sm:px-4 sm:text-[10px]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-40" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            DISPONIBLE POUR VOS PROJETS
          </div>
        </header>

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center py-14 text-center sm:py-16">
          <p className="mb-5 inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-orange-600 sm:text-xs">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            INGÉNIERIE LOGICIELLE · CRÉATION DE PRODUITS
          </p>
          <h1 className="text-[clamp(3.2rem,9vw,7.5rem)] font-medium leading-[0.92] tracking-[-0.06em] text-black">
            <span className="block">Des produits</span>
            <span className="mt-2 block font-light text-orange-600 sm:mt-3">
              qui font grandir.
            </span>
          </h1>
        </div>

        <div className="relative z-10 flex flex-col gap-7 border-t border-black/10 pt-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10 sm:pt-6">
          <div className="max-w-md">
            <p className="text-xs leading-relaxed text-black/65 sm:text-sm">
              Je transforme vos idées et problèmes complexes en produits web
              et mobiles évolutifs, pensés pour vos utilisateurs et votre
              croissance.
            </p>
            <a
              href="#about"
              className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-black transition-colors hover:text-orange-600"
            >
              En savoir plus
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>

          <a
            href="#projects"
            className="group inline-flex w-fit items-center gap-3 text-xs font-semibold text-black transition-colors hover:text-orange-600"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-600 text-white transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
              <ArrowDownRight className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-[9px] font-bold tracking-[0.15em] text-black/45">
                DÉCOUVRIR
              </span>
              <span className="mt-1 block">Mes projets</span>
            </span>
          </a>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 hidden -translate-y-1/2 -rotate-90 text-[9px] font-bold tracking-[0.18em] text-black/40 lg:block"
        >
          DÉFILER POUR EXPLORER
        </div>
      </div>
    </section>
  );
}
