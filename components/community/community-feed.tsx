"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Post {
  id: string;
  type: string;
  title: string;
  content: string;
  topic?: string;
  tags: string[];
  createdAt: string;
  author: { id: string; fullName: string; role: string; avatarUrl?: string };
  _count: { comments: number; reactions: number };
  userReaction?: boolean;
}

export function CommunityFeed() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newPost, setNewPost] = useState({ type: "POST", title: "", content: "", topic: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await fetch("/api/community");
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    });
    if (res.ok) {
      setShowCreate(false);
      setNewPost({ type: "POST", title: "", content: "", topic: "" });
      fetchPosts();
    }
    setSubmitting(false);
  };

  const handleLike = async (postId: string) => {
    await fetch(`/api/community/${postId}/like`, { method: "POST" });
    fetchPosts();
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">
      {[1,2,3].map(i => <div key={i} className="h-48 bg-slate-200 rounded-2xl"></div>)}
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Create Post Button */}
      <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-slate-200">
        <div 
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            +
          </div>
          <div className="flex-1 bg-slate-100 rounded-full px-4 py-3 text-slate-500">
            What's on your mind?
          </div>
        </div>
        
        {showCreate && (
          <form onSubmit={handleCreate} className="mt-4 space-y-4">
            <select
              value={newPost.type}
              onChange={e => setNewPost({ ...newPost, type: e.target.value })}
              className="w-full rounded-xl border px-4 py-2"
            >
              <option value="POST">Post</option>
              <option value="QUESTION">Question</option>
              <option value="DISCUSSION">Discussion</option>
              <option value="ANNOUNCEMENT">Announcement</option>
            </select>
            <input
              value={newPost.title}
              onChange={e => setNewPost({ ...newPost, title: e.target.value })}
              placeholder="Title (optional)"
              className="w-full rounded-xl border px-4 py-2"
            />
            <textarea
              value={newPost.content}
              onChange={e => setNewPost({ ...newPost, content: e.target.value })}
              placeholder="Share your thoughts..."
              rows={4}
              className="w-full rounded-xl border px-4 py-2"
              required
            />
            <input
              value={newPost.topic}
              onChange={e => setNewPost({ ...newPost, topic: e.target.value })}
              placeholder="Topic (optional)"
              className="w-full rounded-xl border px-4 py-2"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-medium hover:bg-blue-700"
              >
                {submitting ? "Posting..." : "Post"}
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 border rounded-xl"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Posts Feed */}
      {posts.map(post => (
        <div key={post.id} className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
          {/* Post Header */}
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
              {post.author.fullName[0]}
            </div>
            <div>
              <Link href={`/profiles/${post.author.id}`} className="font-semibold text-blue-700 hover:underline">
                {post.author.fullName}
              </Link>
              <div className="text-xs text-slate-500">
                {post.author.role} · {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
            {post.topic && (
              <span className="ml-auto px-3 py-1 bg-slate-100 rounded-full text-xs">
                {post.topic}
              </span>
            )}
          </div>

          {/* Post Content */}
          <div className="px-4 pb-2">
            {post.title && <h3 className="font-semibold text-lg">{post.title}</h3>}
            <p className="text-slate-700 whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Post Tags */}
          {post.tags.length > 0 && (
            <div className="px-4 pb-3 flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs text-blue-600">#{tag}</span>
              ))}
            </div>
          )}

          {/* Post Actions */}
          <div className="px-4 py-3 border-t flex gap-4">
            <button
              onClick={() => handleLike(post.id)}
              className={`flex items-center gap-2 text-sm ${post.userReaction ? "text-blue-600" : "text-slate-500"}`}
            >
              {post.userReaction ? "❤️" : "🤍"} {post._count.reactions}
            </button>
            <button
              onClick={() => router.push(`/community/${post.id}`)}
              className="flex items-center gap-2 text-sm text-slate-500"
            >
              💬 {post._count.comments}
            </button>
            <button className="flex items-center gap-2 text-sm text-slate-500">
              🔗 Share
            </button>
          </div>
        </div>
      ))}

      {posts.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No posts yet. Be the first to share something!
        </div>
      )}
    </div>
  );
}