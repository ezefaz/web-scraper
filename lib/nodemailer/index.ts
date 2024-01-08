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
          <img src="${product.image}" alt="${product.title}" style="max-width: 100%; margin-bottom: 20px width: 50%; margin: auto;">
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
      subject = `${shortenedTitle} está nuevamente en stock!`;
      body = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src='./logo.svg' alt="Company Logo" style="max-width: 150px;">
            </div>
            <h2 style="color: #333; text-align: center;">¡Hola!</h2>
            <div style="background-color: #f9f9f9; border-radius: 5px; padding: 20px;">
              <h3 style="color: #333; margin-bottom: 20px;">${product.title} fue reestockeado! ¡Consigue el tuyo antes de que se acaben nuevamente!</h3>
              <img src="${product.image}" alt="${product.title}" style="max-width: 100%; margin-bottom: 20px width: 50%; margin: auto;">
              <p style="color: #333;">¡Chequea el producto ahora!</p>
              <a href="${product.url}" target="_blank" style="display: inline-block; text-decoration: none; padding: 10px 20px; background-color: #007bff; color: #fff; border-radius: 3px; margin-top: 20px;">Ver producto</a>
            </div>
            <p style="color: #777; margin-top: 20px; text-align: center;">¡Gracias por utilizar nuestro servicio!</p>
          </div>
        `;
      break;

    case Notification.LOWEST_PRICE:
      subject = `Alerta de menor precio para ${shortenedTitle}`;
      body = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
              </div>
          <h2 style="color: #333; text-align: center;">¡Hola!</h2>
          <div style="background-color: #f9f9f9; border-radius: 5px; padding: 20px;">
            <h3 style="color: #333; margin-bottom: 20px;">${product.title} ha alcanzado su precio más bajo.</h3>
            <img src="${product.image}" alt="${product.title}" style="max-width: 100%; margin-bottom: 20px width: 50%;">
            <p style="color: #333; text-align: center; margin-top: 10px;">¡Aprovecha ahora!</p>
            <a href="${product.url}" target="_blank" style="display: inline-block; text-decoration: none; padding: 10px 20px; background-color: #007bff; color: #fff; border-radius: 3px; margin-top: 20px; margin: auto;">Comprar ahora</a>
          </div>
          <p style="color: #777; margin-top: 20px; text-align: center;">¡Gracias por utilizar nuestro servicio!</p>
        </div>
      `;

      break;

    case Notification.THRESHOLD_MET:
      subject = `Alerta de descuento para ${shortenedTitle}`;
      body = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
      </div>
      <h2 style="color: #333; text-align: center;">¡Hola!</h2>
      <div style="background-color: #f9f9f9; border-radius: 5px; padding: 20px;">
        <h3 style="color: #333; margin-bottom: 20px;">¡${product.title} ahora tiene un descuento mayor al ${THRESHOLD_PERCENTAGE}%!</h3>
        <img src=${product.image} alt="${product.title}" style="max-width: 100%; margin-bottom: 20px;">
        <p style="color: #333;">¡Aprovecha esta oportunidad!</p>
        <a href="${product.url}" target="_blank" style="display: inline-block; text-decoration: none; padding: 10px 20px; background-color: #007bff; color: #fff; border-radius: 3px; margin-top: 20px; margin: auto;">Comprar ahora</a>
      </div>
      <p style="color: #777; margin-top: 20px; text-align: center;">¡No dejes pasar esta oferta especial!</p>
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
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    maxConnections: 1,
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: sendTo,
    html: emailContent.body,
    subject: emailContent.subject,
  };

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) return console.log(error);

    console.log('Email sent: ', info);
  });
};
