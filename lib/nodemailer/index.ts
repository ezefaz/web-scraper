'use server';

import type { EmailContent, EmailProductInfo, NotificationType } from '../../types';
import { Resend } from 'resend';
import { buildSavemelinEmail } from '../email/template';

const resend = new Resend(process.env.RESEND_API_KEY);
const senderEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

const Notification = {
  WELCOME: 'WELCOME',
  CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
  LOWEST_PRICE: 'LOWEST_PRICE',
  THRESHOLD_MET: 'THRESHOLD_MET',
};

export async function generateEmailBody(product: EmailProductInfo, type: NotificationType) {
  const THRESHOLD_PERCENTAGE = 40;

  const shortenedTitle =
    product.title.length > 42 ? `${product.title.substring(0, 42)}...` : product.title;

  let subject = '';
  let body = '';

  switch (type) {
    case Notification.WELCOME:
      subject = `Ya estás siguiendo ${shortenedTitle}`;
      body = buildSavemelinEmail({
        preheader: `Comenzaste a seguir ${shortenedTitle}`,
        title: 'Producto guardado con éxito',
        subtitle:
          'A partir de ahora te avisaremos cuando detectemos oportunidades de ahorro.',
        contentHtml: `
          <p style="margin:0 0 14px;">Ahora estás siguiendo:</p>
          <div style="display:flex;gap:14px;align-items:center;padding:14px;background:#fafafa;border:1px solid #eaecf0;">
            <img src="${product.image}" alt="${product.title}" style="width:78px;height:78px;object-fit:cover;border:1px solid #eaecf0;background:#fff;" />
            <div>
              <p style="margin:0 0 6px;font-size:16px;line-height:1.45;font-weight:600;color:#101828;">${product.title}</p>
              <p style="margin:0;font-size:13px;line-height:1.5;color:#667085;">Seguimiento activo en Savemelin.</p>
            </div>
          </div>
        `,
        cta: {
          label: 'Ver producto seguido',
          href: product.url,
        },
      });
      break;

    case Notification.CHANGE_OF_STOCK:
      subject = `${shortenedTitle} volvió a estar en stock`;
      body = buildSavemelinEmail({
        preheader: `${shortenedTitle} volvió a estar disponible`,
        title: 'Producto nuevamente disponible',
        subtitle: 'Detectamos reposición de stock en el producto que sigues.',
        contentHtml: `
          <div style="display:flex;gap:14px;align-items:center;padding:14px;background:#fafafa;border:1px solid #eaecf0;">
            <img src="${product.image}" alt="${product.title}" style="width:78px;height:78px;object-fit:cover;border:1px solid #eaecf0;background:#fff;" />
            <div>
              <p style="margin:0 0 6px;font-size:16px;line-height:1.45;font-weight:600;color:#101828;">${product.title}</p>
              <p style="margin:0;font-size:13px;line-height:1.5;color:#667085;">Estado actualizado: disponible para compra.</p>
            </div>
          </div>
        `,
        cta: {
          label: 'Ver disponibilidad',
          href: product.url,
        },
      });
      break;

    case Notification.LOWEST_PRICE:
      subject = `Nuevo mínimo detectado para ${shortenedTitle}`;
      body = buildSavemelinEmail({
        preheader: `${shortenedTitle} alcanzó un menor precio`,
        title: 'Alerta de menor precio',
        subtitle: 'Detectamos una caída de precio relevante en tu producto seguido.',
        contentHtml: `
          <div style="display:flex;gap:14px;align-items:center;padding:14px;background:#fafafa;border:1px solid #eaecf0;">
            <img src="${product.image}" alt="${product.title}" style="width:78px;height:78px;object-fit:cover;border:1px solid #eaecf0;background:#fff;" />
            <div>
              <p style="margin:0 0 6px;font-size:16px;line-height:1.45;font-weight:600;color:#101828;">${product.title}</p>
              <p style="margin:0;font-size:13px;line-height:1.5;color:#667085;">Es un buen momento para revisar la oferta.</p>
            </div>
          </div>
        `,
        cta: {
          label: 'Ver oferta',
          href: product.url,
        },
      });

      break;

    case Notification.THRESHOLD_MET:
      subject = `Descuento detectado en ${shortenedTitle}`;
      body = buildSavemelinEmail({
        preheader: `${shortenedTitle} superó tu umbral de descuento`,
        title: 'Alerta de descuento',
        subtitle: `El producto superó un descuento estimado del ${THRESHOLD_PERCENTAGE}%.`,
        contentHtml: `
          <div style="display:flex;gap:14px;align-items:center;padding:14px;background:#fafafa;border:1px solid #eaecf0;">
            <img src="${product.image}" alt="${product.title}" style="width:78px;height:78px;object-fit:cover;border:1px solid #eaecf0;background:#fff;" />
            <div>
              <p style="margin:0 0 6px;font-size:16px;line-height:1.45;font-weight:600;color:#101828;">${product.title}</p>
              <p style="margin:0;font-size:13px;line-height:1.5;color:#667085;">Tu regla de descuento se activó. Revísalo antes de que cambie.</p>
            </div>
          </div>
        `,
        cta: {
          label: 'Aprovechar oferta',
          href: product.url,
        },
      });

      break;

    default:
      throw new Error('Invalid notification type.');
  }

  return { subject, body };
}

export const sendEmail = async (emailContent: EmailContent, sendTo: string[]) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Missing RESEND_API_KEY');
  }

  await resend.emails.send({
    from: senderEmail,
    to: sendTo,
    subject: emailContent.subject,
    html: emailContent.body,
  });
};
