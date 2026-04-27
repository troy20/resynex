import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/layout/logout-button";

export async function MainNav() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-gradient-to-r from-slate-950 via-blue-900 to-slate-900 text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Resynex Logo" width={44} height={44} className="rounded-xl" />
          <div>
            <div className="text-xl font-bold tracking-wide">Resynex</div>
            <div className="text-xs text-blue-100/80">Research collaboration marketplace</div>
          </div>
        </Link>

        {!user ? (
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link href="/facilities" className="text-white/90 hover:text-white">Facilities</Link>
            <Link href="/problems" className="text-white/90 hover:text-white">Problems</Link>
            <Link href="/community" className="text-white/90 hover:text-white">Community</Link>
            <Link href="/about" className="text-white/90 hover:text-white">About</Link>
            <Link href="/contact" className="text-white/90 hover:text-white">Contact</Link>
            <a href="/#auth" className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-white backdrop-blur hover:bg-white/20">Log in</a>
          </nav>
        ) : (
          <nav className="flex items-center gap-2">
            {/* Top Bar Icons - Facebook Style */}
            <div className="flex items-center gap-1 mr-4">
              <Link href="/dashboard" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10" title="Dashboard">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </Link>
              
              <Link href="/community" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10" title="Community">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </Link>
              
              <Link href="/dashboard/messages" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10" title="Messages">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </Link>
              
              <Link href="/dashboard/notifications" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 relative" title="Notifications">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 h-3 w-3 rounded-full bg-red-500"></span>
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-2">
              <Link href="/dashboard/profile" className="flex items-center gap-2 rounded-full hover:bg-white/10 px-3 py-2">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-semibold">
                  {user.fullName?.charAt(0) || "U"}
                </div>
                <span className="text-sm font-medium hidden sm:inline">{user.fullName}</span>
              </Link>
              <LogoutButton />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
