"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  MessageCircle,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";

type Choice = {
  label: string;
  response: string;
  actionLabel: string;
  href?: string;
  subject?: string;
  message?: string;
};

const projectChoices: Choice[] = [
  {
    label: "Site ou application web/mobile",
    response:
      "Je peux vous accompagner de la conception au déploiement d’un produit web ou mobile.",
    actionLabel: "Présenter mon projet",
    subject: "Projet web ou application",
    message:
      "Bonjour Fawase,\n\nJe souhaite échanger au sujet d’un projet web ou d’une application.\n\nMon besoin : ",
  },
  {
    label: "Design ou amélioration d’un produit",
    response:
      "Je travaille aussi sur le design produit et l’amélioration de parcours pour rendre les interfaces plus claires et efficaces.",
    actionLabel: "Parler de mon produit",
    subject: "Design ou amélioration produit",
    message:
      "Bonjour Fawase,\n\nJe souhaite échanger au sujet du design ou de l’amélioration d’un produit.\n\nMon besoin : ",
  },
  {
    label: "Architecture ou accompagnement technique",
    response:
      "Parlons de vos besoins d’architecture, de performance ou d’accompagnement technique.",
    actionLabel: "Décrire mon besoin",
    subject: "Accompagnement technique",
    message:
      "Bonjour Fawase,\n\nJe souhaite échanger au sujet d’un besoin technique ou d’architecture.\n\nMon besoin : ",
  },
];

const informationChoices: Choice[] = [
  {
    label: "Quelles sont ses expertises ?",
    response:
      "Design produit, développement web et mobile, identité de marque et architectures évolutives. L’objectif : créer des produits utiles, accessibles et prêts à grandir.",
    actionLabel: "Découvrir les expertises",
    href: "/#about",
  },
  {
    label: "Quelle est son expérience ?",
    response:
      "Fawase a plus de 4 ans d’expérience et a travaillé sur des produits web et mobiles, notamment dans l’immobilier, la fintech et le SaaS.",
    actionLabel: "Voir son parcours",
    href: "/#work",
  },
  {
    label: "Comment se déroule une mission ?",
    response:
      "La démarche présentée ici suit trois étapes : comprendre le problème, concevoir et construire la solution, puis la déployer et l’améliorer à partir des résultats.",
    actionLabel: "Voir la méthode",
    href: "/#method",
  },
];

const projectStages = [
  "Je clarifie encore mon idée",
  "Je veux lancer le projet",
  "Je veux améliorer un produit existant",
] as const;

type AssistantStep = "home" | "project" | "stage" | "summary" | "answer";

export function VisitorWelcome() {
  const [available, setAvailable] = useState(false);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<AssistantStep>("home");
  const [answer, setAnswer] = useState<Choice | null>(null);
  const [selectedProject, setSelectedProject] = useState<Choice | null>(null);
  const [selectedStage, setSelectedStage] = useState<(typeof projectStages)[number] | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setAvailable(true), 2800);
    return () => window.clearTimeout(timer);
  }, []);

  const startContact = (subject: string, message: string) => {
    window.dispatchEvent(
      new CustomEvent("portfolio:contact-prefill", { detail: { subject, message } }),
    );
    setOpen(false);
    window.location.hash = "contact";
  };

  const chooseInformation = (choice: Choice) => {
    setAnswer(choice);
    setStep("answer");
  };

  const startProjectBrief = () => {
    setSelectedProject(null);
    setSelectedStage(null);
    setStep("project");
  };

  const prepareProjectContact = () => {
    if (!selectedProject || !selectedStage) return;

    startContact(
      selectedProject.subject ?? "Parlons de votre projet",
      [
        "Bonjour Fawase,",
        "",
        `Je souhaite échanger au sujet de : ${selectedProject.label.toLowerCase()}.`,
        `Mon projet en est au stade suivant : ${selectedStage.toLowerCase()}.`,
        "",
        "Voici quelques détails sur mon besoin :",
      ].join("\n"),
    );
  };

  const handleAnswerAction = () => {
    if (answer?.href) {
      setOpen(false);
      window.location.hash = answer.href.replace("/#", "");
    } else if (answer?.subject && answer.message) {
      startContact(answer.subject, answer.message);
    }
  };

  const reset = () => {
    setStep("home");
    setAnswer(null);
  };

  if (!available) return null;

  return (
    <aside className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {open && (
        <section
          role="dialog"
          aria-modal="false"
          aria-label="Assistant du portfolio"
          className="w-[min(23rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-black/10 bg-white text-black shadow-2xl shadow-black/15"
        >
          <header className="flex items-center justify-between bg-[#171717] px-4 py-3.5 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/15 text-orange-300">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">Assistant portfolio</p>
                <p className="mt-0.5 text-[10px] text-white/55">
                  Orientation rapide · réponses guidées
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer l’assistant"
              className="rounded-full p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="space-y-4 p-4">
            <p className="rounded-2xl rounded-tl-sm bg-neutral-100 px-3.5 py-3 text-xs leading-5 text-neutral-700">
              {step === "home"
                ? "Bonjour ! Que souhaitez-vous faire ?"
                : step === "project"
                  ? "En 30 secondes, dessinons les contours de votre projet. Quel est votre besoin ?"
                  : step === "stage"
                    ? "Où en êtes-vous aujourd’hui ?"
                    : step === "summary"
                      ? "Votre brief est prêt. Vous pourrez le compléter et le modifier avant de l’envoyer."
                      : answer?.response}
            </p>

            {step === "home" && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={startProjectBrief}
                  className="flex w-full items-center justify-between rounded-xl border border-black/10 px-3.5 py-3 text-left text-xs font-medium transition hover:border-orange-300 hover:bg-orange-50"
                >
                  <span className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-orange-600" />
                    Créer mon brief express
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-orange-600" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    startContact(
                      "Opportunité de recrutement",
                      "Bonjour Fawase,\n\nJe vous contacte au sujet d’une opportunité de recrutement.\n\nLe poste et l’équipe : ",
                    )
                  }
                  className="flex w-full items-center justify-between rounded-xl border border-black/10 px-3.5 py-3 text-left text-xs font-medium transition hover:border-orange-300 hover:bg-orange-50"
                >
                  Je recrute <ArrowRight className="h-3.5 w-3.5 text-orange-600" />
                </button>
                {informationChoices.map((choice) => (
                  <button
                    type="button"
                    key={choice.label}
                    onClick={() => chooseInformation(choice)}
                    className="flex w-full items-center justify-between rounded-xl border border-black/10 px-3.5 py-3 text-left text-xs font-medium transition hover:border-orange-300 hover:bg-orange-50"
                  >
                    {choice.label}
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-orange-600" />
                  </button>
                ))}
                <Link
                  href="/#projects"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-between rounded-xl border border-black/10 px-3.5 py-3 text-xs font-medium transition hover:border-orange-300 hover:bg-orange-50"
                >
                  Voir les réalisations <ArrowRight className="h-3.5 w-3.5 text-orange-600" />
                </Link>
              </div>
            )}

            {step === "project" && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 pb-1" aria-label="Étape 1 sur 3">
                  {[0, 1, 2].map((item) => (
                    <span
                      key={item}
                      className={`h-1 flex-1 rounded-full ${item === 0 ? "bg-orange-500" : "bg-neutral-100"}`}
                    />
                  ))}
                  <span className="ml-1 text-[10px] text-neutral-400">1/3</span>
                </div>
                {projectChoices.map((choice) => (
                  <button
                    type="button"
                    key={choice.subject}
                    onClick={() => {
                      setSelectedProject(choice);
                      setStep("stage");
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-black/10 px-3.5 py-3 text-left text-xs font-medium transition hover:border-orange-300 hover:bg-orange-50"
                  >
                    {choice.label}
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-orange-600" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 px-1 py-2 text-[11px] font-medium text-neutral-500 hover:text-black"
                >
                  <ArrowLeft className="h-3 w-3" /> Retour
                </button>
              </div>
            )}

            {step === "stage" && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 pb-1" aria-label="Étape 2 sur 3">
                  {[0, 1, 2].map((item) => (
                    <span
                      key={item}
                      className={`h-1 flex-1 rounded-full ${item < 2 ? "bg-orange-500" : "bg-neutral-100"}`}
                    />
                  ))}
                  <span className="ml-1 text-[10px] text-neutral-400">2/3</span>
                </div>
                {projectStages.map((stage) => (
                  <button
                    type="button"
                    key={stage}
                    onClick={() => {
                      setSelectedStage(stage);
                      setStep("summary");
                    }}
                    className="flex w-full items-center justify-between rounded-xl border border-black/10 px-3.5 py-3 text-left text-xs font-medium transition hover:border-orange-300 hover:bg-orange-50"
                  >
                    {stage}
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-orange-600" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setStep("project")}
                  className="inline-flex items-center gap-1.5 px-1 py-2 text-[11px] font-medium text-neutral-500 hover:text-black"
                >
                  <ArrowLeft className="h-3 w-3" /> Retour
                </button>
              </div>
            )}

            {step === "summary" && selectedProject && selectedStage && (
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 pb-1" aria-label="Étape 3 sur 3">
                  {[0, 1, 2].map((item) => (
                    <span key={item} className="h-1 flex-1 rounded-full bg-orange-500" />
                  ))}
                  <span className="ml-1 text-[10px] text-neutral-400">3/3</span>
                </div>
                <div className="rounded-xl border border-orange-100 bg-orange-50/70 p-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-orange-700">
                    Votre point de départ
                  </p>
                  <p className="mt-2 text-xs font-semibold text-neutral-800">{selectedProject.label}</p>
                  <p className="mt-1 text-[11px] text-neutral-500">{selectedStage}</p>
                </div>
                <button
                  type="button"
                  onClick={prepareProjectContact}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-xs font-semibold text-white transition hover:bg-orange-700"
                >
                  Continuer vers mon brief <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setStep("stage")}
                  className="inline-flex items-center gap-1.5 px-1 py-1 text-[11px] font-medium text-neutral-500 hover:text-black"
                >
                  <ArrowLeft className="h-3 w-3" /> Modifier ma réponse
                </button>
              </div>
            )}

            {step === "answer" && answer && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleAnswerAction}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-xs font-semibold text-white transition hover:bg-orange-700"
                >
                  {answer.actionLabel} <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 px-1 py-2 text-[11px] font-medium text-neutral-500 hover:text-black"
                >
                  <ArrowLeft className="h-3 w-3" /> Choisir un autre besoin
                </button>
              </div>
            )}
          </div>
          <p className="border-t border-neutral-100 px-4 py-2.5 text-[10px] text-neutral-400">
            Vos choix ne sont pas enregistrés. Rien n’est envoyé avant votre validation du formulaire.
          </p>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Fermer l’assistant" : "Ouvrir l’assistant portfolio"}
        className="group inline-flex items-center gap-2 rounded-full bg-[#171717] px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-orange-700"
      >
        {open ? <X className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
        <span>{open ? "Fermer" : "Parlons de votre projet"}</span>
      </button>
    </aside>
  );
}
