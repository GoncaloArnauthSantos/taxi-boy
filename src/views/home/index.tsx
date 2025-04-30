import Link from "next/link"

const Home = () => {
  return (
    <main>
      <h1 >Hello world! 2</h1>
      <Link href={"/tours"}> Tours page </Link>
    </main>
  )
}
  
export default Home