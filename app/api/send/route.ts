import { NextResponse } from "next/server";
import { Resend } from "resend";

const OWNER_EMAIL = "dohfawaz90@gmail.com";
const SENDER = "Portfolio <onboarding@resend.dev>";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Origine de la requête non autorisée." }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide." }, { status: 400 });
  }

  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return NextResponse.json({ error: "Données de formulaire invalides." }, { status: 400 });
  }

  const body = payload as Record<string, unknown>;
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
  const subject = typeof body.subject === "string" ? body.subject.trim().slice(0, 200) : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const receiptConsent = body.receiptConsent === true;

  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    message.length === 0 ||
    message.length > 5000 ||
    (body.receiptConsent !== undefined && typeof body.receiptConsent !== "boolean")
  ) {
    return NextResponse.json({ error: "Vérifie les informations du formulaire." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY n’est pas configurée.");
    return NextResponse.json({ error: "Le service d’e-mail est indisponible." }, { status: 503 });
  }

  const resend = new Resend(apiKey);
  const safeEmail = escapeHtml(email);
  const safeName = escapeHtml(name);
  const safeSubject = escapeHtml(subject || "Sans objet");
  const safeMessage = escapeHtml(message);
  const senderLabel = name ? `${safeName} (${safeEmail})` : safeEmail;

  const { error: notificationError } = await resend.emails.send({
    from: SENDER,
    to: [OWNER_EMAIL],
    subject: `Nouveau message : ${subject || "Sans sujet"}`,
    text: `De : ${name ? `${name} (${email})` : email}\nSujet : ${subject || "Sans sujet"}\n\n${message}`,
    html: `
      <h2>Nouveau message depuis le portfolio</h2>
      <p><strong>De :</strong> ${senderLabel}</p>
      <p><strong>Sujet :</strong> ${safeSubject}</p>
      <p>${safeMessage.replace(/\r?\n/g, "<br>")}</p>
    `,
  });

  if (notificationError) {
    console.error("Erreur d’envoi de la notification:", notificationError);
    return NextResponse.json({ error: "La notification n’a pas pu être envoyée." }, { status: 502 });
  }

  if (!receiptConsent) {
    return NextResponse.json({ success: true, confirmationSent: false });
  }

  const { error: confirmationError } = await resend.emails.send({
    from: SENDER,
    to: [email],
    subject: "Nous avons bien reçu votre message",
    text: `Bonjour${name ? ` ${name}` : ""},\n\nMerci pour votre message. Il a bien été reçu et sera traité dès que possible.\n\nDohou Gbenoupko Fawase`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#171717">
        <h2>Merci pour votre message${name ? `, ${safeName}` : ""}.</h2>
        <p>Votre message a bien été reçu. Je le consulterai et vous répondrai si nécessaire.</p>
        <p style="color:#737373;font-size:13px">Cet e-mail confirme uniquement la réception de votre demande. Vous n’êtes inscrit à aucune newsletter.</p>
        <p>Dohou Gbenoupko Fawase</p>
      </div>
    `,
  });

  if (confirmationError) {
    console.error("Erreur d’envoi de la confirmation demandée:", confirmationError);
    return NextResponse.json({ success: true, confirmationSent: false });
  }

  return NextResponse.json({ success: true, confirmationSent: true });
}
