"use client";

import { useEffect, useState } from "react";

export default function TerminalLoader() {
  const [text, setText] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const fullCommand = "pnpm run dev";

  useEffect(() => {
    // Bloque le scroll dès que le composant est monté
    document.body.style.overflow = "hidden";

    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullCommand.length) {
        setText((prev) => prev + fullCommand.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval);

        setTimeout(() => {
          setIsDone(true);

          setTimeout(() => {
            setIsVisible(false);
            // Redonne le droit de scroller une fois le loader invisible
            document.body.style.overflow = "unset";
          }, 1200);
        }, 600);
      }
    }, 100);

    return () => {
      clearInterval(typingInterval);
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center bg-[#111111] p-4 font-mono text-[13px] text-[#dfdbd2] transition-opacity duration-700 ease-in-out ${
        isDone ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* halo léger derrière la fenêtre pour un rendu plus "chic" */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 40% at 50% 45%, rgba(233,84,32,0.08) 0%, rgba(0,0,0,0) 70%)",
        }}
      />

      {/* Fenêtre du Terminal Ubuntu — plein écran */}
      <div className="relative flex h-full w-full flex-col overflow-hidden border border-[#5c5c5c]/30 bg-[#300a24] shadow-2xl sm:h-[92vh] sm:w-[94vw] sm:rounded-lg">
        {/* Barre de titre Ubuntu */}
        <div className="flex items-center justify-between border-b border-[#1c1a19] bg-gradient-to-b from-[#3d3a37] to-[#34312f] px-5 py-3">
          <div className="flex-1 select-none text-center font-sans text-sm font-medium text-[#dfdbd2]/90">
            fawase-dev@ubuntu: ~
          </div>
          <div className="ml-auto flex gap-3">
            <span className="flex h-5 w-5 cursor-default select-none items-center justify-center rounded-full bg-[#46423f] text-xs text-[#dfdbd2]/70 hover:bg-[#57524e]">
              ─
            </span>
            <span className="flex h-5 w-5 cursor-default select-none items-center justify-center rounded-full bg-[#46423f] text-[11px] text-[#dfdbd2]/70 hover:bg-[#57524e]">
              ❑
            </span>
            <span className="flex h-5 w-5 cursor-default select-none items-center justify-center rounded-full bg-[#e95420] text-xs font-bold text-white hover:bg-[#ff632a]">
              ✕
            </span>
          </div>
        </div>

        {/* Corps du terminal */}
        <div className="flex-1 space-y-4 overflow-auto p-8 text-[15px] selection:bg-[#dfdbd2] selection:text-[#300a24] sm:p-12">
          {/* Message d'accueil Ubuntu */}
          <div className="mb-2 select-none text-sm leading-relaxed text-[#dfdbd2]/60">
            Welcome to Ubuntu 24.04 LTS (GNU/Linux 6.8.0-generic x86_64)
            <br />
            * Documentation: https://help.ubuntu.com
            <br />
            * Management: https://landscape.canonical.com
          </div>

          {/* Ligne de commande */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center">
              <span className="font-bold text-[#8ae234]">
                fawase-dev@ubuntu
              </span>
              <span className="font-bold text-[#dfdbd2]">:</span>
              <span className="font-bold text-[#729fcf]">~</span>
              <span className="font-bold text-[#dfdbd2]">$</span>
              <span className="ml-2 font-medium text-white">{text}</span>
              <span
                className={`ml-1 h-5 w-2.5 bg-[#dfdbd2] ${
                  !isDone ? "animate-pulse" : "hidden"
                }`}
              />
            </div>

            {/* Sortie pnpm / Next.js */}
            {isDone && (
              <div className="animate-fadeIn space-y-1.5 font-mono text-[15px]">
                <p className="text-[#888a85]">&gt; next dev</p>

                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded-xs bg-[#4e9a06] px-1.5 py-0.5 text-[12px] font-bold text-black">
                    pnpm
                  </span>
                  <span className="text-[#4e9a06]">
                    Bending reality on port 3000...
                  </span>
                </div>

                <div className="mt-3 space-y-1">
                  <p className="text-[#729fcf]">
                    ▲ Next.js 15.x.x —— local development server
                  </p>
                  <p className="text-[#8ae234]">✓ Ready in 0.3s</p>
                  <p className="text-[#dfdbd2]">
                    Local:{" "}
                    <span className="cursor-pointer text-[#729fcf] underline">
                      http://localhost:3000
                    </span>
                  </p>
                </div>

                <div className="animate-pulse pt-4 text-sm font-bold text-[#e95420]">
                  [system] boot sequence complete. redirecting...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Keyframes locales au composant — pas besoin de toucher au CSS global */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          opacity: 0;
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}