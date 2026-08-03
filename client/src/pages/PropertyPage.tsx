import { Link } from "react-router-dom";
import { PropertyMeta } from "../components/Header";
import { PROPERTY } from "../data/property";

export default function PropertyPage() {
  return (
    <>
      <section className="bg-cream-warm py-16 sm:py-20">
        <div className="container-site">
          <p className="eyebrow">The Property</p>
          <h1 className="heading-display mt-3 text-meadow">{PROPERTY.name}</h1>
          <p className="mt-4 text-lg text-stone-dark">{PROPERTY.location}</p>
          <p className="mt-1 text-sm text-stone">{PROPERTY.distances}</p>
          <div className="mt-6">
            <PropertyMeta />
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-site">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROPERTY.gallery.map((img, i) => (
              <img
                key={img.src}
                src={img.src}
                alt={img.alt}
                className={`rounded-sm object-cover ${
                  i === 0 ? "sm:col-span-2 lg:col-span-2 aspect-[16/9]" : "aspect-[4/3]"
                } w-full`}
              />
            ))}
          </div>
          <p className="mt-4 text-xs text-stone">
            Placeholder photography — replace with your own property images.
          </p>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="container-site grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="heading-section text-meadow">About the coach house</h2>
            <div className="mt-6 space-y-4 leading-relaxed text-stone-dark">
              {PROPERTY.description.split("\n\n").map((para) => (
                <p key={para.slice(0, 40)}>{para}</p>
              ))}
            </div>

            <h3 className="mt-12 font-serif text-2xl text-meadow">Bedrooms &amp; bathrooms</h3>
            <ul className="mt-4 space-y-3 text-sm text-stone-dark">
              {PROPERTY.bedroomDetails.map((room) => (
                <li key={room.name}>
                  <strong className="text-meadow">{room.name}:</strong> {room.detail}
                </li>
              ))}
            </ul>

            <h3 className="mt-12 font-serif text-2xl text-meadow">Good to know</h3>
            <ul className="mt-4 space-y-2 text-sm text-stone-dark">
              {PROPERTY.notes.map((note) => (
                <li key={note} className="flex gap-2">
                  <span className="text-terracotta">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>

          <aside className="space-y-6">
            <div className="rounded-sm border border-meadow/15 bg-white p-6">
              <h3 className="font-serif text-xl text-meadow">Features</h3>
              <ul className="mt-4 space-y-2 text-sm text-stone-dark">
                {PROPERTY.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-meadow">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-sm bg-meadow p-6 text-cream">
              <p className="font-serif text-xl">From £145/night</p>
              <p className="mt-2 text-sm text-cream/70">
                Minimum {PROPERTY.minNights} nights · Sleeps {PROPERTY.sleeps}
              </p>
              <Link to="/book" className="btn-terracotta mt-6 w-full">
                Check Availability
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
