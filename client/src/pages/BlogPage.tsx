import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBlogPosts, type BlogPostSummary } from "../lib/api";
import { formatShortDate } from "../lib/dates";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPosts()
      .then(setPosts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="bg-cream-warm py-16 sm:py-20">
        <div className="container-site">
          <p className="eyebrow">Journal</p>
          <h1 className="heading-display mt-3 text-meadow">From the meadow</h1>
          <p className="mt-4 max-w-xl text-stone-dark">
            Local tips, seasonal updates, and stories from Tigley Meadow Coach House.
          </p>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="container-site max-w-3xl">
          {loading && <p className="text-stone">Loading…</p>}
          {!loading && posts.length === 0 && (
            <p className="text-stone-dark">No posts yet — check back soon.</p>
          )}
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="rounded-sm border border-meadow/10 bg-white p-8 transition hover:border-meadow/25"
              >
                {post.published_at && (
                  <time className="text-xs uppercase tracking-wider text-stone">
                    {formatShortDate(post.published_at.slice(0, 10))}
                  </time>
                )}
                <h2 className="mt-2 font-serif text-2xl text-meadow">
                  <Link to={`/blog/${post.slug}`} className="hover:text-terracotta">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-4 leading-relaxed text-stone-dark">{post.excerpt}</p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="mt-4 inline-block text-sm font-medium text-terracotta hover:underline"
                >
                  Read more →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
