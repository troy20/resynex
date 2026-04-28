import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

const icons: Record<string, string> = {
  "/dashboard": "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  "/dashboard/profile": "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  "/dashboard/messages": "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  "/dashboard/saved": "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z",
  "/dashboard/verification": "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  "/community": "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z",
  "/dashboard/create/problem": "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  "/dashboard/create/facility": "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  "/dashboard/create/community-post": "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  "/facilities": "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  "/admin/verifications": "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
  "/dashboard/notifications": "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  "/dashboard/friends": "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
};

export async function DashboardSidebar() {
  const user = await getCurrentUser();
  const role = user?.role;

  const common = [
    ["/dashboard", "Home"],
    ["/dashboard/profile", "Profile"],
    ["/dashboard/messages", "Messages"],
    ["/dashboard/saved", "Saved"],
    ["/dashboard/verification", "Verification"],
    ["/dashboard/notifications", "Notifications"],
    ["/dashboard/friends", "Friends"],
    ["/community", "Community"],
  ];

  const roleLinks = role === "INDUSTRY"
    ? [["/dashboard/create/problem", "Post Problem"], ["/dashboard", "Proposals"]]
    : role === "UNIVERSITY"
    ? [["/dashboard/create/facility", "Add Facility"], ["/dashboard", "Facility Requests"]]
    : role === "ACADEMIC"
    ? [["/dashboard", "My Proposals"], ["/dashboard/create/community-post", "Create Post"]]
    : role === "STARTUP"
    ? [["/facilities", "Request Facilities"]]
    : role === "ADMIN"
    ? [["/admin/verifications", "Verification Queue"]]
    : [];

  const allLinks = [...common, ...roleLinks];
  const uniqueLinks = allLinks.filter((item, index, self) => self.findIndex((t) => t[0] === item[0]) === index);

  return (
    <aside className="min-h-screen w-64 border-r bg-white">
      {/* User Info */}
      <div className="border-b p-4">
        <Link href="/dashboard/profile" className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-100">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-semibold">
            {user?.fullName?.charAt(0) || "U"}
          </div>
          <div>
            <div className="font-semibold text-slate-900">{user?.fullName}</div>
            <div className="text-xs text-slate-500 capitalize">{role?.toLowerCase()}</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-3">
        <div className="space-y-1">
          {uniqueLinks.map(([href, label]) => {
            const isActive = href === "/dashboard";
            const iconPath = icons[href] || icons["/dashboard"];
            
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
                </svg>
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Quick Actions */}
      <div className="border-t p-4">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</div>
        <div className="space-y-1">
          <Link href="/facilities" className="flex items-center gap-3 rounded-xl px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse Facilities
          </Link>
          <Link href="/problems" className="flex items-center gap-3 rounded-xl px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Browse Problems
          </Link>
        </div>
      </div>
    </aside>
  );
}
