type TourMockData = {
    id: string
    creationDate: string
    updateDate: string
    title: string
    description: string
    images: string[]
    bannerImage: string
    duration: number // number of hours
    price: number
    locations: string[]
}

export const MOCK_TOURS: TourMockData[] = [
  {
    id: "1",
    creationDate: "2022-01-01",
    updateDate: "2022-01-01",
    title: "Parisian Delight",
    description: "Experience the romance of Paris",
    images: ["image1.jpg", "image2.jpg"],
    bannerImage: "banner1.jpg",
    duration: 8,
    price: 2000,
    locations: ["Paris"],
  },
  {
    id: "2",
    creationDate: "2022-02-01",
    updateDate: "2022-02-01",
    title: "Rome Adventure",
    description: "Discover the ancient history of Rome",
    images: ["image3.jpg", "image4.jpg"],
    bannerImage: "banner2.jpg",
    duration: 4,
    price: 1800,
    locations: ["Rome"],
  },
  {
    id: "3",
    creationDate: "2022-03-01",
    updateDate: "2022-03-01",
    title: "Barcelona Getaway",
    description: "Soak up the vibrant culture of Barcelona",
    images: ["image5.jpg", "image6.jpg"],
    bannerImage: "banner3.jpg",
    duration: 3,
    price: 1500,
    locations: ["Barcelona"],
  },
  {
    id: "4",
    creationDate: "2022-04-01",
    updateDate: "2022-04-01",
    title: "Amsterdam Canal Cruise",
    description: "Explore the charming canals of Amsterdam",
    images: ["image7.jpg", "image8.jpg"],
    bannerImage: "banner4.jpg",
    duration: 2,
    price: 2000,
    locations: ["Amsterdam"],
  },
  {
    id: "5",
    creationDate: "2022-04-01",
    updateDate: "2022-04-01",
    title: "Porto Wine Tasting Tour",
    description: "Explore Porto's famous wine cellars and taste premium Port wines",
    duration: 4,
    price: 75,
    images: ["image9.jpg", "image10.jpg"],
    locations: ["Vila Nova de Gaia", "Porto"],
    bannerImage: "banner5.jpg",
  },
  {
    id: "6",
    creationDate: "2022-04-01",
    updateDate: "2022-04-01",
    title: "Douro Valley Day Trip",
    description: "Experience the stunning Douro Valley with wine tasting and river cruise",
    duration: 8,
    price: 120,
    images: ["image11.jpg", "image12.jpg"],
    locations: ["Douro Valley", "Pinhão", "Porto"],
    bannerImage: "banner6.jpg",
  },
]

export const FulL_DAY_ID_FILTER = "full-day"
export const HALF_DAY_ID_FILTER = "half-day"

export const TOUR_FILTER_TIME_OPTIONS = [{id: FulL_DAY_ID_FILTER, value: "Full Day Tour"}, {id: HALF_DAY_ID_FILTER, value: "Half Day Tour"}]


export const TOUR_FILTER_LOCATION_OPTIONS = [
  {id: "Paris", value: "Paris"},
  {id: "Rome", value: "Rome"},
  {id: "Barcelona", value: "Barcelona"},
  {id: "Amsterdam", value: "Amsterdam"},
  {id: "Vila Nova de Gaia", value: "Vila Nova de Gaia"},
  {id: "Porto", value: "Porto"},
  {id: "Douro Valley", value: "Douro Valley"},
  {id: "Pinhão", value: "Pinhão"},
]