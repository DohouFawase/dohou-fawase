"use client";

import { useState } from "react";
import { ArrowRight, Check, ArrowUpRight, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client"; // adapte le chemin à ton projet

const SOCIALS = [
  { label: "TWITTER", value: "@omo_iya_oniRice", href: "https://x.com/omo_iya_oniRice" },
  { label: "GITHUB", value: "DohouFawase", href: "https://github.com/DohouFawase" },
  { label: "LINKEDIN", value: "Fawase Gbenoupko DOHOU", href: "https://linkedin.com/in/dohou-fawase" },
  { label: "WHATSAPP", value: "Écrivez-moi", href: "https://wa.me/+2290197395756" },
];

const EMAIL = "dohoufawase@gmail.com";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", subject: "", message: "" });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Presse-papier non disponible
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    const supabase = createClient();

    // 1. Sauvegarde des données dans Supabase
    const { error: insertError } = await supabase.from("messages").insert({
      email: form.email,
      subject: form.subject || null,
      message: form.message,
    });

    if (insertError) {
      console.error("Erreur envoi message Supabase:", insertError);
      setError("Une erreur est survenue lors de l'enregistrement de votre message.");
      setSending(false);
      return;
    }

    // 2. Si l'écriture en base a réussi, on déclenche l'envoi de l'email via notre API Next.js
    try {
      const mailResponse = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          subject: form.subject,
          message: form.message,
        }),
      });

      if (!mailResponse.ok) {
        throw new Error("L'envoi de l'e-mail a échoué.");
      }

      setSent(true);
      setForm({ email: "", subject: "", message: "" });
    } catch (mailError) {
      console.error("Erreur d'envoi d'email via API:", mailError);
      // On rassure l'utilisateur car la donnée est déjà stockée en base de données !
      setError(
        "Votre message a bien été enregistré en base de données, mais un problème technique a empêché l'envoi de la notification mail. Soyez serein, j'y ai quand même accès !"
      );
      setSent(true); // On valide quand même visuellement l'envoi
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="w-full bg-white text-black" id="contact">
      <div className="mx-auto container px-6 pt-14 pb-24 sm:px-10 lg:px-16">

        {/* Surtitre */}
        <div className="mb-6 inline-flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-600/40 text-[11px] font-bold text-orange-600">
            07
          </span>
          <span className="text-[11px] font-semibold tracking-widest text-black/40">
            CONTACT
          </span>
        </div>

        {/* Titre principal */}
        <h2 className="max-w-4xl text-[2.4rem] font-extrabold leading-[1.1] tracking-tight text-black sm:text-5xl">
          Un projet qui mérite d&apos;être créé ?{" "}
          <span className="font-serif italic text-orange-600">
            Parlons-en.
          </span>
        </h2>

        {/* Introduction */}
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-black/60">
          Projets freelance, opportunités en CDI ou collaborations de produits. Je réponds généralement sous 24 heures.
        </p>

        {/* Grille de contenu */}
        <div className="mt-14 grid grid-cols-1 gap-12 border-t border-black/10 pt-12 lg:grid-cols-[0.75fr_1.25fr]">

          {/* ---------------- GAUCHE : Contact direct ---------------- */}
          <div>
            <div className="text-[10px] font-semibold tracking-widest text-black/40">
              DIRECT
            </div>
            <div className="mt-3 flex flex-wrap items-baseline gap-3">
              <a
                href={`mailto:${EMAIL}`}
                className="text-xl font-bold text-black underline decoration-black/20 underline-offset-4 sm:text-2xl hover:decoration-black transition-all"
              >
                {EMAIL}
              </a>
              <button
                onClick={handleCopy}
                className="text-[11px] font-bold tracking-widest text-orange-600 transition hover:text-orange-500"
              >
                {copied ? "COPIÉ !" : "COPIER"}
              </button>
            </div>

            <div className="mt-10 text-[10px] font-semibold tracking-widest text-black/40">
              AILLEURS
            </div>
            <div className="mt-4 space-y-3">
              {SOCIALS.map((s) => (
                <div key={s.label} className="flex items-baseline gap-4">
                  <span className="w-20 shrink-0 text-[10px] font-semibold tracking-widest text-black/40">
                    {s.label}
                  </span>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[15px] font-semibold text-black underline decoration-black/20 underline-offset-4 transition hover:text-orange-600"
                  >
                    {s.value}
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* ---------------- DROITE : Formulaire ---------------- */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="email"
                  className="text-[10px] font-semibold tracking-widest text-black/40"
                >
                  VOTRE EMAIL
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="vous@entreprise.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="mt-3 w-full border-b border-black/15 bg-transparent pb-3 text-[15px] text-black placeholder:text-black/35 outline-none transition focus:border-orange-600"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="text-[10px] font-semibold tracking-widest text-black/40"
                >
                  SUJET
                </label>
                <input
                  id="subject"
                  type="text"
                  placeholder="Un poste, un projet, un bonjour"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  className="mt-3 w-full border-b border-black/15 bg-transparent pb-3 text-[15px] text-black placeholder:text-black/35 outline-none transition focus:border-orange-600"
                />
              </div>
            </div>

            <div className="mt-10">
              <label
                htmlFor="message"
                className="text-[10px] font-semibold tracking-widest text-black/40"
              >
                MESSAGE
              </label>
              <div className="relative">
                <textarea
                  id="message"
                  required
                  rows={3}
                  placeholder="Dites-m'en un peu plus sur ce que vous préparez."
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="mt-3 w-full resize-none border-b border-black/15 bg-transparent pb-3 pr-10 text-[15px] text-black placeholder:text-black/35 outline-none transition focus:border-orange-600"
                />
                {sent && (
                  <span className="pointer-events-none absolute bottom-3 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white animate-scaleIn">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                )}
              </div>
            </div>

            {error && (
              <p className="mt-3 text-[13px] font-medium text-red-600">{error}</p>
            )}
            {sent && !error && (
              <p className="mt-3 text-[13px] font-medium text-green-600">
                Votre message a bien été reçu, il sera traité dans les plus brefs délais.
              </p>
            )}

            <button
              type="submit"
              disabled={sending}
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-orange-600 px-7 py-3.5 text-[12px] font-bold tracking-widest text-white transition hover:bg-orange-500 disabled:opacity-60"
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  ENVOI...
                </>
              ) : sent ? (
                "MESSAGE ENVOYÉ"
              ) : (
                "ENVOYER LE MESSAGE"
              )}
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}