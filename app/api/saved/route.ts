import { prisma } from "@/lib/prisma";
import { requireUser, requireVerified } from "@/lib/auth";
export async function GET() { const user=await requireUser(); const items=await prisma.savedItem.findMany({where:{userId:user.id},include:{problem:true,facility:true,communityPost:true},orderBy:{createdAt:"desc"}}); return Response.json({items}); }
export async function POST(req: Request) { const user=await requireUser(); requireVerified(user); const b=await req.json(); const item=await prisma.savedItem.create({data:{userId:user.id,type:b.type,problemId:b.problemId,facilityId:b.facilityId,communityPostId:b.communityPostId}}); return Response.json({item}); }
