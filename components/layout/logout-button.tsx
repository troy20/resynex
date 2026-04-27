"use client";
import { useRouter } from "next/navigation";
export function LogoutButton() { const router=useRouter(); async function logout(){ await fetch('/api/auth/logout',{method:'POST'}); router.push('/'); router.refresh(); } return <button onClick={logout} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-blue-50">Logout</button>; }
