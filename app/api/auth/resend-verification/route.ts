import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail, generateVerificationCode } from "@/lib/email";

export async function POST() { 
  const user = await requireUser(); 
  const code = generateVerificationCode();
  
  await prisma.emailVerificationToken.create({
    data: {
      token: code,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });
  
  await sendVerificationEmail(user.email, code); 
  return Response.json({ok:true}); 
}
