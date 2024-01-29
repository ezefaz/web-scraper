import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  const developmentBaseURL = 'http://localhost:3000';
  const productionBaseURL = 'https://savemelin.com';

  const confirmLink = isDevelopment
    ? `${developmentBaseURL}/new-verification?token=${token}`
    : `${productionBaseURL}/new-verification?token=${token}`;

  await resend.emails.send({
    from: 'hello@webgeenix.com',
    to: email,
    subject: 'Confirma tu cuenta',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="text-align: center; color: #333;">¡Confirma tu cuenta!</h2>
      <p style="text-align: center; color: #555;">
        Haz click <a href="${confirmLink}" style="color: #007bff; text-decoration: none;">aquí</a>
        para verificar tu cuenta
      </p>
      <p style="text-align: center; color: #555;">
        Si el botón no funciona, copia y pega este enlace en tu navegador:
        <br />
        <span style="color: #007bff;">${confirmLink}</span>
      </p>
      <p style="text-align: center; color: #888; font-size: 12px;">
        Este correo electrónico fue generado automáticamente. Por favor, no responder a este mensaje.
      </p>
    </div>
  `,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  // const resetLink = `http://localhost:3000/new-password?token=${token}`;

  const isDevelopment = process.env.NODE_ENV === 'development';

  const developmentBaseURL = 'http://localhost:3000';
  const productionBaseURL = 'https://savemelin.com';

  const resetLink = isDevelopment
    ? `${developmentBaseURL}/new-verification?token=${token}`
    : `${productionBaseURL}/new-verification?token=${token}`;

  await resend.emails.send({
    from: 'hello@webgeenix.com',
    to: email,
    subject: 'Reiniciar Contraseña',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="text-align: center; color: #333;">Reinicia tu contraseña!</h2>
      <p style="text-align: center; color: #555;">
        Haz click <a href="${resetLink}" style="color: #007bff; text-decoration: none;">aquí</a>
        para reinciar tu contraseña.
      </p>
      <p style="text-align: center; color: #555;">
        Si el botón no funciona, copia y pega este enlace en tu navegador:
        <br />
        <span style="color: #007bff;">${resetLink}</span>
      </p>
      <p style="text-align: center; color: #888; font-size: 12px;">
        Este correo electrónico fue generado automáticamente. Por favor, no responder a este mensaje.
      </p>
    </div>
  `,
  });
};
