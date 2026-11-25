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
import { useLanguage } from "@/context/LanguageProvider";

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
  const { language } = useLanguage();
  const en = language === "en";
  const activeProjectChoices: Choice[] = en ? [
    { label: "Website or web/mobile app", response: "I can support you from design through deployment of a web or mobile product.", actionLabel: "Share my project", subject: "Web or app project", message: "Hello Fawase,\n\nI’d like to discuss a website or app project.\n\nWhat I need: " },
    { label: "Product design or improvement", response: "I also work on product design and user journeys to make interfaces clearer and more effective.", actionLabel: "Discuss my product", subject: "Product design or improvement", message: "Hello Fawase,\n\nI’d like to discuss product design or improvements.\n\nWhat I need: " },
    { label: "Architecture or technical support", response: "Let’s talk about your architecture, performance, or technical support needs.", actionLabel: "Describe my needs", subject: "Technical support", message: "Hello Fawase,\n\nI’d like to discuss a technical or architecture need.\n\nWhat I need: " },
  ] : projectChoices;
  const activeInformationChoices: Choice[] = en ? [
    { label: "What are his areas of expertise?", response: "Product design, web and mobile development, brand identity, and scalable architecture. The goal is to build useful, accessible products ready to grow.", actionLabel: "Explore expertise", href: "/#about" },
    { label: "What experience does he have?", response: "Fawase has over four years of experience building web and mobile products, including in real estate, fintech, and SaaS.", actionLabel: "View experience", href: "/#work" },
    { label: "How does a project work?", response: "The process has three steps: understand the problem, design and build the solution, then launch and improve it based on results.", actionLabel: "View the approach", href: "/#method" },
  ] : informationChoices;
  const activeProjectStages = en ? ["I’m still shaping the idea", "I want to launch the project", "I want to improve an existing product"] : projectStages;
  const [available, setAvailable] = useState(false);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<AssistantStep>("home");
  const [answer, setAnswer] = useState<Choice | null>(null);
  const [selectedProject, setSelectedProject] = useState<Choice | null>(null);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

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
          aria-label={en ? "Portfolio assistant" : "Assistant du portfolio"}
          className="w-[min(23rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-black/10 bg-white text-black shadow-2xl shadow-black/15"
        >
          <header className="flex items-center justify-between bg-[#171717] px-4 py-3.5 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/15 text-orange-300">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">{en ? "Portfolio assistant" : "Assistant portfolio"}</p>
                <p className="mt-0.5 text-[10px] text-white/55">
                  {en ? "Quick guidance · suggested answers" : "Orientation rapide · réponses guidées"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={en ? "Close assistant" : "Fermer l’assistant"}
              className="rounded-full p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="space-y-4 p-4">
            <p className="rounded-2xl rounded-tl-sm bg-neutral-100 px-3.5 py-3 text-xs leading-5 text-neutral-700">
              {step === "home"
                ? (en ? "Hello! What would you like to do?" : "Bonjour ! Que souhaitez-vous faire ?")
                : step === "project"
                  ? (en ? "Let’s outline your project in 30 seconds. What do you need?" : "En 30 secondes, dessinons les contours de votre projet. Quel est votre besoin ?")
                  : step === "stage"
                    ? (en ? "Where are you with it today?" : "Où en êtes-vous aujourd’hui ?")
                    : step === "summary"
                      ? (en ? "Your brief is ready. You can complete and edit it before sending." : "Votre brief est prêt. Vous pourrez le compléter et le modifier avant de l’envoyer.")
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
                    {en ? "Create a quick brief" : "Créer mon brief express"}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-orange-600" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    startContact(
                      en ? "Hiring opportunity" : "Opportunité de recrutement",
                      en ? "Hello Fawase,\n\nI’m reaching out about a hiring opportunity.\n\nRole and team: " : "Bonjour Fawase,\n\nJe vous contacte au sujet d’une opportunité de recrutement.\n\nLe poste et l’équipe : ",
                    )
                  }
                  className="flex w-full items-center justify-between rounded-xl border border-black/10 px-3.5 py-3 text-left text-xs font-medium transition hover:border-orange-300 hover:bg-orange-50"
                >
                  {en ? "I’m hiring" : "Je recrute"} <ArrowRight className="h-3.5 w-3.5 text-orange-600" />
                </button>
                {activeInformationChoices.map((choice) => (
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
                  {en ? "View selected work" : "Voir les réalisations"} <ArrowRight className="h-3.5 w-3.5 text-orange-600" />
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
                {activeProjectChoices.map((choice) => (
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
                  <ArrowLeft className="h-3 w-3" /> {en ? "Back" : "Retour"}
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
                {activeProjectStages.map((stage) => (
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
                  <ArrowLeft className="h-3 w-3" /> {en ? "Back" : "Retour"}
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
                    {en ? "Your starting point" : "Votre point de départ"}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-neutral-800">{selectedProject.label}</p>
                  <p className="mt-1 text-[11px] text-neutral-500">{selectedStage}</p>
                </div>
                <button
                  type="button"
                  onClick={prepareProjectContact}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-xs font-semibold text-white transition hover:bg-orange-700"
                >
                  {en ? "Continue to my brief" : "Continuer vers mon brief"} <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setStep("stage")}
                  className="inline-flex items-center gap-1.5 px-1 py-1 text-[11px] font-medium text-neutral-500 hover:text-black"
                >
                  <ArrowLeft className="h-3 w-3" /> {en ? "Change my answer" : "Modifier ma réponse"}
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
                  <ArrowLeft className="h-3 w-3" /> {en ? "Choose another need" : "Choisir un autre besoin"}
                </button>
              </div>
            )}
          </div>
          <p className="border-t border-neutral-100 px-4 py-2.5 text-[10px] text-neutral-400">
            {en ? "Your choices aren’t saved. Nothing is sent until you submit the form." : "Vos choix ne sont pas enregistrés. Rien n’est envoyé avant votre validation du formulaire."}
          </p>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? (en ? "Close assistant" : "Fermer l’assistant") : (en ? "Open portfolio assistant" : "Ouvrir l’assistant portfolio")}
        className="group inline-flex items-center gap-2 rounded-full bg-[#171717] px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-orange-700"
      >
        {open ? <X className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
        <span>{open ? (en ? "Close" : "Fermer") : (en ? "Let’s discuss your project" : "Parlons de votre projet")}</span>
      </button>
    </aside>
  );
}
