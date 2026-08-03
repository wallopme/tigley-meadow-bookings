import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { PropertyMeta } from "../components/Header";
import { PROPERTY } from "../data/property";
import { getBlogPosts, type BlogPostSummary } from "../lib/api";

export default function HomePage() {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);

  useEffect(() => {
    getBlogPosts()
      .then((p) => setPosts(p.slice(0, 2)))
      .catch(() => {});
  }, []);

  return (
    <>
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        <img
          src={PROPERTY.heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-meadow-dark/90 via-meadow-dark/40 to-meadow-dark/20" />
        <div className="relative container-site pb-16 pt-32 sm:pb-20">
          <p className="eyebrow text-cream/70">{PROPERTY.distances}</p>
          <h1 className="heading-display mt-4 max-w-2xl text-cream">
            {PROPERTY.name}
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-cream/85">
            {PROPERTY.tagline} — a beautifully appointed retreat amongst rolling
            fields, open skies and the simple pleasures of Devon life.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/book" className="btn-terracotta">
              Check Availability
            </Link>
            <Link to="/property" className="btn-outline !border-cream/40 !text-cream hover:!bg-cream/10">
              Explore the Property
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-meadow/10 bg-cream-warm py-16">
        <div className="container-site">
          <PropertyMeta />
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-site grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <p className="eyebrow">The Property</p>
            <h2 className="heading-section mt-3 text-meadow">
              Slow down in the South Devon countryside
            </h2>
            <p className="mt-6 leading-relaxed text-stone-dark">
              {PROPERTY.description.split("\n\n")[0]}
            </p>
            <Link to="/property" className="mt-8 inline-block text-sm font-medium text-terracotta hover:underline">
              View full details →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {PROPERTY.gallery.slice(0, 4).map((img) => (
              <img
                key={img.src}
                src={img.src}
                alt={img.alt}
                className="aspect-[4/3] w-full rounded-sm object-cover"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-meadow py-20 text-cream sm:py-28">
        <div className="container-site">
          <p className="eyebrow text-cream/60">Features</p>
          <h2 className="heading-section mt-3 text-cream">Everything you need</h2>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROPERTY.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-cream/85">
                <span className="mt-1 text-terracotta-light">✦</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-site">
          <p className="eyebrow">Location</p>
          <h2 className="heading-section mt-3 text-meadow">
            Perfectly placed for coast &amp; moor
          </h2>
          <p className="mt-4 max-w-2xl text-stone-dark">
            Dartington sits midway between Dartmoor National Park and the Devon
            coast — Totnes, Salcombe, Paignton and the South Hams all within
            easy reach.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PROPERTY.locationHighlights.slice(0, 3).map((loc) => (
              <div key={loc.title} className="rounded-sm border border-meadow/10 bg-white p-6">
                <p className="text-xs uppercase tracking-wider text-terracotta">{loc.distance}</p>
                <h3 className="mt-2 font-serif text-xl text-meadow">{loc.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-dark">{loc.description}</p>
              </div>
            ))}
          </div>
          <Link to="/location" className="mt-10 inline-block text-sm font-medium text-terracotta hover:underline">
            Explore the area →
          </Link>
        </div>
      </section>

      <section className="bg-cream-warm py-20 sm:py-28">
        <div className="container-site">
          <p className="eyebrow">Guest Reviews</p>
          <h2 className="heading-section mt-3 text-meadow">What guests say</h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {PROPERTY.reviews.map((r) => (
              <blockquote key={r.author} className="rounded-sm bg-white p-6 shadow-sm">
                <div className="flex gap-0.5 text-terracotta">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-stone-dark italic">
                  "{r.quote}"
                </p>
                <footer className="mt-4 text-xs text-stone">
                  — {r.author}, {r.date}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="py-20 sm:py-28">
          <div className="container-site">
            <p className="eyebrow">Journal</p>
            <h2 className="heading-section mt-3 text-meadow">From the meadow</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="group rounded-sm border border-meadow/10 bg-white p-6 transition hover:border-meadow/25"
                >
                  <h3 className="font-serif text-xl text-meadow group-hover:text-terracotta">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone-dark">{post.excerpt}</p>
                  <span className="mt-4 inline-block text-xs font-medium text-terracotta">
                    Read more →
                  </span>
                </Link>
              ))}
            </div>
            <Link to="/blog" className="mt-10 inline-block text-sm font-medium text-terracotta hover:underline">
              All journal posts →
            </Link>
          </div>
        </section>
      )}

      <section className="bg-meadow-dark py-20 text-center sm:py-28">
        <div className="container-site">
          <h2 className="font-serif text-3xl text-cream sm:text-4xl">
            Ready for your Devon escape?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-cream/70">
            Check availability and send a booking request — we'll confirm and
            send payment details by email.
          </p>
          <Link to="/book" className="btn-terracotta mt-8">
            Book Your Stay
          </Link>
        </div>
      </section>
    </>
  );
}
