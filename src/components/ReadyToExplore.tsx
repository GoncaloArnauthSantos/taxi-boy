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

  return (
    <>
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-balance">
          {content.title}
        </h2>
        <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          {content.label}
        </p>
        <Button
          asChild
          size="lg"
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <Link href="/booking">{content.buttonText}</Link>
        </Button>
      </div>
    </>
  );
};

export default ReadyToExplore;
