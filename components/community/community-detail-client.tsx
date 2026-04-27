"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    fullName: string;
    role: string;
  };
}

interface Post {
  id: string;
  title: string;
  content: string;
  type: string;
  topic: string | null;
  createdAt: string;
  author: {
    id: string;
    fullName: string;
    role: string;
  };
  comments: Comment[];
  _count: {
    reactions: number;
  };
  userReaction: boolean;
}

export function CommunityDetailClient({ post }: { post: Post }) {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liked, setLiked] = useState(post.userReaction);
  const [likeCount, setLikeCount] = useState(post._count.reactions);

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/community/${post.id}/like`, { method: "POST" });
      const data = await res.json();
      setLiked(data.liked);
      setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));
    } catch (error) {
      console.error("Failed to like:", error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/community/${post.id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      if (res.ok) {
        const comment = await res.json();
        setComments([...comments, comment]);
        setNewComment("");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <article className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center gap-2 text-sm text-blue-700">
          <span className="rounded-full bg-blue-100 px-3 py-1 font-medium">{post.type}</span>
          {post.topic && <span className="text-slate-500">· {post.topic}</span>}
        </div>

        <h1 className="mt-4 text-3xl font-bold">{post.title}</h1>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {post.author.fullName.charAt(0)}
          </div>
          <div>
            <div className="font-medium">{post.author.fullName}</div>
            <div className="text-sm text-slate-500 capitalize">{post.author.role}</div>
          </div>
        </div>

        <div className="mt-6 whitespace-pre-wrap leading-8 text-slate-700">{post.content}</div>

        <div className="mt-6 flex items-center gap-4 border-t pt-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              liked ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <svg className="h-5 w-5" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {likeCount} {likeCount === 1 ? "Like" : "Likes"}
          </button>
          <span className="text-sm text-slate-500">{comments.length} comments</span>
        </div>
      </article>

      <section className="mt-8">
        <h2 className="text-xl font-bold">Comments</h2>

        <form onSubmit={handleSubmitComment} className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full rounded-xl border border-slate-200 p-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            rows={3}
          />
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="mt-2 rounded-xl bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </button>
        </form>

        <div className="mt-6 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-sm font-semibold">
                  {comment.author.fullName.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{comment.author.fullName}</div>
                  <div className="text-xs text-slate-500 capitalize">{comment.author.role}</div>
                </div>
              </div>
              <p className="mt-3 text-slate-700">{comment.content}</p>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-center text-slate-500">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </section>
    </main>
  );
}