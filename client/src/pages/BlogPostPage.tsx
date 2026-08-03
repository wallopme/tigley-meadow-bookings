import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { getBlogPost, type BlogPost } from "../lib/api";
import { formatShortDate } from "../lib/dates";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    getBlogPost(slug)
      .then(setPost)
      .catch(() => setError("Post not found"));
  }, [slug]);

  if (error) {
    return (
      <div className="container-site py-32 text-center">
        <p className="text-stone-dark">{error}</p>
        <Link to="/blog" className="mt-4 inline-block text-terracotta hover:underline">
          ← Back to journal
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container-site py-32 text-center text-stone">
        Loading…
      </div>
    );
  }

  return (
    <>
      <article className="py-16 sm:py-20">
        <div className="container-site max-w-prose">
          <Link to="/blog" className="text-sm text-terracotta hover:underline">
            ← Journal
          </Link>
          {post.published_at && (
            <time className="mt-6 block text-xs uppercase tracking-wider text-stone">
              {formatShortDate(post.published_at.slice(0, 10))}
            </time>
          )}
          <h1 className="heading-section mt-3 text-meadow">{post.title}</h1>
          <div className="prose-meadow mt-10">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>
      </article>
    </>
  );
}
