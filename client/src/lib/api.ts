const API_BASE = "/api";

export type SiteSettings = {
  nightly_rate: string;
  min_nights: string;
  max_guests: string;
  changeover_day: string;
  instagram_url: string;
  contact_email: string;
};

export type BookingRequest = {
  guest_name: string;
  email: string;
  phone?: string;
  check_in: string;
  check_out: string;
  guests: number;
  message?: string;
};

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

export type BlogPostSummary = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string | null;
  published_at: string | null;
};

export type BlogPost = BlogPostSummary & {
  content: string;
  published: number;
  created_at: string;
  updated_at: string;
};

export type BlockedDate = {
  id: number;
  start_date: string;
  end_date: string;
  reason: string | null;
  created_at: string;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export function getSettings() {
  return request<SiteSettings>("/settings");
}

export function getAvailability(from: string, to: string) {
  return request<{ unavailable: string[] }>(
    `/availability?from=${from}&to=${to}`
  );
}

export function createBooking(data: BookingRequest) {
  return request<{
    booking: Booking;
    quote: { nights: number; nightly_rate: number; total: number };
    message: string;
  }>("/bookings", { method: "POST", body: JSON.stringify(data) });
}

export function getBlogPosts() {
  return request<BlogPostSummary[]>("/blog");
}

export function getBlogPost(slug: string) {
  return request<BlogPost>(`/blog/${slug}`);
}

/* Admin */

export function adminLogin(password: string) {
  return request<{ token: string }>("/admin/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

function adminHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export function adminGetBookings(token: string) {
  return request<Booking[]>("/admin/bookings", {
    headers: adminHeaders(token),
  });
}

export function adminUpdateBooking(
  token: string,
  id: number,
  status: Booking["status"]
) {
  return request<Booking>(`/admin/bookings/${id}`, {
    method: "PATCH",
    headers: adminHeaders(token),
    body: JSON.stringify({ status }),
  });
}

export function adminDeleteBooking(token: string, id: number) {
  return request<void>(`/admin/bookings/${id}`, {
    method: "DELETE",
    headers: adminHeaders(token),
  });
}

export function adminGetBlockedDates(token: string) {
  return request<BlockedDate[]>("/admin/blocked-dates", {
    headers: adminHeaders(token),
  });
}

export function adminCreateBlockedDate(
  token: string,
  data: { start_date: string; end_date: string; reason?: string }
) {
  return request<BlockedDate>("/admin/blocked-dates", {
    method: "POST",
    headers: adminHeaders(token),
    body: JSON.stringify(data),
  });
}

export function adminDeleteBlockedDate(token: string, id: number) {
  return request<void>(`/admin/blocked-dates/${id}`, {
    method: "DELETE",
    headers: adminHeaders(token),
  });
}

export function adminGetSettings(token: string) {
  return request<SiteSettings>("/admin/settings", {
    headers: adminHeaders(token),
  });
}

export function adminUpdateSettings(
  token: string,
  settings: Partial<SiteSettings>
) {
  return request<SiteSettings>("/admin/settings", {
    method: "PATCH",
    headers: adminHeaders(token),
    body: JSON.stringify(settings),
  });
}

export function adminGetBlogPosts(token: string) {
  return request<BlogPost[]>("/admin/blog", { headers: adminHeaders(token) });
}

export function adminCreateBlogPost(
  token: string,
  data: {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    cover_image?: string;
    published?: boolean;
  }
) {
  return request<BlogPost>("/admin/blog", {
    method: "POST",
    headers: adminHeaders(token),
    body: JSON.stringify(data),
  });
}

export function adminUpdateBlogPost(
  token: string,
  id: number,
  data: Partial<{
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    cover_image: string;
    published: boolean;
  }>
) {
  return request<BlogPost>(`/admin/blog/${id}`, {
    method: "PATCH",
    headers: adminHeaders(token),
    body: JSON.stringify(data),
  });
}

export function adminDeleteBlogPost(token: string, id: number) {
  return request<void>(`/admin/blog/${id}`, {
    method: "DELETE",
    headers: adminHeaders(token),
  });
}

export const ADMIN_TOKEN_KEY = "tigley_admin_token";

export function getStoredAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function storeAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}
