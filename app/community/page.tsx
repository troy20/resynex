import { CommunityFeed } from "@/components/community/community-feed";

export default function Community() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Community</h1>
        <p className="mt-2 text-slate-600">Connect, share, and collaborate with researchers and innovators.</p>
      </div>
      <CommunityFeed />
    </main>
  );
}
