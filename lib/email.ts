import { Resend } from "resend";
const from = process.env.EMAIL_FROM || "Resynex <noreply@example.com>";
export async function sendVerificationEmail(email: string, token: string) {
  const base = process.env.AUTH_URL || "http://localhost:3000";
  const url = `${base}/api/auth/verify-email?token=${token}`;
  if (!process.env.RESEND_API_KEY) {
    console.log("Verification link for", email, url);
    return;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({ from, to: email, subject: "Verify your Resynex email", html: `<h2>Welcome to Resynex</h2><p><a href="${url}">Verify your email</a></p>` });
}
