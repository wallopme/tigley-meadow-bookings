import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { PROPERTY } from "../data/property";

const nav = [
  { to: "/property", label: "The Property" },
  { to: "/location", label: "Location" },
  { to: "/things-to-do", label: "Things to Do" },
  { to: "/blog", label: "Journal" },
  { to: "/book", label: "Book" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-meadow/10 bg-cream/95 backdrop-blur-sm">
      <div className="container-site flex h-16 items-center justify-between sm:h-20">
        <Link to="/" className="group">
          <span className="block font-serif text-xl font-medium tracking-tight text-meadow sm:text-2xl">
            Tigley Meadow
          </span>
          <span className="block text-[10px] uppercase tracking-[0.25em] text-stone group-hover:text-meadow">
            Coach House
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm tracking-wide transition ${
                  isActive
                    ? "text-meadow font-medium"
                    : "text-stone-dark hover:text-meadow"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link to="/book" className="btn-terracotta !py-2.5 !px-5 text-xs">
            Check Availability
          </Link>
        </nav>

        <button
          type="button"
          className="md:hidden p-2 text-meadow"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-meadow/10 bg-cream px-5 py-4 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="block py-3 text-sm tracking-wide text-stone-dark"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/book"
            className="btn-terracotta mt-2 w-full"
            onClick={() => setOpen(false)}
          >
            Check Availability
          </Link>
        </nav>
      )}
    </header>
  );
}

export function PropertyMeta() {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-dark">
      <span>{PROPERTY.sleeps} guests</span>
      <span>{PROPERTY.bedrooms} bedrooms</span>
      <span>{PROPERTY.bathrooms} bathrooms</span>
      <span>No pets</span>
    </div>
  );
}
