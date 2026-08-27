import { Resend } from "resend";
import { buildEmailLayout, emailButton, emailBadge, emailInfoBox } from "@/lib/email/layout";

let _resend: Resend | undefined;

function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

export async function sendInvoiceReminder(params: {
  to: string;
  clientName: string;
  invoiceNumber: string;
  amount: number;
  dueDate: Date;
  overdue: boolean;
}) {
  const { to, clientName, invoiceNumber, amount, dueDate, overdue } = params;

  const amountFmt = `$${amount.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN`;
  const dueFmt = dueDate.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });

  const bodyHtml = `
    <p style="margin:0 0 4px 0; font-size:16px; font-weight:600;">Hola ${clientName},</p>
    <p style="margin:0 0 4px 0; color:#6b6360;">
      ${
        overdue
          ? "Tienes un recibo vencido pendiente de pago."
          : "Este es un recordatorio de un recibo próximo a vencer."
      }
    </p>

    <div style="margin-top:16px;">${emailBadge(overdue ? "Vencido" : "Próximo a vencer", overdue ? "danger" : "warning")}</div>

    ${emailInfoBox([
      { label: "Recibo", value: invoiceNumber },
      { label: "Monto", value: amountFmt },
      { label: "Fecha de vencimiento", value: dueFmt },
    ])}

    <p style="margin:16px 0 0 0; color:#6b6360;">
      Si ya realizaste el pago, puedes ignorar este mensaje. Gracias por tu preferencia.
    </p>
  `;

  await getResend().emails.send({
    from: process.env.EMAIL_FROM ?? "Kobrex <onboarding@resend.dev>",
    to,
    subject: overdue ? `Recibo ${invoiceNumber} vencido` : `Recordatorio: recibo ${invoiceNumber} próximo a vencer`,
    html: buildEmailLayout({
      preheader: overdue ? `Tu recibo ${invoiceNumber} está vencido` : `Tu recibo ${invoiceNumber} vence pronto`,
      bodyHtml,
    }),
  });
}

export async function sendPasswordResetEmail(params: { to: string; name: string; resetUrl: string }) {
  const { to, name, resetUrl } = params;

  const bodyHtml = `
    <p style="margin:0 0 4px 0; font-size:16px; font-weight:600;">Hola ${name},</p>
    <p style="margin:0; color:#6b6360;">
      Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente botón para elegir
      una nueva (el enlace es válido por 1 hora).
    </p>

    ${emailButton(resetUrl, "Cambiar mi contraseña")}

    <p style="margin:0; font-size:12px; color:#6b6360;">
      Si el botón no funciona, copia y pega este enlace en tu navegador:<br />
      <a href="${resetUrl}" style="color:#991b1b; word-break:break-all;">${resetUrl}</a>
    </p>

    <p style="margin:20px 0 0 0; color:#6b6360;">
      Si tú no solicitaste esto, puedes ignorar este correo con confianza — tu contraseña no cambiará.
    </p>
  `;

  await getResend().emails.send({
    from: process.env.EMAIL_FROM ?? "Kobrex <onboarding@resend.dev>",
    to,
    subject: "Recupera tu contraseña de Kobrex",
    html: buildEmailLayout({
      preheader: "Restablece tu contraseña de Kobrex — el enlace vence en 1 hora.",
      bodyHtml,
    }),
  });
}

export async function sendWelcomeEmail(params: { to: string; name: string }) {
  const { to, name } = params;

  const bodyHtml = `
    <p style="margin:0 0 4px 0; font-size:16px; font-weight:600;">¡Bienvenido a Kobrex, ${name}!</p>
    <p style="margin:0; color:#6b6360;">
      Tu cuenta se creó correctamente. Ya puedes empezar a agregar tus clientes, crear recibos y
      contratos, y llevar el control de tus gastos — todo desde un solo lugar.
    </p>

    ${emailButton(process.env.NEXT_PUBLIC_APP_URL ?? "https://kobrex.geodatos.com.mx", "Ir a mi panel")}

    <p style="margin:0; color:#6b6360;">
      Tienes 14 días de prueba gratuita para probar todo sin restricciones. Si tienes dudas, responde
      este correo.
    </p>
  `;

  await getResend().emails.send({
    from: process.env.EMAIL_FROM ?? "Kobrex <onboarding@resend.dev>",
    to,
    subject: "Bienvenido a Kobrex — tu cuenta está lista",
    html: buildEmailLayout({
      preheader: "Tu cuenta de Kobrex se creó correctamente.",
      bodyHtml,
    }),
  });
}

export async function sendVerificationEmail(params: { to: string; name: string; verifyUrl: string }) {
  const { to, name, verifyUrl } = params;

  const bodyHtml = `
    <p style="margin:0 0 4px 0; font-size:16px; font-weight:600;">Hola ${name},</p>
    <p style="margin:0; color:#6b6360;">
      Confirma que esta es tu dirección de correo para terminar de proteger tu cuenta de Kobrex.
    </p>

    ${emailButton(verifyUrl, "Verificar mi correo")}

    <p style="margin:0; font-size:12px; color:#6b6360;">
      Si el botón no funciona, copia y pega este enlace en tu navegador:<br />
      <a href="${verifyUrl}" style="color:#991b1b; word-break:break-all;">${verifyUrl}</a>
    </p>

    <p style="margin:20px 0 0 0; color:#6b6360;">
      Si tú no creaste esta cuenta, puedes ignorar este correo.
    </p>
  `;

  await getResend().emails.send({
    from: process.env.EMAIL_FROM ?? "Kobrex <onboarding@resend.dev>",
    to,
    subject: "Verifica tu correo de Kobrex",
    html: buildEmailLayout({
      preheader: "Confirma tu correo para terminar de configurar tu cuenta de Kobrex.",
      bodyHtml,
    }),
  });
}
