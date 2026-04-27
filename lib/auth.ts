import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
export const SESSION_COOKIE = "resynex_session";
export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now()+1000*60*60*24*30);
  await prisma.session.create({data:{token,userId,expiresAt}});
  (await cookies()).set(SESSION_COOKIE, token, { httpOnly:true, sameSite:"lax", path:"/", expires:expiresAt });
}
export async function getCurrentUser() {
  const token=(await cookies()).get(SESSION_COOKIE)?.value;
  if(!token) return null;
  const session=await prisma.session.findUnique({where:{token}, include:{user:true}});
  if(!session||session.expiresAt<new Date()) return null;
  return session.user;
}
export async function requireUser() { const user=await getCurrentUser(); if(!user) throw new Error("Unauthorized"); return user; }
export async function clearSession() { const token=(await cookies()).get(SESSION_COOKIE)?.value; if(token) await prisma.session.deleteMany({where:{token}}); (await cookies()).delete(SESSION_COOKIE); }
export function requireVerified(user: { emailVerifiedAt: Date | null }) { if(!user.emailVerifiedAt) throw new Error("Please verify your email first."); }
