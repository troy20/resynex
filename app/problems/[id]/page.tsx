import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { money } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";
import { ProposalForm } from "@/components/proposal/proposal-form";

export default async function ProblemDetail({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const user = await getCurrentUser();
  const p=await prisma.problemPost.findUnique({where:{id},include:{user:true}});
  if(!p)notFound();
  const isLoggedIn = !!user;
  return <main className="mx-auto max-w-4xl px-6 py-10">
    <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <h1 className="text-3xl font-bold">{p.title}</h1>
      <div className="mt-3 text-slate-500">{p.field} · {money(p.budgetMin,p.budgetMax)}</div>
      <p className="mt-6 whitespace-pre-wrap leading-8 text-slate-700">{p.description}</p>
      {p.expectedOutcome && (
        <div className="mt-6 rounded-xl bg-slate-50 p-4">
          <h3 className="font-semibold text-slate-700">Expected Outcome</h3>
          <p className="mt-1 text-slate-600">{p.expectedOutcome}</p>
        </div>
      )}
      <div className="mt-8 flex gap-3">
        <a href="#proposal-form" className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white">Submit proposal</a>
        <button className="rounded-xl border px-5 py-3 font-semibold">Save</button>
      </div>
    </div>
    <div id="proposal-form">
      <ProposalForm problemId={p.id} isLoggedIn={isLoggedIn} />
    </div>
  </main>;
}
