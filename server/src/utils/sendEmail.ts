import nodemailer from "nodemailer";
import config from "config";

// 🔍 Ensure keys match `default.json`
const userEmail: string = config.get<string>("EMAIL");
const userAppPassword: string = config.get<string>("Password"); 

console.log("🔍 Loaded Config:", { userEmail, userAppPassword });

async function sendEmail(emailData: { to: string; subject: string; text?: string; html?: string }): Promise<void> {
    try {
      if (!userEmail || !userAppPassword) {
        throw new Error("Missing EMAIL or Password in config.");
      }
  
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: userEmail,
          pass: userAppPassword,
        },
      });
  
      let info = await transporter.sendMail({
        from: `"Syed Omer Ali" <${userEmail}>`,
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html,
      });
  
      console.log(`✅ Email sent successfully to ${emailData.to}: ${info.messageId}`);
    } catch (error: any) {
      console.error(`❌ Error sending email: ${error.message || error}`);
    }
  }
  
  export default sendEmail;