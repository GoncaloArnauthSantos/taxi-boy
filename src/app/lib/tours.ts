// ⚠️ TEMPORARY: This file contains static tour data
// TODO: Update BookingForm.tsx to use tours from CMS (getAllTours from @/cms/tours)
// This file can be removed once BookingForm is migrated to CMS

export const LOCATIONS = [
  "Lisbon",
  "Alfama",
  "Belém",
  "Baixa",
  "Sintra",
  "Cascais",
  "Óbidos",
  "Nazaré",
  "Setúbal",
  "Arrábida",
  "Bairro Alto",
  "Cabo da Roca",
] as const

export type Location = (typeof LOCATIONS)[number]

export type Tour = {
  id: string
  creationDate: string
  updateDate: string
  title: string
  description: string
  images: string[]
  bannerImage: string
  duration: number
  price: number
  locations: Location[]
  longDescription: string
  included: string[]
  languages: string[]
}

export const tours: Tour[] = [
  {
    id: "historic-lisbon",
    creationDate: "2024-01-15",
    updateDate: "2024-03-20",
    title: "Historic Lisbon Experience",
    description:
      "Discover the heart of Lisbon with visits to Alfama, Baixa, and Belém. Perfect for first-time visitors.",
    duration: 4,
    price: 120,
    bannerImage: "/lisbon-historic-tram-and-colorful-buildings.jpg",
    images: [
      "/lisbon-tram-on-historic-street.jpg",
      "/bel-m-tower-lisbon.jpg",
      "/alfama-district-lisbon.jpg",
      "/jer-nimos-monastery-lisbon.jpg",
    ],
    locations: ["Lisbon", "Alfama", "Baixa", "Belém"],
    longDescription:
      "Immerse yourself in the rich history and vibrant culture of Lisbon. This comprehensive tour takes you through the most iconic neighborhoods, from the medieval streets of Alfama to the grand monuments of Belém. Experience authentic Portuguese culture, taste traditional pastéis de nata, and capture stunning photos of the city.",
    included: [
      "Pick-up and drop-off at your hotel",
      "Visit to São Jorge Castle",
      "Alfama neighborhood exploration",
      "Belém Tower and Jerónimos Monastery",
      "Pastéis de Belém tasting",
      "Photo stops at best viewpoints",
    ],
    languages: ["English", "Portuguese", "Spanish", "French"],
  },
  {
    id: "sintra-cascais",
    creationDate: "2024-01-20",
    updateDate: "2024-03-18",
    title: "Sintra & Cascais Full Day",
    description: "Explore the magical town of Sintra and the coastal beauty of Cascais on this full-day adventure.",
    duration: 8,
    price: 200,
    bannerImage: "/pena-palace-sintra-colorful-castle.jpg",
    images: [
      "/pena-palace-exterior-sintra.jpg",
      "/quinta-da-regaleira-gardens.jpg",
      "/cabo-da-roca-cliffs.jpg",
      "/cascais-beach-promenade.jpg",
    ],
    locations: ["Sintra", "Cascais", "Cabo da Roca"],
    longDescription:
      "Escape the city and discover two of Portugal's most beautiful destinations. Marvel at the romantic palaces of Sintra, a UNESCO World Heritage site, and enjoy the sophisticated coastal charm of Cascais. This tour combines history, nature, and breathtaking landscapes.",
    included: [
      "Full-day private tour",
      "Pena Palace entrance",
      "Quinta da Regaleira visit",
      "Cabo da Roca (Europe's westernmost point)",
      "Cascais seaside town",
      "Lunch recommendations",
      "Comfortable air-conditioned vehicle",
    ],
    languages: ["English", "Portuguese", "Spanish", "German"],
  },
  {
    id: "lisbon-night-tour",
    creationDate: "2024-02-01",
    updateDate: "2024-03-15",
    title: "Lisbon by Night",
    description: "Experience the magic of Lisbon after dark with illuminated monuments and vibrant nightlife.",
    duration: 3,
    price: 90,
    bannerImage: "/lisbon-illuminated-at-night-cityscape.jpg",
    images: [
      "/lisbon-commerce-square-night.jpg",
      "/25-de-abril-bridge-illuminated.jpg",
      "/lisbon-viewpoint-sunset.jpg",
      "/bairro-alto-street-night.jpg",
    ],
    locations: ["Lisbon", "Bairro Alto", "Baixa"],
    longDescription:
      "See Lisbon in a completely different light. As the sun sets, the city transforms into a magical landscape of illuminated monuments and lively neighborhoods. Enjoy the romantic atmosphere while learning about the city's legends and stories.",
    included: [
      "Evening pick-up",
      "Illuminated monuments tour",
      "Miradouros (viewpoints) at sunset",
      "Bairro Alto nightlife area",
      "Fado music venue recommendation",
      "Safe return to hotel",
    ],
    languages: ["English", "Portuguese", "Spanish", "Italian"],
  },
  {
    id: "obidos-nazare",
    creationDate: "2024-02-10",
    updateDate: "2024-03-10",
    title: "Óbidos & Nazaré Day Trip",
    description: "Visit the medieval town of Óbidos and the famous surfing destination of Nazaré.",
    duration: 7,
    price: 180,
    bannerImage: "/placeholder.svg",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    locations: ["Óbidos", "Nazaré"],
    longDescription:
      "Journey north from Lisbon to discover two charming Portuguese towns. Walk through the medieval walls of Óbidos, sample the famous Ginja cherry liqueur, and witness the impressive waves of Nazaré, home to some of the world's biggest surf.",
    included: [
      "Scenic drive along the coast",
      "Óbidos castle and town exploration",
      "Ginja liqueur tasting",
      "Nazaré beach and viewpoint",
      "Fresh seafood lunch spot",
      "Free time for shopping",
    ],
    languages: ["English", "Portuguese", "French"],
  },
  {
    id: "lisbon-food-tour",
    creationDate: "2024-02-15",
    updateDate: "2024-03-05",
    title: "Lisbon Food & Market Tour",
    description: "Taste your way through Lisbon with visits to traditional markets and authentic restaurants.",
    duration: 4,
    price: 110,
    bannerImage: "/placeholder.svg",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    locations: ["Lisbon", "Baixa"],
    longDescription:
      "Discover Lisbon's culinary scene like a local. Visit bustling markets, taste traditional delicacies, and learn about Portuguese food culture. This tour is perfect for food lovers who want to experience authentic flavors.",
    included: [
      "Mercado da Ribeira visit",
      "Traditional pastéis de nata tasting",
      "Portuguese wine sampling",
      "Bacalhau (codfish) dishes",
      "Local cheese and charcuterie",
      "Secret food spots",
    ],
    languages: ["English", "Portuguese", "Spanish"],
  },
  {
    id: "arrabida-setubal",
    creationDate: "2024-02-20",
    updateDate: "2024-03-01",
    title: "Arrábida & Setúbal Wine Tour",
    description: "Discover stunning beaches, mountain landscapes, and award-winning wines south of Lisbon.",
    duration: 6,
    price: 160,
    bannerImage: "/placeholder.svg",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    locations: ["Arrábida", "Setúbal"],
    longDescription:
      "Venture south to the Setúbal Peninsula and experience the natural beauty of Arrábida Natural Park. Enjoy pristine beaches, taste exceptional wines, and savor fresh seafood in this lesser-known gem near Lisbon.",
    included: [
      "Arrábida Natural Park scenic route",
      "Beach time at Portinho da Arrábida",
      "Wine tasting at local winery",
      "Setúbal city tour",
      "Fresh seafood lunch recommendation",
      "Christ the King monument visit",
    ],
    languages: ["English", "Portuguese", "Spanish"],
  },
  {
    id: "fatima-tour",
    creationDate: "2024-02-25",
    updateDate: "2024-03-12",
    title: "Fátima Pilgrimage Tour",
    description: "Visit the sacred sanctuary of Fátima, one of the most important Catholic pilgrimage sites.",
    duration: 5,
    price: 140,
    bannerImage: "/placeholder.svg",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    locations: ["Óbidos"],
    longDescription:
      "Experience a spiritual journey to Fátima, where millions of pilgrims visit annually. Learn about the apparitions of Our Lady, visit the basilicas, and explore the peaceful sanctuary grounds.",
    included: [
      "Transportation to Fátima",
      "Guided tour of the Sanctuary",
      "Basilica visits",
      "Chapel of Apparitions",
      "Free time for prayer and reflection",
      "Optional stop in Óbidos",
    ],
    languages: ["English", "Portuguese", "Spanish", "Italian"],
  },
  {
    id: "evora-alentejo",
    creationDate: "2024-03-01",
    updateDate: "2024-03-22",
    title: "Évora & Alentejo Wine Region",
    description: "Explore the UNESCO World Heritage city of Évora and taste exceptional Alentejo wines.",
    duration: 9,
    price: 220,
    bannerImage: "/placeholder.svg",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    locations: ["Lisbon"],
    longDescription:
      "Journey to the heart of Portugal's Alentejo region. Discover ancient Roman temples, medieval architecture, and world-class wines. This full-day tour combines history, culture, and gastronomy.",
    included: [
      "Full-day private tour",
      "Évora historic center tour",
      "Roman Temple of Diana",
      "Chapel of Bones visit",
      "Wine tasting at Alentejo winery",
      "Traditional Alentejo lunch",
    ],
    languages: ["English", "Portuguese", "French"],
  },
]

export const getTourById = (id: string): Tour | undefined => {
  return tours.find((tour) => tour.id === id)
}
