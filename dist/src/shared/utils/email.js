import nodemailer from 'nodemailer';
import { env } from '../../config/env.js';
let transporter = null;
function getTransporter() {
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
export async function sendEmail(options) {
    const transport = getTransporter();
    await transport.sendMail({
        from: `Suporte <${env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
    });
}
//# sourceMappingURL=email.js.map