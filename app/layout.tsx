import "./globals.css";
import type { Metadata } from "next";
import { MainNav } from "@/components/layout/main-nav";
export const metadata: Metadata = { title: "Resynex", description: "Research collaboration marketplace" };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body><MainNav />{children}</body></html>; }
