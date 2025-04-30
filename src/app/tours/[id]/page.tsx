import { MOCK_TOURS } from "@/data/tours"

type Props = {
    id: string
}

const TourPage = async ({ params }: { params: Promise<Props>}) => {
  const { id } = await params
  const tour = MOCK_TOURS.find((tour) => tour.id === id)

  return (<>
    <h1>Tour details </h1>
    {tour && (
      <>
        <p>Title: {tour.title}</p>
        <p>description: {tour.description}</p>
      </>
    )}

  </>)
}


export async function generateStaticParams() {
  const toursIds = MOCK_TOURS.map((tour) => ({
    id: tour.id,
  }))

  return toursIds
}

export default TourPage