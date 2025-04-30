import { MOCK_TOURS } from "@/data/tours"
import TourGallery from "@/views/tour/TourGallery"

const ToursPage = () => {

  return (<>
    <Header />
    <TourGallery tours={MOCK_TOURS}/>
  </>)
}

const Header = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="text-center">Tours Header</div>
    </div>
  )
}

export default ToursPage

