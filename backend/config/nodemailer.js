import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendActivationEmail = async (email, token) => {
  //const link = `${process.env.CLIENT_URL}/register?token=${token}`;
  const link = `${process.env.CLIENT_URL}` + token;

  const transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  transporter.verify((error, success) => {
    if (error) {
      console.error("SMTP error:", error);
    } else {
      console.log("SMTP is ready to send messages");
    }
  });

  const mailOptions = {
    from: `"RBAC System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Activate your account",
    html: `
    <h2>Welcome to the RBAC system</h2>
    <p>Click the link below to activate your account:</p>
    <a href="${link}">${link}</a>
    <p>This link will expire in 24 hours.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Activation email sent to ${email}`);
  } catch (err) {
    console.error("❌ Failed to send activation email:", err);
    throw err;
  }
};

export default sendActivationEmail;
