import { Resend } from "resend";

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

  await getResend().emails.send({
    from: process.env.EMAIL_FROM ?? "Kobrex <onboarding@resend.dev>",
    to,
    subject: overdue
      ? `Factura ${invoiceNumber} vencida`
      : `Recordatorio: factura ${invoiceNumber} próxima a vencer`,
    html: `
      <p>Hola ${clientName},</p>
      <p>${
        overdue
          ? `La factura <strong>${invoiceNumber}</strong> por <strong>$${amount.toFixed(2)} MXN</strong> venció el ${dueDate.toLocaleDateString("es-MX")}.`
          : `Te recordamos que la factura <strong>${invoiceNumber}</strong> por <strong>$${amount.toFixed(2)} MXN</strong> vence el ${dueDate.toLocaleDateString("es-MX")}.`
      }</p>
      <p>Gracias.</p>
    `,
  });
}
