import { ROUTE_HOME } from "@/constants/routes"
import Link from "next/link"

const NotFound = () => {
  return (
    <>
      <div>This page does not exist</div>
      <Link href={ROUTE_HOME}> Go to the home page</Link>
    </>
  )
}

export default NotFound


