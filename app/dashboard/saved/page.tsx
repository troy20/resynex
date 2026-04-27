import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export default async function Saved(){const user=await requireUser(); const items=await prisma.savedItem.findMany({where:{userId:user.id},include:{problem:true,facility:true,communityPost:true}}); return <div><h1 className="text-3xl font-bold">Saved</h1><div className="mt-6 space-y-3">{items.length===0&&<p>No saved items yet.</p>}{items.map(i=><div key={i.id} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">{i.problem?.title||i.facility?.title||i.communityPost?.title}</div>)}</div></div>}
