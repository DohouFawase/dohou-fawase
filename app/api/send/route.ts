import { NextResponse } from "next/server";
import { Resend } from "resend";

// On initialise Resend avec la clé API stockée dans ton fichier .env.local
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, subject, message } = await request.json();

    const data = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: ["dohfawaz90@gmail.com"], // Ton mail de réception
      subject: `Nouveau message : ${subject || "Sans sujet"}`,
      html: `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8" />
      </head>
      <body style="margin:0; padding:0; background-color:#f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding:40px 0;">
          <tr>
            <td align="center">
              <table role="presentation" width="580" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.06);">

                <!-- Header -->
                <tr>
                  <td style="background-color:#ea580c; padding:28px 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <span style="display:inline-flex; align-items:center; justify-content:center; width:32px; height:32px; border-radius:50%; border:1.5px solid rgba(255,255,255,0.5); color:#ffffff; font-size:11px; font-weight:700; text-align:center; line-height:32px;">07</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:14px;">
                          <p style="margin:0; color:rgba(255,255,255,0.75); font-size:11px; font-weight:600; letter-spacing:2px;">NOUVEAU MESSAGE</p>
                          <p style="margin:6px 0 0; color:#ffffff; font-size:22px; font-weight:800;">Quelqu'un veut vous parler.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:36px 40px 8px;">

                    <!-- Expéditeur -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                      <tr>
                        <td style="font-size:10px; font-weight:700; letter-spacing:1.5px; color:#a1a1aa; padding-bottom:6px;">
                          DE
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <a href="mailto:${email}" style="font-size:17px; font-weight:700; color:#18181b; text-decoration:none; border-bottom:1.5px solid #ea580c;">
                            ${email}
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Sujet -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                      <tr>
                        <td style="font-size:10px; font-weight:700; letter-spacing:1.5px; color:#a1a1aa; padding-bottom:6px;">
                          SUJET
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size:15px; font-weight:600; color:#18181b;">
                          ${subject || "Sans sujet"}
                        </td>
                      </tr>
                    </table>

                    <!-- Message -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
                      <tr>
                        <td style="font-size:10px; font-weight:700; letter-spacing:1.5px; color:#a1a1aa; padding-bottom:10px;">
                          MESSAGE
                        </td>
                      </tr>
                      <tr>
                        <td style="background-color:#fafafa; border:1px solid #e4e4e7; border-radius:10px; padding:18px 20px;">
                          <p style="margin:0; font-size:14px; line-height:1.7; color:#3f3f46; white-space:pre-wrap;">${message}</p>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>

                <!-- CTA -->
                <tr>
                  <td style="padding:8px 40px 36px;">
                    <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || "Votre message")}"
                       style="display:inline-block; background-color:#ea580c; color:#ffffff; font-size:12px; font-weight:700; letter-spacing:1px; text-decoration:none; padding:13px 26px; border-radius:999px;">
                      RÉPONDRE →
                    </a>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:20px 40px; border-top:1px solid #f0f0f0; background-color:#fafafa;">
                    <p style="margin:0; font-size:11px; color:#a1a1aa; text-align:center;">
                      Reçu depuis le formulaire de contact de votre portfolio
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}