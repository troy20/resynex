import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
export default function DashboardLayout({children}:{children:React.ReactNode}){return <div className="flex"><DashboardSidebar/><main className="min-h-screen flex-1 bg-slate-50 p-6">{children}</main></div>}
