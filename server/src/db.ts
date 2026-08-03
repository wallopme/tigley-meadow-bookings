import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
const dbPath = path.join(dataDir, "store.json");

export type Booking = {
  id: number;
  guest_name: string;
  email: string;
  phone: string | null;
  check_in: string;
  check_out: string;
  guests: number;
  message: string | null;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
};

export type BlockedDate = {
  id: number;
  start_date: string;
  end_date: string;
  reason: string | null;
  created_at: string;
};

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  published: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type Store = {
  bookings: Booking[];
  blocked_dates: BlockedDate[];
  blog_posts: BlogPost[];
  settings: Record<string, string>;
  nextId: { bookings: number; blocked_dates: number; blog_posts: number };
};

let store: Store;

function loadStore(): Store {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  if (fs.existsSync(dbPath)) {
    return JSON.parse(fs.readFileSync(dbPath, "utf-8")) as Store;
  }

  const fresh: Store = {
    bookings: [],
    blocked_dates: [],
    blog_posts: [],
    settings: {
      nightly_rate: "145",
      min_nights: "3",
      max_guests: "4",
      changeover_day: "friday",
      instagram_url: "",
      contact_email: "hello@tigleymeadow.co.uk",
    },
    nextId: { bookings: 1, blocked_dates: 1, blog_posts: 1 },
  };

  saveStore(fresh);
  return fresh;
}

function saveStore(s: Store = store) {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(dbPath, JSON.stringify(s, null, 2));
}

export function initDb() {
  store = loadStore();
  if (store.blog_posts.length === 0) seedBlogPosts();
}

function nextId(key: keyof Store["nextId"]): number {
  const id = store.nextId[key];
  store.nextId[key] = id + 1;
  saveStore();
  return id;
}

function seedBlogPosts() {
  const now = new Date().toISOString();
  store.blog_posts.push(
    {
      id: nextId("blog_posts"),
      slug: "welcome-to-tigley-meadow",
      title: "Welcome to Tigley Meadow Coach House",
      excerpt:
        "Our converted coach house in Dartington is ready for guests — here's what to expect on arrival.",
      content: `## A Devonshire retreat

Tigley Meadow Coach House sits in the peaceful countryside near Dartington, with Totnes, the South Hams coast, and Dartmoor all within easy reach.

We've converted this charming building into a light-filled holiday home with two super-king bedrooms, a fully equipped kitchen, and a patio for alfresco dining.

### On arrival

You'll find off-road parking for two cars directly outside. We're next door if you need anything — but the coach house is entirely yours for the duration of your stay.

### Local favourites

- **The Church House Inn, Rattery** — fabulous food, a short drive away
- **The Cott Inn, Dartington** — one of Britain's oldest thatched inns
- **Totnes Castle** — Norman fortress with stunning views
- **Berry Pomeroy Castle** — hauntingly beautiful ruins

We look forward to welcoming you.`,
      cover_image: null,
      published: 1,
      published_at: now,
      created_at: now,
      updated_at: now,
    },
    {
      id: nextId("blog_posts"),
      slug: "exploring-the-south-hams",
      title: "Exploring the South Hams from Dartington",
      excerpt:
        "Beaches, estuaries, and market towns — our guide to making the most of south Devon.",
      content: `## Coast and countryside

Dartington is perfectly placed between Dartmoor National Park and the Devon coast. Here are some of our favourite day trips.

### Salcombe & the estuary

The South Hams coastline is an Area of Outstanding Natural Beauty. Salcombe's harbour, sandy beaches, and sailing make it a perfect summer day out — about 45 minutes by car.

### Paignton & Torbay

Head east for Paignton Zoo, the pier, and family-friendly beaches. Kents Cavern offers a fascinating journey into prehistoric Britain.

### Totnes market

Every Friday and Saturday, Totnes hosts one of Devon's best markets. Browse local produce, crafts, and antiques before exploring the independent shops along the high street.

### Steam railway

Combine a river trip to Dartmouth with the Kingswear to Paignton steam railway for a classic Devon adventure.`,
      cover_image: null,
      published: 1,
      published_at: now,
      created_at: now,
      updated_at: now,
    }
  );
  saveStore();
}

export function getSettings(): Record<string, string> {
  return { ...store.settings };
}

export function setSetting(key: string, value: string) {
  store.settings[key] = value;
  saveStore();
}

export function getAllBookings(): Booking[] {
  return [...store.bookings].sort((a, b) => b.check_in.localeCompare(a.check_in));
}

export function getBooking(id: number): Booking | undefined {
  return store.bookings.find((b) => b.id === id);
}

export function createBooking(
  data: Omit<Booking, "id" | "status" | "created_at">
): Booking {
  const booking: Booking = {
    ...data,
    id: nextId("bookings"),
    status: "pending",
    created_at: new Date().toISOString(),
  };
  store.bookings.push(booking);
  saveStore();
  return booking;
}

export function updateBookingStatus(
  id: number,
  status: Booking["status"]
): Booking | undefined {
  const booking = store.bookings.find((b) => b.id === id);
  if (!booking) return undefined;
  booking.status = status;
  saveStore();
  return booking;
}

export function deleteBooking(id: number): boolean {
  const idx = store.bookings.findIndex((b) => b.id === id);
  if (idx === -1) return false;
  store.bookings.splice(idx, 1);
  saveStore();
  return true;
}

export function getAllBlockedDates(): BlockedDate[] {
  return [...store.blocked_dates].sort((a, b) =>
    a.start_date.localeCompare(b.start_date)
  );
}

export function createBlockedDate(
  data: Omit<BlockedDate, "id" | "created_at">
): BlockedDate {
  const row: BlockedDate = {
    ...data,
    id: nextId("blocked_dates"),
    created_at: new Date().toISOString(),
  };
  store.blocked_dates.push(row);
  saveStore();
  return row;
}

export function deleteBlockedDate(id: number): boolean {
  const idx = store.blocked_dates.findIndex((b) => b.id === id);
  if (idx === -1) return false;
  store.blocked_dates.splice(idx, 1);
  saveStore();
  return true;
}

export function getPublishedBlogPosts(): BlogPost[] {
  return store.blog_posts
    .filter((p) => p.published === 1)
    .sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""));
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return store.blog_posts.find((p) => p.slug === slug && p.published === 1);
}

export function getAllBlogPosts(): BlogPost[] {
  return [...store.blog_posts].sort((a, b) =>
    b.created_at.localeCompare(a.created_at)
  );
}

export function createBlogPost(data: {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  published: boolean;
}): BlogPost {
  const now = new Date().toISOString();
  const post: BlogPost = {
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    cover_image: data.cover_image,
    id: nextId("blog_posts"),
    published: data.published ? 1 : 0,
    published_at: data.published ? now : null,
    created_at: now,
    updated_at: now,
  };
  store.blog_posts.push(post);
  saveStore();
  return post;
}

export function updateBlogPost(
  id: number,
  updates: Partial<
    Pick<BlogPost, "slug" | "title" | "excerpt" | "content" | "cover_image"> & {
      published?: boolean;
    }
  >
): BlogPost | undefined {
  const post = store.blog_posts.find((p) => p.id === id);
  if (!post) return undefined;

  if (updates.slug !== undefined) post.slug = updates.slug;
  if (updates.title !== undefined) post.title = updates.title;
  if (updates.excerpt !== undefined) post.excerpt = updates.excerpt;
  if (updates.content !== undefined) post.content = updates.content;
  if (updates.cover_image !== undefined) post.cover_image = updates.cover_image;
  if (updates.published !== undefined) {
    post.published = updates.published ? 1 : 0;
    if (updates.published && !post.published_at) {
      post.published_at = new Date().toISOString();
    }
    if (!updates.published) post.published_at = null;
  }
  post.updated_at = new Date().toISOString();
  saveStore();
  return post;
}

export function deleteBlogPost(id: number): boolean {
  const idx = store.blog_posts.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  store.blog_posts.splice(idx, 1);
  saveStore();
  return true;
}

function datesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
): boolean {
  return aStart < bEnd && aEnd > bStart;
}

function eachNight(start: string, end: string): string[] {
  const nights: string[] = [];
  const cur = new Date(start + "T12:00:00");
  const last = new Date(end + "T12:00:00");
  while (cur < last) {
    nights.push(cur.toISOString().slice(0, 10));
    cur.setDate(cur.getDate() + 1);
  }
  return nights;
}

export function isRangeUnavailable(
  checkIn: string,
  checkOut: string,
  excludeBookingId?: number
): boolean {
  const bookings = store.bookings.filter(
    (b) =>
      (b.status === "pending" || b.status === "confirmed") &&
      b.id !== excludeBookingId
  );

  const ranges = [
    ...bookings.map((b) => ({ start: b.check_in, end: b.check_out })),
    ...store.blocked_dates.map((b) => ({
      start: b.start_date,
      end: b.end_date,
    })),
  ];

  return ranges.some((r) => datesOverlap(checkIn, checkOut, r.start, r.end));
}

export function getUnavailableDates(from: string, to: string): string[] {
  const unavailable = new Set<string>();

  const bookings = store.bookings.filter(
    (b) => b.status === "pending" || b.status === "confirmed"
  );

  for (const range of [
    ...bookings.map((b) => ({ start: b.check_in, end: b.check_out })),
    ...store.blocked_dates.map((b) => ({
      start: b.start_date,
      end: b.end_date,
    })),
  ]) {
    for (const d of eachNight(range.start, range.end)) {
      if (d >= from && d < to) unavailable.add(d);
    }
  }

  return [...unavailable].sort();
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn + "T12:00:00");
  const end = new Date(checkOut + "T12:00:00");
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function slugExists(slug: string, excludeId?: number): boolean {
  return store.blog_posts.some((p) => p.slug === slug && p.id !== excludeId);
}
