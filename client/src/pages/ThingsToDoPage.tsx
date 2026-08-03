import { Link } from "react-router-dom";
import { PROPERTY, phoneDisplay, phoneTel } from "../data/property";
import {
  BEACHES,
  GUEST_INFO,
  PLACES_TO_EAT,
  PLACES_TO_VISIT,
  SHOPPING,
  TOTNES_PARKING,
} from "../data/thingsToDo";

export default function ThingsToDoPage() {
  return (
    <>
      <section className="bg-cream-warm py-16 sm:py-20">
        <div className="container-site">
          <p className="eyebrow">Local guide</p>
          <h1 className="heading-display mt-3 text-meadow">Things to do</h1>
          <p className="mt-4 max-w-2xl text-lg text-stone-dark">
            Our favourite places to eat, beaches, shops and days out — plus
            practical info for your stay.
          </p>
        </div>
      </section>

      <section className="border-b border-meadow/10 py-12 sm:py-16">
        <div className="container-site">
          <GuestInfoCard />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-site">
          <SectionHeading title="Places to eat" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PLACES_TO_EAT.map((place) => (
              <article
                key={place.name}
                className="rounded-sm border border-meadow/10 bg-white p-6"
              >
                <h3 className="font-serif text-xl text-meadow">{place.name}</h3>
                <p className="mt-1 text-sm text-terracotta">{place.location}</p>
                {place.note && (
                  <p className="mt-3 text-sm text-stone-dark">{place.note}</p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-meadow py-16 text-cream sm:py-20">
        <div className="container-site">
          <SectionHeading title="Beaches" light />
          <p className="mt-3 text-cream/75">{BEACHES.intro}</p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {BEACHES.places.map((beach) => (
              <li
                key={beach}
                className="rounded-sm border border-cream/20 bg-cream/10 px-5 py-3 font-serif text-lg"
              >
                {beach}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-site">
          <SectionHeading title="Places to visit" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {PLACES_TO_VISIT.map((place) => (
              <article
                key={place.name}
                className="rounded-sm border border-meadow/10 bg-white p-6"
              >
                <h3 className="font-serif text-xl text-meadow">{place.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-dark">
                  {place.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-warm py-16 sm:py-20">
        <div className="container-site grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading title="Parking in Totnes" />
            <ul className="mt-8 space-y-4">
              {TOTNES_PARKING.map((item) => (
                <li
                  key={item.name}
                  className="rounded-sm border border-meadow/10 bg-white px-5 py-4"
                >
                  <p className="font-medium text-meadow">{item.name}</p>
                  <p className="mt-1 text-sm text-stone-dark">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeading title="Shopping in Totnes" />
            <ul className="mt-8 space-y-3">
              {SHOPPING.map((shop) => (
                <li
                  key={shop.name}
                  className="flex gap-3 border-b border-meadow/10 pb-3 last:border-0"
                >
                  <span className="mt-1 text-terracotta">✦</span>
                  <div>
                    <p className="font-medium text-meadow">{shop.name}</p>
                    <p className="text-sm text-stone-dark">{shop.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 text-center sm:py-20">
        <div className="container-site">
          <p className="font-serif text-2xl text-meadow">Ready to explore?</p>
          <Link to="/book" className="btn-terracotta mt-6">
            Book Your Stay
          </Link>
        </div>
      </section>
    </>
  );
}

function SectionHeading({
  title,
  light = false,
}: {
  title: string;
  light?: boolean;
}) {
  return (
    <h2
      className={`heading-section ${light ? "text-cream" : "text-meadow"}`}
    >
      {title}
    </h2>
  );
}

function GuestInfoCard() {
  return (
    <div className="rounded-sm border border-meadow/15 bg-white p-6 sm:p-8">
      <h2 className="font-serif text-2xl text-meadow">During your stay</h2>
      <p className="mt-2 text-sm text-stone">
        Practical information for guests at Tigley Meadow Coach House
      </p>

      <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-stone">
            Your hosts
          </dt>
          <dd className="mt-2 space-y-2 text-sm text-stone-dark">
            {PROPERTY.owners.map((owner) => (
              <p key={owner.name}>
                {owner.name}:{" "}
                <a
                  href={`tel:${phoneTel(owner.phone)}`}
                  className="font-medium text-meadow hover:text-terracotta"
                >
                  {phoneDisplay(owner.phone)}
                </a>
              </p>
            ))}
            <p className="text-xs text-stone">
              We're next door if you need anything during your stay.
            </p>
          </dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-stone">
            Wi-Fi
          </dt>
          <dd className="mt-2 space-y-1 text-sm text-stone-dark">
            <p>
              Network:{" "}
              <span className="font-medium text-meadow">
                {GUEST_INFO.wifi.network}
              </span>
            </p>
            <p>
              Password:{" "}
              <span className="font-mono font-medium text-meadow">
                {GUEST_INFO.wifi.password}
              </span>
            </p>
          </dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-stone">
            Bins
          </dt>
          <dd className="mt-2 text-sm leading-relaxed text-stone-dark">
            {GUEST_INFO.bins}
          </dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-stone">
            Food
          </dt>
          <dd className="mt-2 text-sm leading-relaxed text-stone-dark">
            {GUEST_INFO.foodPolicy}
          </dd>
        </div>
      </dl>
    </div>
  );
}
