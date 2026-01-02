import Link from "next/link";
import { Button } from "./ui/Button";
import type { PageSection } from "@/cms/types";

type Props = {
  content: PageSection | null;
};

const ReadyToExplore = ({ content }: Props) => {
  if (!content) { 
    return null;
  }

  const { title, label, buttonText } = content;
  return (
    <>
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-balance">
          {title}
        </h2>
        <p className="text-base md:text-lg text-primary-foreground/90 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
          {label}
        </p>
        <Button
          asChild
          size="lg"
          className="bg-accent hover:bg-accent/90 active:bg-accent/80 text-accent-foreground"
        >
          <Link href="/booking">{buttonText}</Link>
        </Button>
      </div>
    </>
  );
};

export default ReadyToExplore;
