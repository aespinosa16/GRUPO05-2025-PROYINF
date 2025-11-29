const nodemailer = require("nodemailer");

const hasSMTP = process.env.MAIL_HOST && process.env.MAIL_USER && process.env.MAIL_PASS;

const transporter = hasSMTP
  ? nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT || 587),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    })
  : null;

async function enviarCorreo({ para, asunto, texto }) {
  if (!hasSMTP) {
    console.log(`[MAIL DEV] to=${para} subject="${asunto}" text="${texto}"`);
    return;
  }

  await transporter.sendMail({
    from: process.env.MAIL_FROM || "No Reply <noreply@app.local>",
    to: para,
    subject: asunto,
    text: texto,
  });
}

module.exports = { enviarCorreo };
