'use server';

import { EmailContent, EmailProductInfo, NotificationType } from '@/types';
import nodemailer from 'nodemailer';

const Notification = {
  WELCOME: 'WELCOME',
  CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
  LOWEST_PRICE: 'LOWEST_PRICE',
  THRESHOLD_MET: 'THRESHOLD_MET',
};

export async function generateEmailBody(product: EmailProductInfo, type: NotificationType) {
  const THRESHOLD_PERCENTAGE = 40;

  // Shorten the product title
  const shortenedTitle = product.title.length > 20 ? `${product.title.substring(0, 20)}...` : product.title;

  let subject = '';
  let body = '';

  switch (type) {
    case Notification.WELCOME:
      subject = `Bienvenido al Seguimiento de Precios por ${shortenedTitle}`;
      body = `
	  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
	  <h2 style="color: #333333; text-align: center; margin-bottom: 20px;">¡Bienvenido a Savemelin 🚀!</h2>
	  <p style="color: #555555;">Ahora estás siguiendo ${product.title}.</p>
	  <p style="color: #555555;">Este es un ejemplo de cómo recibirás las actualizaciones:</p>
	  <div style="border: 1px solid #e8e8e8; padding: 20px; background-color: #f8f8f8; margin-bottom: 20px;">
		<h3 style="color: #333333; margin-bottom: 10px;">${product.title} ¡ha vuelto a estar en stock!</h3>
		<p style="color: #555555; margin-bottom: 15px;">¡Estamos emocionados de hacerte saber que ${product.title} está de nuevo en stock!</p>
		<p style="color: #555555; margin-bottom: 5px;">¡No te lo pierdas! - <a href="${product.url}" target="_blank" rel="noopener noreferrer" style="color: #007BFF; text-decoration: none;">¡Compra ahora!</a></p>
	  </div>
	  <p style="color: #555555;">Mantente atento a más actualizaciones sobre ${product.title} y otros productos que estás siguiendo.</p>
	</div>
	
        `;
      break;

    case Notification.CHANGE_OF_STOCK:
      subject = `${shortenedTitle} esta nuevamente en stock!`;
      body = `
          <div>
            <h4>Hola, ${product.title} fue reestockeado! Consiga el suyo antes de que se acaben nuevamente!</h4>
            <p>Chequea el producto <a href="${product.url}" target="_blank" rel="noopener noreferrer">aquí</a>.</p>
          </div>
        `;
      break;

    case Notification.LOWEST_PRICE:
      subject = `Alerta de menor precio para ${shortenedTitle}`;
      body = `
          <div>
            <h4>Hola, ${product.title} ha alcanzado su menor precio!!</h4>
            <p>Compra el producto <a href="${product.url}" target="_blank" rel="noopener noreferrer">aquío</a> ahora.</p>
          </div>
        `;
      break;

    case Notification.THRESHOLD_MET:
      subject = `Alerta de descuento para ${shortenedTitle}`;
      body = `
          <div>
            <h4>Hola!, ${product.title} ya esta disponible con un descuento mayor al ${THRESHOLD_PERCENTAGE}%!</h4>
            <p>Aprovecha la oportunidad ahora mismo!<a href="${product.url}" target="_blank" rel="noopener noreferrer">aquí</a>.</p>
          </div>
        `;
      break;

    default:
      throw new Error('Invalid notification type.');
  }

  return { subject, body };
}

export const sendEmail = async (emailContent: EmailContent, sendTo: string[]) => {
  const transporter = nodemailer.createTransport({
    pool: true,
    service: 'hotmail',
    port: 2525,
    auth: {
      user: 'tiendademarquillas@hotmail.com',
      pass: process.env.EMAIL_PASSWORD,
    },
    maxConnections: 1,
  });

  const mailOptions = {
    from: 'tiendademarquillas@hotmail.com',
    to: sendTo,
    html: emailContent.body,
    subject: emailContent.subject,
  };

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) return console.log(error);

    console.log('Email sent: ', info);
  });
};
