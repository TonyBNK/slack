import dotenv from "dotenv";
import { createTransport } from "nodemailer";

dotenv.config();

class MailService {
  transporter;

  constructor() {
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivationLink(email: string, link: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Account activation on " + process.env.API_URL,
      text: "",
      html: `
      <div>
          <h1>Follow the <a href="${process.env.API_URL}/auth/activate/${link}">link</a> for account activation</h1>
      </div>
      `,
    });
  }
}

export default new MailService();
