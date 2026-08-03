import { useEffect, useState } from "react";
import {
  adminCreateBlockedDate,
  adminCreateBlogPost,
  adminDeleteBlockedDate,
  adminDeleteBlogPost,
  adminDeleteBooking,
  adminGetBlockedDates,
  adminGetBlogPosts,
  adminGetBookings,
  adminGetSettings,
  adminLogin,
  adminUpdateBlogPost,
  adminUpdateBooking,
  adminUpdateSettings,
  clearAdminToken,
  getStoredAdminToken,
  storeAdminToken,
  type BlockedDate,
  type BlogPost,
  type Booking,
  type SiteSettings,
} from "../lib/api";
import { formatDate, formatShortDate, slugify } from "../lib/dates";

type Tab = "bookings" | "availability" | "blog" | "settings";

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(getStoredAdminToken());
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<Tab>("bookings");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    try {
      const { token: t } = await adminLogin(password);
      storeAdminToken(t);
      setToken(t);
      setPassword("");
    } catch {
      setLoginError("Invalid password");
    }
  }

  function logout() {
    clearAdminToken();
    setToken(null);
  }

  if (!token) {
    return (
      <div className="container-site flex min-h-[60vh] items-center justify-center py-20">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <h1 className="font-serif text-2xl text-meadow">Owner login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="input"
            required
          />
          {loginError && <p className="text-sm text-terracotta-dark">{loginError}</p>}
          <button type="submit" className="btn-primary w-full">
            Sign in
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container-site py-10 sm:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl text-meadow">Manage bookings</h1>
        <button type="button" onClick={logout} className="text-sm text-stone hover:text-meadow">
          Sign out
        </button>
      </div>

      <nav className="mt-8 flex flex-wrap gap-2 border-b border-meadow/10 pb-4">
        {(
          [
            ["bookings", "Bookings"],
            ["availability", "Blocked dates"],
            ["blog", "Journal"],
            ["settings", "Settings"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-sm px-4 py-2 text-sm transition ${
              tab === id
                ? "bg-meadow text-cream"
                : "text-stone-dark hover:bg-meadow/5"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-8">
        {tab === "bookings" && <BookingsPanel token={token} />}
        {tab === "availability" && <BlockedDatesPanel token={token} />}
        {tab === "blog" && <BlogPanel token={token} />}
        {tab === "settings" && <SettingsPanel token={token} />}
      </div>
    </div>
  );
}

function BookingsPanel({ token }: { token: string }) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  async function load() {
    const data = await adminGetBookings(token);
    setBookings(data);
  }

  useEffect(() => {
    load().catch(() => {});
  }, [token]);

  async function updateStatus(id: number, status: Booking["status"]) {
    await adminUpdateBooking(token, id, status);
    load();
  }

  async function remove(id: number) {
    if (!confirm("Delete this booking?")) return;
    await adminDeleteBooking(token, id);
    load();
  }

  if (bookings.length === 0) {
    return <p className="text-stone-dark">No bookings yet.</p>;
  }

  return (
    <div className="space-y-4">
      {bookings.map((b) => (
        <div key={b.id} className="rounded-sm border border-meadow/15 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-medium text-meadow">{b.guest_name}</p>
              <p className="text-sm text-stone-dark">{b.email}</p>
              {b.phone && <p className="text-sm text-stone">{b.phone}</p>}
            </div>
            <StatusBadge status={b.status} />
          </div>
          <p className="mt-3 text-sm">
            {formatDate(b.check_in)} → {formatDate(b.check_out)} · {b.guests} guests
          </p>
          {b.message && (
            <p className="mt-2 text-sm italic text-stone-dark">"{b.message}"</p>
          )}
          <p className="mt-2 text-xs text-stone">
            Requested {formatShortDate(b.created_at.slice(0, 10))}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {b.status !== "confirmed" && (
              <button
                type="button"
                onClick={() => updateStatus(b.id, "confirmed")}
                className="rounded-sm bg-meadow px-3 py-1.5 text-xs text-cream"
              >
                Confirm
              </button>
            )}
            {b.status !== "cancelled" && (
              <button
                type="button"
                onClick={() => updateStatus(b.id, "cancelled")}
                className="rounded-sm border border-meadow/20 px-3 py-1.5 text-xs text-stone-dark"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={() => remove(b.id)}
              className="rounded-sm px-3 py-1.5 text-xs text-terracotta-dark hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: Booking["status"] }) {
  const colors = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-stone/20 text-stone-dark",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${colors[status]}`}>
      {status}
    </span>
  );
}

function BlockedDatesPanel({ token }: { token: string }) {
  const [blocked, setBlocked] = useState<BlockedDate[]>([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");

  async function load() {
    setBlocked(await adminGetBlockedDates(token));
  }

  useEffect(() => {
    load().catch(() => {});
  }, [token]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await adminCreateBlockedDate(token, {
      start_date: start,
      end_date: end,
      reason: reason || undefined,
    });
    setStart("");
    setEnd("");
    setReason("");
    load();
  }

  async function remove(id: number) {
    await adminDeleteBlockedDate(token, id);
    load();
  }

  return (
    <div>
      <form onSubmit={add} className="mb-8 grid gap-4 rounded-sm border border-meadow/15 bg-white p-5 sm:grid-cols-4">
        <input type="date" required value={start} onChange={(e) => setStart(e.target.value)} className="input" />
        <input type="date" required value={end} onChange={(e) => setEnd(e.target.value)} className="input" />
        <input type="text" placeholder="Reason (optional)" value={reason} onChange={(e) => setReason(e.target.value)} className="input" />
        <button type="submit" className="btn-primary">Block dates</button>
      </form>

      {blocked.length === 0 ? (
        <p className="text-stone-dark">No blocked dates.</p>
      ) : (
        <ul className="space-y-2">
          {blocked.map((b) => (
            <li key={b.id} className="flex items-center justify-between rounded-sm border border-meadow/10 bg-white px-4 py-3 text-sm">
              <span>
                {formatDate(b.start_date)} → {formatDate(b.end_date)}
                {b.reason && <span className="ml-2 text-stone">({b.reason})</span>}
              </span>
              <button type="button" onClick={() => remove(b.id)} className="text-terracotta-dark hover:underline">
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BlogPanel({ token }: { token: string }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    published: false,
  });

  async function load() {
    setPosts(await adminGetBlogPosts(token));
  }

  useEffect(() => {
    load().catch(() => {});
  }, [token]);

  function startNew() {
    setEditing(null);
    setForm({ title: "", slug: "", excerpt: "", content: "", published: false });
  }

  function startEdit(post: BlogPost) {
    setEditing(post);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      published: post.published === 1,
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await adminUpdateBlogPost(token, editing.id, {
        ...form,
        published: form.published,
      });
    } else {
      await adminCreateBlogPost(token, {
        ...form,
        published: form.published,
      });
    }
    startNew();
    load();
  }

  async function remove(id: number) {
    if (!confirm("Delete this post?")) return;
    await adminDeleteBlogPost(token, id);
    load();
  }

  async function togglePublish(post: BlogPost) {
    await adminUpdateBlogPost(token, post.id, {
      published: post.published !== 1,
    });
    load();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl text-meadow">Posts</h2>
          <button type="button" onClick={startNew} className="text-sm text-terracotta hover:underline">
            + New post
          </button>
        </div>
        <ul className="space-y-3">
          {posts.map((p) => (
            <li key={p.id} className="rounded-sm border border-meadow/10 bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-meadow">{p.title}</p>
                  <p className="text-xs text-stone">
                    {p.published ? "Published" : "Draft"} · /blog/{p.slug}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex gap-3 text-xs">
                <button type="button" onClick={() => startEdit(p)} className="text-terracotta hover:underline">
                  Edit
                </button>
                <button type="button" onClick={() => togglePublish(p)} className="text-stone-dark hover:underline">
                  {p.published ? "Unpublish" : "Publish"}
                </button>
                <button type="button" onClick={() => remove(p.id)} className="text-terracotta-dark hover:underline">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={save} className="space-y-4 rounded-sm border border-meadow/15 bg-white p-5">
        <h2 className="font-serif text-xl text-meadow">
          {editing ? "Edit post" : "New post"}
        </h2>
        <input
          type="text"
          placeholder="Title"
          required
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
              slug: form.slug || slugify(e.target.value),
            })
          }
          className="input"
        />
        <input
          type="text"
          placeholder="Slug"
          required
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className="input"
        />
        <input
          type="text"
          placeholder="Excerpt"
          required
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          className="input"
        />
        <textarea
          placeholder="Content (Markdown supported)"
          required
          rows={10}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="input resize-none font-mono text-xs"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          Publish immediately
        </label>
        <button type="submit" className="btn-primary">
          {editing ? "Save changes" : "Create post"}
        </button>
      </form>
    </div>
  );
}

function SettingsPanel({ token }: { token: string }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminGetSettings(token).then(setSettings).catch(() => {});
  }, [token]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    const updated = await adminUpdateSettings(token, settings);
    setSettings(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!settings) return <p className="text-stone">Loading…</p>;

  return (
    <form onSubmit={save} className="max-w-md space-y-4">
      <Field label="Nightly rate (£)" value={settings.nightly_rate} onChange={(v) => setSettings({ ...settings, nightly_rate: v })} />
      <Field label="Minimum nights" value={settings.min_nights} onChange={(v) => setSettings({ ...settings, min_nights: v })} />
      <Field label="Max guests" value={settings.max_guests} onChange={(v) => setSettings({ ...settings, max_guests: v })} />
      <Field label="Contact email" value={settings.contact_email} onChange={(v) => setSettings({ ...settings, contact_email: v })} />
      <Field
        label="Instagram URL"
        value={settings.instagram_url}
        onChange={(v) => setSettings({ ...settings, instagram_url: v })}
        hint="Leave blank until your account is live"
      />
      <button type="submit" className="btn-primary">Save settings</button>
      {saved && <p className="text-sm text-meadow">Saved.</p>}
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-stone">{label}</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="input" />
      {hint && <span className="mt-1 block text-xs text-stone">{hint}</span>}
    </label>
  );
}
