import nodemailer from 'nodemailer';
import { env } from '../../config/env.js';
import { EmailOptions } from '../types/index.js';

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  const transport = getTransporter();
  await transport.sendMail({
    from: `Suporte <${env.SMTP_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
}
