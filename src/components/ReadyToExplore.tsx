import Link from "next/link";
import { Button } from "./ui/Button";

const ReadyToExplore = () => {
  return (
    <>
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-balance">
          Ready to Explore Lisbon?
        </h2>
        <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          Book your personalized tour today and create unforgettable memories in
          one of Europe&apos;s most beautiful cities
        </p>
        <Button
          asChild
          size="lg"
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <Link href="/booking">Book Your Tour Now</Link>
        </Button>
      </div>
    </>
  );
};

export default ReadyToExplore;
