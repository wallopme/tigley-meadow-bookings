import { Link } from "react-router-dom";
import { PROPERTY } from "../data/property";

function mapEmbedUrl(lat: number, lon: number): string {
  const pad = 0.016;
  const bbox = [lon - pad, lat - pad * 0.75, lon + pad, lat + pad * 0.75].join(
    ","
  );
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat}%2C${lon}`;
}

export default function LocationPage() {
  return (
    <>
      <section className="relative h-[50vh] min-h-[360px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&q=80"
          alt="Devon countryside"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-meadow-dark/50" />
        <div className="absolute inset-0 flex items-end">
          <div className="container-site pb-12">
            <p className="eyebrow text-cream/70">Location</p>
            <h1 className="heading-display mt-3 text-cream">Dartington &amp; the South Hams</h1>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-site max-w-prose">
          <p className="text-lg leading-relaxed text-stone-dark">
            Tigley Meadow Coach House sits in Brooking, near the village of
            Dartington — 2.5 miles from Dartington Hall and 3 miles from Totnes
            on the River Dart. You're tucked away amongst rolling fields and open
            skies, yet midway between Dartmoor National Park and the Devon coast,
            in the heart of the South Hams Area of Outstanding Natural Beauty.
          </p>
        </div>
      </section>

      <section className="bg-cream-warm py-20 sm:py-28">
        <div className="container-site">
          <h2 className="heading-section text-meadow">Places to explore</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PROPERTY.locationHighlights.map((loc) => (
              <article
                key={loc.title}
                className="rounded-sm border border-meadow/10 bg-white p-6"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-terracotta">
                  {loc.distance}
                </p>
                <h3 className="mt-2 font-serif text-xl text-meadow">{loc.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-dark">
                  {loc.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="heading-section text-meadow">Getting here</h2>
            <p className="mt-6 leading-relaxed text-stone-dark">
              Tigley Meadow Coach House is at postcode{" "}
              <strong className="text-meadow">{PROPERTY.postcode}</strong> (Brooking,
              near Dartington). Off-road parking for two cars is available directly
              outside the property — full directions are sent with your booking
              confirmation.
            </p>
            <p className="mt-4 leading-relaxed text-stone-dark">
              The nearest shop is 2.3 miles away and the nearest pub 1.8 miles.
              Totnes (3 miles) has supermarkets, independent shops, cafés, and a
              regular market.
            </p>
          </div>
          <div>
            <div className="aspect-[4/3] overflow-hidden rounded-sm bg-meadow/10">
              <iframe
                title={`Map of Tigley Meadow Coach House, ${PROPERTY.postcode}`}
                src={mapEmbedUrl(PROPERTY.map.lat, PROPERTY.map.lon)}
                className="h-full w-full border-0"
                loading="lazy"
              />
            </div>
            <p className="mt-3 text-center text-xs text-stone">
              Postcode for sat nav: {PROPERTY.postcode}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-meadow py-16 text-center">
        <div className="container-site">
          <Link to="/book" className="btn-terracotta">
            Book Your Stay
          </Link>
        </div>
      </section>
    </>
  );
}
