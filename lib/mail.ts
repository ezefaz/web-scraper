import { Resend } from 'resend';
import { APP_BASE_URL } from './config/urls';
import { buildSavemelinEmail } from './email/template';

const resend = new Resend(process.env.RESEND_API_KEY);
const senderEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${APP_BASE_URL}/new-verification?token=${token}`;
  const html = buildSavemelinEmail({
    preheader: 'Confirma tu cuenta para activar tu acceso',
    title: 'Confirma tu cuenta',
    subtitle:
      'Solo falta un paso para empezar a seguir precios y recibir alertas.',
    contentHtml: `
      <p style="margin:0 0 12px;">Haz clic en el botón para verificar tu cuenta.</p>
      <p style="margin:0;">Si no creaste esta cuenta, puedes ignorar este correo.</p>
    `,
    cta: {
      label: 'Verificar cuenta',
      href: confirmLink,
    },
    helpText: `Si el botón no funciona, copia este enlace en tu navegador:<br /><span style="word-break:break-all;">${confirmLink}</span>`,
    finePrint:
      'Este enlace puede expirar. Si sucede, solicita uno nuevo desde la pantalla de verificación.',
  });

  await resend.emails.send({
    from: senderEmail,
    to: email,
    subject: 'Confirma tu cuenta',
    html,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${APP_BASE_URL}/reset?token=${token}`;
  const html = buildSavemelinEmail({
    preheader: 'Restablece tu contraseña de Savemelin',
    title: 'Restablece tu contraseña',
    subtitle:
      'Recibimos una solicitud para cambiar la contraseña de tu cuenta.',
    contentHtml: `
      <p style="margin:0 0 12px;">Usa el siguiente botón para crear una contraseña nueva.</p>
      <p style="margin:0;">Si no hiciste esta solicitud, ignora este correo y tu contraseña seguirá igual.</p>
    `,
    cta: {
      label: 'Cambiar contraseña',
      href: resetLink,
    },
    helpText: `Si el botón no funciona, copia este enlace en tu navegador:<br /><span style="word-break:break-all;">${resetLink}</span>`,
    finePrint:
      'Por seguridad, este enlace expira en poco tiempo. Solicita uno nuevo si ya no es válido.',
  });

  await resend.emails.send({
    from: senderEmail,
    to: email,
    subject: 'Reiniciar Contraseña',
    html,
  });
};
