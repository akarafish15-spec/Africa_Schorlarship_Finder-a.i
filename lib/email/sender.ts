import nodemailer from "nodemailer";

// Gmail SMTP transporter using App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,       // akarafish15@gmail.com
    pass: process.env.GMAIL_APP_PASSWORD, // app password (no spaces)
  },
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const info = await transporter.sendMail({
    from: `"Aura AI" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log("[Email] Sent:", info.messageId);
  return info;
}
