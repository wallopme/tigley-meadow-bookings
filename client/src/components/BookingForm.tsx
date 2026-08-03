import { useEffect, useState } from "react";
import { getAvailability, getSettings, createBooking } from "../lib/api";
import {
  addDays,
  eachNight,
  formatCurrency,
  nightsBetween,
  todayIso,
} from "../lib/dates";

type Props = {
  onSuccess?: () => void;
};

export default function BookingForm({ onSuccess }: Props) {
  const [settings, setSettings] = useState({
    nightly_rate: "145",
    min_nights: "3",
    max_guests: "4",
  });
  const [unavailable, setUnavailable] = useState<Set<string>>(new Set());
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(2);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getSettings().then(setSettings).catch(() => {});
  }, []);

  useEffect(() => {
    const today = todayIso();
    const to = addDays(today, 365);
    getAvailability(today, to)
      .then((res) => setUnavailable(new Set(res.unavailable)))
      .catch(() => {});
  }, []);

  const minNights = parseInt(settings.min_nights, 10);
  const maxGuests = parseInt(settings.max_guests, 10);
  const nightlyRate = parseFloat(settings.nightly_rate);
  const nights =
    checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const total = nights > 0 ? nights * nightlyRate : 0;

  const rangeConflict =
    checkIn &&
    checkOut &&
    eachNight(checkIn, checkOut).some((d) => unavailable.has(d));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const result = await createBooking({
        guest_name: guestName,
        email,
        phone: phone || undefined,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        message: message || undefined,
      });
      setSuccess(result.message);
      setGuestName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setCheckIn("");
      setCheckOut("");
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AvailabilityCalendar
        unavailable={unavailable}
        checkIn={checkIn}
        checkOut={checkOut}
        onSelect={(inDate, outDate) => {
          setCheckIn(inDate);
          setCheckOut(outDate);
        }}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Check in">
          <input
            type="date"
            required
            min={todayIso()}
            value={checkIn}
            onChange={(e) => {
              setCheckIn(e.target.value);
              if (checkOut && e.target.value >= checkOut) setCheckOut("");
            }}
            className="input"
          />
        </Field>
        <Field label="Check out">
          <input
            type="date"
            required
            min={checkIn ? addDays(checkIn, minNights) : todayIso()}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="input"
          />
        </Field>
      </div>

      {nights > 0 && (
        <div className="rounded-sm bg-cream-warm p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-stone-dark">
              {nights} night{nights !== 1 ? "s" : ""} × {formatCurrency(nightlyRate)}
            </span>
            <span className="font-medium text-meadow">{formatCurrency(total)}</span>
          </div>
          <p className="mt-2 text-xs text-stone">
            Minimum stay {minNights} nights. Good housekeeping bond of £250 applies.
          </p>
        </div>
      )}

      {rangeConflict && (
        <p className="text-sm text-terracotta-dark">
          Selected dates include unavailable nights. Please choose different dates.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name">
          <input
            type="text"
            required
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone (optional)">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Guests">
          <select
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value, 10))}
            className="input"
          >
            {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} guest{n !== 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Message (optional)">
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Any special requests or questions?"
          className="input resize-none"
        />
      </Field>

      {error && <p className="text-sm text-terracotta-dark">{error}</p>}
      {success && (
        <div className="rounded-sm border border-meadow/20 bg-meadow/5 p-4 text-sm text-meadow">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !!rangeConflict || nights < minNights}
        className="btn-primary w-full disabled:opacity-50"
      >
        {submitting ? "Sending request…" : "Request to Book"}
      </button>

      <p className="text-xs text-stone leading-relaxed">
        This sends a booking request — we'll confirm availability and send payment
        details by email. No payment is taken on this site.
      </p>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone">
        {label}
      </span>
      {children}
    </label>
  );
}

type CalendarProps = {
  unavailable: Set<string>;
  checkIn: string;
  checkOut: string;
  onSelect: (checkIn: string, checkOut: string) => void;
};

function AvailabilityCalendar({
  unavailable,
  checkIn,
  checkOut,
  onSelect,
}: CalendarProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selecting, setSelecting] = useState<"in" | "out">("in");

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else setViewMonth(viewMonth - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else setViewMonth(viewMonth + 1);
  }

  function handleDayClick(iso: string) {
    if (unavailable.has(iso) || iso < todayIso()) return;

    if (selecting === "in" || !checkIn || iso <= checkIn) {
      onSelect(iso, "");
      setSelecting("out");
    } else {
      const nights = eachNight(checkIn, iso);
      if (nights.some((d) => unavailable.has(d))) return;
      onSelect(checkIn, iso);
      setSelecting("in");
    }
  }

  function dayClass(iso: string): string {
    const base =
      "flex h-9 w-9 items-center justify-center rounded-full text-sm transition";
    if (iso < todayIso() || unavailable.has(iso)) {
      return `${base} text-stone/40 line-through cursor-not-allowed`;
    }
    if (iso === checkIn || iso === checkOut) {
      return `${base} bg-meadow text-cream font-medium`;
    }
    if (checkIn && checkOut && iso > checkIn && iso < checkOut) {
      return `${base} bg-meadow/15 text-meadow`;
    }
    return `${base} hover:bg-meadow/10 cursor-pointer`;
  }

  const cells: (string | null)[] = [];
  for (let i = 0; i < (firstDay + 6) % 7; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push(iso);
  }

  return (
    <div className="rounded-sm border border-meadow/15 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={prevMonth} className="p-1 text-stone hover:text-meadow">
          ←
        </button>
        <span className="font-serif text-lg text-meadow">{monthLabel}</span>
        <button type="button" onClick={nextMonth} className="p-1 text-stone hover:text-meadow">
          →
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 text-center text-[10px] uppercase tracking-wider text-stone">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 place-items-center gap-y-1">
        {cells.map((iso, i) =>
          iso ? (
            <button
              key={iso}
              type="button"
              onClick={() => handleDayClick(iso)}
              className={dayClass(iso)}
            >
              {parseInt(iso.slice(8), 10)}
            </button>
          ) : (
            <span key={`empty-${i}`} />
          )
        )}
      </div>

      <div className="mt-4 flex gap-4 text-xs text-stone">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-meadow" /> Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-stone/30 line-through" /> Unavailable
        </span>
      </div>
    </div>
  );
}
