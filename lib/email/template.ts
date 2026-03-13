type EmailTemplateOptions = {
  preheader?: string;
  title: string;
  subtitle?: string;
  contentHtml: string;
  cta?: {
    label: string;
    href: string;
  };
  helpText?: string;
  finePrint?: string;
};

const BRAND = {
  name: "savemelin",
  primary: "#e29656",
  text: "#101828",
  muted: "#667085",
  border: "#eaecf0",
  page: "#fafafa",
  card: "#ffffff",
};

export function buildSavemelinEmail({
  preheader,
  title,
  subtitle,
  contentHtml,
  cta,
  helpText,
  finePrint,
}: EmailTemplateOptions): string {
  const preheaderText = preheader || title;

  return `
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background:${BRAND.page};font-family:Aspekta,Inter,Segoe UI,Arial,sans-serif;color:${BRAND.text};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheaderText}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND.page};padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:${BRAND.card};border:1px solid ${BRAND.border};">
            <tr>
              <td style="padding:18px 28px;border-bottom:1px solid ${BRAND.border};">
                <span style="font-size:24px;line-height:1;font-weight:700;letter-spacing:-0.02em;color:${BRAND.primary};">${BRAND.name}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <h1 style="margin:0 0 10px;font-size:28px;line-height:1.2;font-weight:700;color:${BRAND.text};letter-spacing:-0.02em;">${title}</h1>
                ${
                  subtitle
                    ? `<p style="margin:0 0 20px;font-size:16px;line-height:1.55;color:${BRAND.muted};">${subtitle}</p>`
                    : ""
                }
                <div style="font-size:15px;line-height:1.65;color:${BRAND.text};">
                  ${contentHtml}
                </div>
                ${
                  cta
                    ? `<div style="margin-top:26px;">
                        <a href="${cta.href}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:${BRAND.primary};color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:12px 20px;">
                          ${cta.label}
                        </a>
                      </div>`
                    : ""
                }
                ${
                  helpText
                    ? `<p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:${BRAND.muted};">${helpText}</p>`
                    : ""
                }
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px;border-top:1px solid ${BRAND.border};font-size:12px;line-height:1.6;color:${BRAND.muted};">
                ${
                  finePrint ||
                  "Este correo fue enviado por Savemelin porque tienes una cuenta o una alerta activa."
                }
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `;
}
