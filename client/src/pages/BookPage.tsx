import BookingForm from "../components/BookingForm";
import { PROPERTY, phoneDisplay, phoneTel } from "../data/property";

export default function BookPage() {
  return (
    <>
      <section className="bg-cream-warm py-16 sm:py-20">
        <div className="container-site max-w-2xl">
          <p className="eyebrow">Book a Stay</p>
          <h1 className="heading-display mt-3 text-meadow">Check availability</h1>
          <p className="mt-4 text-stone-dark">
            Select your dates and send a booking request for {PROPERTY.name}.
            We'll confirm availability and send payment details by email.
          </p>
          <p className="mt-3 text-sm text-stone">
            Questions? Call{" "}
            {PROPERTY.owners.map((owner, i) => (
              <span key={owner.name}>
                {i > 0 && " or "}
                {owner.name} on{" "}
                <a
                  href={`tel:${phoneTel(owner.phone)}`}
                  className="text-meadow hover:text-terracotta"
                >
                  {phoneDisplay(owner.phone)}
                </a>
              </span>
            ))}
            .
          </p>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="container-site max-w-xl">
          <BookingForm />
        </div>
      </section>
    </>
  );
}
