import { Router } from "express";
import {
  createBlockedDate,
  createBlogPost,
  createBooking,
  deleteBlockedDate,
  deleteBlogPost,
  deleteBooking,
  getAllBlockedDates,
  getAllBlogPosts,
  getAllBookings,
  getPublishedBlogPosts,
  getBlogPostBySlug,
  getSettings,
  getUnavailableDates,
  isRangeUnavailable,
  nightsBetween,
  setSetting,
  slugExists,
  updateBlogPost,
  updateBookingStatus,
} from "./db.js";
import { requireAdmin, signAdminToken, verifyPassword } from "./auth.js";

export const publicRouter = Router();
export const adminRouter = Router();

publicRouter.get("/settings", (_req, res) => {
  res.json(getSettings());
});

publicRouter.get("/availability", (req, res) => {
  const from = String(req.query.from ?? "");
  const to = String(req.query.to ?? "");

  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
    res.status(400).json({ error: "from and to must be YYYY-MM-DD" });
    return;
  }

  if (from >= to) {
    res.status(400).json({ error: "to must be after from" });
    return;
  }

  res.json({ unavailable: getUnavailableDates(from, to) });
});

publicRouter.post("/bookings", (req, res) => {
  const { guest_name, email, phone, check_in, check_out, guests, message } =
    req.body ?? {};

  if (!guest_name || !email || !check_in || !check_out) {
    res.status(400).json({
      error: "guest_name, email, check_in, and check_out are required",
    });
    return;
  }

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(check_in) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(check_out)
  ) {
    res.status(400).json({ error: "Dates must be YYYY-MM-DD" });
    return;
  }

  if (check_in >= check_out) {
    res.status(400).json({ error: "check_out must be after check_in" });
    return;
  }

  const settings = getSettings();
  const maxGuests = parseInt(settings.max_guests ?? "4", 10);
  const minNights = parseInt(settings.min_nights ?? "3", 10);
  const guestCount = parseInt(String(guests ?? 2), 10);

  if (guestCount < 1 || guestCount > maxGuests) {
    res.status(400).json({ error: `Guests must be between 1 and ${maxGuests}` });
    return;
  }

  const nights = nightsBetween(check_in, check_out);
  if (nights < minNights) {
    res.status(400).json({ error: `Minimum stay is ${minNights} nights` });
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  if (check_in < today) {
    res.status(400).json({ error: "check_in cannot be in the past" });
    return;
  }

  if (isRangeUnavailable(check_in, check_out)) {
    res.status(409).json({ error: "Selected dates are not available" });
    return;
  }

  const nightlyRate = parseFloat(settings.nightly_rate ?? "145");
  const total = nightlyRate * nights;

  const booking = createBooking({
    guest_name: String(guest_name).trim(),
    email: String(email).trim().toLowerCase(),
    phone: phone ? String(phone).trim() : null,
    check_in,
    check_out,
    guests: guestCount,
    message: message ? String(message).trim() : null,
  });

  res.status(201).json({
    booking,
    quote: { nights, nightly_rate: nightlyRate, total },
    message:
      "Your booking request has been received. We'll confirm availability and send payment details shortly.",
  });
});

publicRouter.get("/blog", (_req, res) => {
  const posts = getPublishedBlogPosts().map(
    ({ id, slug, title, excerpt, cover_image, published_at }) => ({
      id,
      slug,
      title,
      excerpt,
      cover_image,
      published_at,
    })
  );
  res.json(posts);
});

publicRouter.get("/blog/:slug", (req, res) => {
  const post = getBlogPostBySlug(req.params.slug);
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json(post);
});

adminRouter.post("/login", (req, res) => {
  const { password } = req.body ?? {};
  if (!password || !verifyPassword(String(password))) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }
  res.json({ token: signAdminToken() });
});

adminRouter.use(requireAdmin);

adminRouter.get("/bookings", (_req, res) => {
  res.json(getAllBookings());
});

adminRouter.patch("/bookings/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body ?? {};

  if (!["pending", "confirmed", "cancelled"].includes(status)) {
    res.status(400).json({
      error: "status must be pending, confirmed, or cancelled",
    });
    return;
  }

  const existing = getAllBookings().find((b) => b.id === id);
  if (!existing) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  if (status === "confirmed" || status === "pending") {
    if (isRangeUnavailable(existing.check_in, existing.check_out, id)) {
      res.status(409).json({ error: "Dates conflict with another booking" });
      return;
    }
  }

  const booking = updateBookingStatus(id, status);
  res.json(booking);
});

adminRouter.delete("/bookings/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!deleteBooking(id)) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  res.status(204).send();
});

adminRouter.get("/blocked-dates", (_req, res) => {
  res.json(getAllBlockedDates());
});

adminRouter.post("/blocked-dates", (req, res) => {
  const { start_date, end_date, reason } = req.body ?? {};

  if (!start_date || !end_date) {
    res.status(400).json({ error: "start_date and end_date are required" });
    return;
  }

  if (start_date >= end_date) {
    res.status(400).json({ error: "end_date must be after start_date" });
    return;
  }

  const row = createBlockedDate({
    start_date,
    end_date,
    reason: reason ?? null,
  });
  res.status(201).json(row);
});

adminRouter.delete("/blocked-dates/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!deleteBlockedDate(id)) {
    res.status(404).json({ error: "Blocked date not found" });
    return;
  }
  res.status(204).send();
});

adminRouter.get("/settings", (_req, res) => {
  res.json(getSettings());
});

adminRouter.patch("/settings", (req, res) => {
  const updates = req.body ?? {};
  for (const [key, value] of Object.entries(updates)) {
    if (typeof value === "string" || typeof value === "number") {
      setSetting(key, String(value));
    }
  }
  res.json(getSettings());
});

adminRouter.get("/blog", (_req, res) => {
  res.json(getAllBlogPosts());
});

adminRouter.post("/blog", (req, res) => {
  const { slug, title, excerpt, content, cover_image, published } = req.body ?? {};

  if (!slug || !title || !excerpt || !content) {
    res.status(400).json({
      error: "slug, title, excerpt, and content are required",
    });
    return;
  }

  if (slugExists(slug)) {
    res.status(409).json({ error: "A post with this slug already exists" });
    return;
  }

  const post = createBlogPost({
    slug,
    title,
    excerpt,
    content,
    cover_image: cover_image ?? null,
    published: Boolean(published),
  });
  res.status(201).json(post);
});

adminRouter.patch("/blog/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const existing = getAllBlogPosts().find((p) => p.id === id);

  if (!existing) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  const { slug, title, excerpt, content, cover_image, published } = req.body ?? {};

  if (slug && slugExists(slug, id)) {
    res.status(409).json({ error: "A post with this slug already exists" });
    return;
  }

  const post = updateBlogPost(id, {
    slug,
    title,
    excerpt,
    content,
    cover_image,
    published: published !== undefined ? Boolean(published) : undefined,
  });
  res.json(post);
});

adminRouter.delete("/blog/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!deleteBlogPost(id)) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.status(204).send();
});
