import { randomBytes } from "crypto";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";
export async function POST() { const user=await requireUser(); const token=randomBytes(32).toString("hex"); await prisma.emailVerificationToken.create({data:{token,userId:user.id,expiresAt:new Date(Date.now()+1000*60*60*24)}}); await sendVerificationEmail(user.email, token); return Response.json({ok:true}); }
