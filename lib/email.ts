import { Resend } from "resend";
const from = process.env.EMAIL_FROM || "Resynex <noreply@example.com>";

// Generate a 6-digit verification code
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendVerificationEmail(email: string, code: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log("Verification code for", email, ":", code);
    return;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from,
    to: email,
    subject: "Your Resynex verification code",
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto;">
        <h2>Welcome to Resynex</h2>
        <p>Your verification code is:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px; background: #f3f4f6; border-radius: 8px; text-align: center;">
          ${code}
        </div>
        <p style="color: #6b7280; font-size: 14px;">This code expires in 24 hours.</p>
      </div>
    `
  });
}
