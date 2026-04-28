"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchResult {
  users?: { id: string; fullName: string; role: string; avatarUrl?: string }[];
  groups?: { id: string; name: string; type: string; _count: { members: number } }[];
  posts?: { id: string; title: string; content: string; author: { id: string; fullName: string } }[];
}

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult>({ users: [], groups: [], posts: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const search = async () => {
      if (query.length < 2) {
        setResults({ users: [], groups: [], posts: [] });
        return;
      }
      setLoading(true);
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
      setLoading(false);
    };
    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  const hasResults = (results.users?.length ?? 0) > 0 || (results.groups?.length ?? 0) > 0 || (results.posts?.length ?? 0) > 0;

  return (
    <div ref={containerRef} className="relative">
      <form onSubmit={handleSubmit} className="flex items-center">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search users, groups, posts..."
            className="w-64 rounded-full bg-white/10 border border-white/20 px-4 py-2 pl-10 text-sm text-white placeholder-white/60 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full mt-2 w-96 rounded-xl bg-white shadow-xl ring-1 ring-slate-200 overflow-hidden z-50">
          {loading ? (
            <div className="p-4 text-center text-slate-500">Searching...</div>
          ) : !hasResults ? (
            <div className="p-4 text-center text-slate-500">No results found</div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {/* Users */}
              {results.users && results.users.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase">Users</div>
                  {results.users.map((u) => (
                    <Link
                      key={u.id}
                      href={`/profiles/${u.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 rounded-lg p-2 hover:bg-slate-100"
                    >
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                        {u.fullName[0]}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{u.fullName}</div>
                        <div className="text-xs text-slate-500 capitalize">{u.role.toLowerCase()}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Groups */}
              {results.groups && results.groups.length > 0 && (
                <div className="p-2 border-t">
                  <div className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase">Groups</div>
                  {results.groups.map((g) => (
                    <Link
                      key={g.id}
                      href={`/community/groups/${g.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 rounded-lg p-2 hover:bg-slate-100"
                    >
                      <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">
                        👥
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">{g.name}</div>
                        <div className="text-xs text-slate-500">{g._count.members} members</div>
                      </div>
                      {g.type !== "PUBLIC" && <span className="text-xs">🔒</span>}
                    </Link>
                  ))}
                </div>
              )}

              {/* Posts */}
              {results.posts && results.posts.length > 0 && (
                <div className="p-2 border-t">
                  <div className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase">Posts</div>
                  {results.posts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/community/${p.id}`}
                      onClick={() => setIsOpen(false)}
                      className="block rounded-lg p-2 hover:bg-slate-100"
                    >
                      <div className="font-medium text-slate-900 line-clamp-1">{p.title}</div>
                      <div className="text-xs text-slate-500">by {p.author.fullName}</div>
                    </Link>
                  ))}
                </div>
              )}

              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={() => setIsOpen(false)}
                className="block border-t p-3 text-center text-sm font-medium text-blue-600 hover:bg-slate-50"
              >
                See all results
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}