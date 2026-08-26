const INK = "#1c1614";
const MUTED = "#6b6360";
const ACCENT = "#991b1b";
const ACCENT_DARK = "#7f1d1d";
const BORDER = "#ece7e5";
const SURFACE_MUTED = "#faf8f7";

/**
 * Envoltorio HTML compartido para todos los correos transaccionales de Kobrex.
 * Usa tablas + estilos inline (no <style> ni SVG) porque es lo único que se
 * renderiza de forma consistente en Gmail, Outlook y clientes de correo móviles.
 */
export function buildEmailLayout(params: { preheader: string; bodyHtml: string }): string {
  const { preheader, bodyHtml } = params;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Kobrex</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f1f0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${preheader}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f1f0; padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="width:480px; max-width:100%; background-color:#ffffff; border-radius:16px; overflow:hidden; border:1px solid ${BORDER};">

          <!-- Header / membrete -->
          <tr>
            <td align="center" style="padding:36px 24px 24px 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="width:56px; height:56px; background-color:${ACCENT}; border-radius:14px;">
                    <div style="font-family:Helvetica,Arial,sans-serif; font-size:26px; font-weight:700; color:#ffffff; line-height:56px;">K</div>
                  </td>
                </tr>
              </table>
              <div style="margin-top:12px; font-size:18px; font-weight:700; letter-spacing:-0.01em; color:${ACCENT_DARK};">Kobrex</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:8px 32px 32px 32px; color:${INK}; font-size:14px; line-height:1.6;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px; border-top:1px solid ${BORDER}; background-color:${SURFACE_MUTED};">
              <p style="margin:0; font-size:12px; color:${MUTED};">
                Este es un correo automático de Kobrex. Si tienes dudas, contacta directamente a quien te lo envió.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function emailButton(url: string, label: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td align="center" style="background-color:${ACCENT}; border-radius:10px;">
          <a href="${url}" target="_blank" style="display:inline-block; padding:13px 28px; font-size:14px; font-weight:600; color:#ffffff; text-decoration:none;">
            ${label}
          </a>
        </td>
      </tr>
    </table>`;
}

export function emailBadge(label: string, tone: "warning" | "danger"): string {
  const colors =
    tone === "danger" ? { bg: "#fee2e2", fg: "#991b1b" } : { bg: "#fef3c7", fg: "#92400e" };
  return `<span style="display:inline-block; padding:4px 12px; border-radius:999px; background-color:${colors.bg}; color:${colors.fg}; font-size:12px; font-weight:600;">${label}</span>`;
}

export function emailInfoBox(rows: { label: string; value: string }[]): string {
  const rowsHtml = rows
    .map(
      (r) => `
      <tr>
        <td style="padding:8px 0; font-size:13px; color:${MUTED};">${r.label}</td>
        <td style="padding:8px 0; font-size:13px; font-weight:600; color:${INK}; text-align:right;">${r.value}</td>
      </tr>`
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${SURFACE_MUTED}; border:1px solid ${BORDER}; border-radius:10px; padding:4px 16px; margin:16px 0;">
      ${rowsHtml}
    </table>`;
}
