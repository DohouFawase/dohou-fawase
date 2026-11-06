"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const INTRO_DURATION = 2200;
const EXIT_DURATION = 500;

export default function TerminalLoader() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const timers = useRef<number[]>([]);
  const previousOverflow = useRef("");

  useEffect(() => {
    const effectTimers = timers.current;
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    effectTimers.push(window.setTimeout(() => setIsVisible(true), 0));
    const closeIntro = () => {
      setIsExiting(true);
      effectTimers.push(
        window.setTimeout(() => {
          setIsVisible(false);
          document.body.style.overflow = previousOverflow.current;
        }, EXIT_DURATION),
      );
    };

    effectTimers.push(window.setTimeout(closeIntro, INTRO_DURATION));

    return () => {
      effectTimers.forEach(window.clearTimeout);
      document.body.style.overflow = previousOverflow.current;
    };
  }, []);

  const skipIntro = () => {
    timers.current.forEach(window.clearTimeout);
    document.body.style.overflow = previousOverflow.current;
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`intro-screen ${isExiting ? "intro-screen--exit" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Présentation du portfolio"
    >
      <div className="intro-grain" aria-hidden="true" />
      <div className="intro-orbit intro-orbit--one" aria-hidden="true" />
      <div className="intro-orbit intro-orbit--two" aria-hidden="true" />

      <div className="intro-topline">
        <span className="intro-brand">
          <span className="intro-brand-mark">F</span>
          DOHOU GBENOUPKO FAWASE
        </span>
        <span className="intro-edition">PORTFOLIO · 2026</span>
        <button type="button" className="intro-skip" onClick={skipIntro}>
          Passer <ArrowUpRight size={14} />
        </button>
      </div>

      <main className="intro-main">
        <p className="intro-kicker">
          <span className="intro-live-dot" />
          PRODUIT · DESIGN · INGÉNIERIE
        </p>
        <h1 className="intro-title">
          <span>Les idées</span>
          <span className="intro-title-accent">méritent mieux.</span>
        </h1>
        <div className="intro-bottomline">
          <p>
            Je transforme les idées en expériences utiles,
            <br />
            pensées pour le quotidien.
          </p>
          <span className="intro-scroll">
            ENTRER DANS MON UNIVERS
            <ArrowDownRight size={16} />
          </span>
        </div>
      </main>

      <div className="intro-index" aria-hidden="true">
        <span>01</span>
        <span className="intro-index-line" />
        <span>03</span>
      </div>

      <div className="intro-progress" aria-hidden="true">
        <span />
      </div>

      <style jsx global>{`
        .intro-screen {
          position: fixed;
          z-index: 9999;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          padding: clamp(22px, 4vw, 56px) clamp(22px, 6vw, 88px);
          color: #f7f4ef;
          background:
            radial-gradient(ellipse at 82% 48%, rgba(234, 88, 12, 0.14), transparent 38%),
            #111110;
          animation: intro-screen-in 500ms ease-out both;
          isolation: isolate;
        }

        .intro-screen--exit {
          pointer-events: none;
          animation: intro-screen-out ${EXIT_DURATION}ms cubic-bezier(0.7, 0, 0.3, 1) both;
        }

        .intro-grain {
          position: absolute;
          z-index: -1;
          inset: 0;
          pointer-events: none;
          opacity: 0.16;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.92' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.22'/%3E%3C/svg%3E");
        }

        .intro-orbit {
          position: absolute;
          z-index: -1;
          top: 50%;
          left: 75%;
          width: min(68vw, 780px);
          aspect-ratio: 1;
          border: 1px solid rgba(255, 255, 255, 0.075);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          animation: intro-orbit-in 1.5s cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }

        .intro-orbit--two {
          width: min(46vw, 540px);
          border-color: rgba(249, 115, 22, 0.19);
          animation-delay: 100ms;
        }

        .intro-topline,
        .intro-brand,
        .intro-bottomline,
        .intro-scroll {
          display: flex;
          align-items: center;
        }

        .intro-topline {
          justify-content: space-between;
          gap: 20px;
          animation: intro-rise 700ms 100ms both;
        }

        .intro-brand {
          gap: 11px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
        }

        .intro-brand-mark {
          display: grid;
          width: 30px;
          height: 30px;
          place-items: center;
          border: 1px solid rgba(249, 115, 22, 0.75);
          border-radius: 50%;
          color: #fb923c;
          font-family: Georgia, serif;
          font-size: 16px;
          font-weight: 400;
          letter-spacing: 0;
        }

        .intro-edition,
        .intro-skip {
          color: rgba(247, 244, 239, 0.52);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.16em;
        }

        .intro-skip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 999px;
          padding: 10px 14px;
          color: #f7f4ef;
          background: transparent;
          cursor: pointer;
          transition: border-color 180ms ease, background 180ms ease;
        }

        .intro-skip:hover {
          border-color: rgba(249, 115, 22, 0.7);
          background: rgba(249, 115, 22, 0.1);
        }

        .intro-main {
          width: 100%;
          max-width: 1160px;
          margin: auto;
          padding: 56px 0 70px;
        }

        .intro-kicker {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 clamp(22px, 4vh, 42px);
          color: #fb923c;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          animation: intro-rise 700ms 250ms both;
        }

        .intro-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #fb923c;
          box-shadow: 0 0 18px rgba(251, 146, 60, 0.9);
          animation: intro-pulse 1.8s ease-in-out infinite;
        }

        .intro-title {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin: 0;
          font-size: clamp(54px, 10.6vw, 148px);
          font-weight: 500;
          line-height: 0.88;
          letter-spacing: -0.075em;
        }

        .intro-title span {
          animation: intro-title-in 950ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .intro-title span + span {
          padding-top: 0.16em;
          color: #f97316;
          font-family: Georgia, "Times New Roman", serif;
          font-style: italic;
          font-weight: 400;
          animation-delay: 120ms;
        }

        .intro-bottomline {
          justify-content: space-between;
          gap: 24px;
          margin-top: clamp(30px, 7vh, 72px);
          animation: intro-rise 700ms 520ms both;
        }

        .intro-bottomline p {
          margin: 0;
          color: rgba(247, 244, 239, 0.58);
          font-size: clamp(13px, 1.45vw, 17px);
          line-height: 1.7;
        }

        .intro-scroll {
          gap: 12px;
          color: rgba(247, 244, 239, 0.72);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.14em;
        }

        .intro-scroll :global(svg) {
          color: #fb923c;
          animation: intro-nudge 1s 1s ease-in-out infinite alternate;
        }

        .intro-index {
          position: absolute;
          right: clamp(22px, 3vw, 42px);
          top: 50%;
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(247, 244, 239, 0.32);
          font-size: 8px;
          letter-spacing: 0.12em;
          transform: translateY(-50%);
          writing-mode: vertical-rl;
          animation: intro-rise 700ms 500ms both;
        }

        .intro-index-line {
          width: 1px;
          height: 48px;
          background: linear-gradient(#f97316, rgba(255, 255, 255, 0.12));
        }

        .intro-progress {
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          height: 2px;
          background: rgba(255, 255, 255, 0.1);
        }

        .intro-progress span {
          display: block;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, #f97316, #fdba74);
          transform: scaleX(0);
          transform-origin: left;
          animation: intro-progress ${INTRO_DURATION}ms linear both;
        }

        @keyframes intro-screen-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes intro-screen-out {
          to { opacity: 0; visibility: hidden; }
        }

        @keyframes intro-rise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes intro-title-in {
          from { opacity: 0; transform: translateY(42px) skewY(3deg); }
          to { opacity: 1; transform: translateY(0) skewY(0); }
        }

        @keyframes intro-orbit-in {
          from { opacity: 0; scale: 0.82; }
          to { opacity: 1; scale: 1; }
        }

        @keyframes intro-pulse {
          50% { opacity: 0.45; }
        }

        @keyframes intro-nudge {
          to { transform: translate(3px, 3px); }
        }

        @keyframes intro-progress {
          to { transform: scaleX(1); }
        }

        @media (max-width: 640px) {
          .intro-edition,
          .intro-index {
            display: none;
          }

          .intro-main {
            padding: 48px 0;
          }

          .intro-title {
            font-size: clamp(52px, 13vw, 84px);
          }

          .intro-bottomline {
            align-items: flex-start;
            flex-direction: column;
            gap: 20px;
          }

          .intro-orbit {
            left: 90%;
            width: 110vw;
          }

          .intro-orbit--two {
            width: 76vw;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .intro-screen,
          .intro-screen *,
          .intro-screen *::before,
          .intro-screen *::after {
            animation-duration: 1ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </div>
  );
}
