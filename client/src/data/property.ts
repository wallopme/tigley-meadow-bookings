import heroImage from "../assets/hero.png";

export const PROPERTY = {
  name: "Tigley Meadow Coach House",
  tagline: "Peace, beauty and rural Devon living",
  location: "Brooking, near Dartington, Devon",
  distances: "Dartington 2.5 miles · Totnes 3 miles",
  sleeps: 4,
  bedrooms: 2,
  bathrooms: 2,
  pets: false,
  parking: 2,
  minNights: 3,
  housekeepingBond: 250,

  owners: [
    { name: "Justin", phone: "07967601794" },
    { name: "Katy", phone: "07970096672" },
  ],

  heroImage,
  /** Adjust homepage hero photo — see README or comments below */
  hero: {
    /** Where to focus the crop: "center", "top", "bottom", or "50% 30%" etc. */
    objectPosition: "center",
    /** 1 = normal, 1.15 = brighter, 0.85 = darker */
    brightness: 1.2,
    /** Dark overlay on the image so text stays readable (0 = none, 1 = very dark) */
    overlayOpacity: 0.3,
  },
  gallery: [
    {
      src: heroImage,
      alt: "Tigley Meadow Coach House exterior — stone walls, solar panels and patio",
    },
    {
      src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      alt: "Light-filled living space",
    },
    {
      src: "https://images.unsplash.com/photo-1616594039960-4081a9141f82?w=800&q=80",
      alt: "Super-king bedroom",
    },
    {
      src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
      alt: "Fully equipped kitchen",
    },
    {
      src: "https://images.unsplash.com/photo-1600047509809-ba699f880262?w=800&q=80",
      alt: "Patio and garden",
    },
    {
      src: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80",
      alt: "En-suite bathroom",
    },
    {
      src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
      alt: "Devon countryside",
    },
  ],

  description: `Escape to the peace and beauty of the South Devon countryside at Tigley Meadow Coach House, a beautifully appointed two-bedroom retreat tucked away amongst rolling fields, wildlife and open skies. Set within the grounds of a peaceful rural smallholding (rather than a working farm), this is a place to slow down, switch off and enjoy the simple pleasures of Devon life.

Wake to birdsong, watch the chickens pottering around the vegetable gardens, enjoy your morning coffee overlooking the surrounding countryside, and spend evenings beneath dark, star-filled skies. It offers all the tranquillity of rural living while remaining just a short drive from the vibrant market town of Totnes, the Dartington Estate and some of South Devon's finest beaches.

One feature that adds a little character to Tigley Meadow Coach House is the historic railway line that runs alongside the property. Trains pass infrequently and the sound is generally brief and unobtrusive. At certain times of the year, heritage steam trains also travel this route, offering a nostalgic glimpse of Britain's railway past. For many guests, this unique setting becomes part of the charm of staying at the Coach House.

Inside, the spacious open-plan living area provides a light and welcoming space to relax after a day exploring. Sink into the comfortable sofa and enjoy a film on the Smart TV, while the well-equipped kitchen has everything needed for preparing leisurely breakfasts or family dinners, including an electric double oven, electric hob, microwave oven and a Sage espresso machine — perfect for enjoying a freshly brewed coffee before setting off to explore Devon. Gather together around the dining table to enjoy meals and plan the next day's adventures.

The Coach House comfortably sleeps up to four guests across two generous bedrooms, both featuring luxurious super-king-size beds with Egyptian cotton bedding, and large Velux windows that flood the rooms with natural light, fitted with blackout blinds.

The principal bedroom benefits from an en-suite with a bath, shower, basin and WC, as well as a desk for anyone needing to catch up on a little work during their stay. The second bedroom also enjoys its own private en-suite bathroom with a walk-in shower, basin and WC.

Outside, the patio is the perfect place to embrace country living. Fire up the barbecue, enjoy lunch in the fresh Devon air or simply sit back with a glass of wine as the sun sets across the surrounding fields.

Despite its wonderfully secluded setting, you're never far from some of Devon's best attractions. Wander the independent shops, cafés and markets of nearby Totnes, explore the beautiful Dartington Hall Estate and Gardens, or discover the South Hams' spectacular coastline, with beaches including Blackpool Sands, Bantham, Bigbury-on-Sea and South Milton Sands all within easy reach.

History lovers can explore Totnes Castle, Berry Pomeroy Castle and Torre Abbey, while families will enjoy Paignton Zoo, Young's Park, Dinosaur World and the fascinating Kents Cavern caves in Torquay. For a traditional Devon pub, The Cott Inn — one of England's oldest thatched inns — is just a short drive away.

Whether you're looking for peaceful countryside walks, days on the beach, cosy pub lunches or simply somewhere to escape the pace of everyday life, Tigley Meadow Coach House offers the perfect base for an unforgettable South Devon holiday.`,

  bedroomDetails: [
    {
      name: "Principal bedroom",
      detail:
        "Luxurious super-king-size bed with Egyptian cotton bedding, Velux windows with blackout blinds, en-suite with bath, shower, basin and WC, plus a desk for anyone needing to catch up on work.",
    },
    {
      name: "Second bedroom",
      detail:
        "Super-king-size bed with Egyptian cotton bedding, Velux windows with blackout blinds, and a private en-suite with walk-in shower, basin and WC.",
    },
  ],

  features: [
    "Two super-king bedrooms with en-suites",
    "Egyptian cotton bedding & blackout blinds",
    "Open-plan kitchen, dining & sitting area",
    "Smart TV, WiFi, books and games",
    "Electric double oven, hob & microwave",
    "Sage espresso machine",
    "Off-road parking for 2 cars",
    "Patio with seating and barbecue",
    "Highchair available on request",
    "Fuel and power included",
    "Bed linen and towels included",
    "Solar panels & gas central heating",
  ],

  notes: [
    "Set within a peaceful rural smallholding — owners live in the adjacent property",
    "Historic railway line alongside the property; trains pass infrequently",
    "Heritage steam trains travel the route at certain times of year",
    "Sorry, no pets and no smoking",
    "Good housekeeping bond of £250",
    "Shop 2.3 miles, pub 1.8 miles",
  ],

  reviews: [
    {
      quote:
        "Beautifully furnished and equipped property. Lovely light-filled, huge bedrooms with super king size beds and gorgeous bed linen.",
      author: "Hall",
      rating: 5,
      date: "Oct 2025",
    },
    {
      quote:
        "Gorgeous converted coachhouse in a great central location. The chickens were so friendly! House was gorgeous and we had a lovely relaxing stay.",
      author: "Philippa",
      rating: 4,
      date: "Sep 2025",
    },
    {
      quote:
        "Lovely property, nice and clean, in a perfect location for visiting the popular attractions, towns and beaches.",
      author: "Charlotte",
      rating: 5,
      date: "Aug 2025",
    },
  ],

  locationHighlights: [
    {
      title: "Totnes",
      distance: "3 miles",
      description:
        "Vibrant market town with independent shops, cafés, markets, and Totnes Castle.",
    },
    {
      title: "Dartington Hall",
      distance: "2.5 miles",
      description:
        "Beautiful estate and gardens, craft centre, and home to the ancient Cott Inn.",
    },
    {
      title: "South Hams beaches",
      distance: "Easy drive",
      description:
        "Blackpool Sands, Bantham, Bigbury-on-Sea and South Milton Sands on the spectacular coastline.",
    },
    {
      title: "The Cott Inn, Dartington",
      distance: "Short drive",
      description:
        "One of England's oldest thatched inns — a traditional Devon pub lunch.",
    },
    {
      title: "Paignton & Torbay",
      distance: "~25 min",
      description:
        "Paignton Zoo, Young's Park, Dinosaur World and Kents Cavern prehistoric caves.",
    },
    {
      title: "Castles & history",
      distance: "Nearby",
      description:
        "Totnes Castle, Berry Pomeroy Castle and Torre Abbey museum of art and history.",
    },
  ],
};

export const INSTAGRAM_HANDLE = "tigleymeadow";
export const INSTAGRAM_URL = ""; // Set when account is live

/** Format UK mobile for tel: links */
export function phoneTel(number: string): string {
  const digits = number.replace(/\D/g, "");
  if (digits.startsWith("0")) return `+44${digits.slice(1)}`;
  return digits.startsWith("+") ? digits : `+${digits}`;
}

export function phoneDisplay(number: string): string {
  const digits = number.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("0")) {
    return `${digits.slice(0, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return number;
}
