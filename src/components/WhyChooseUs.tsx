import type { WhyChooseUs, ImageWithLabel } from "@/cms/types";
import { getIcon } from "@/lib/utils";

type Props = {
  content: WhyChooseUs | null;
};

const WhyChooseUs = ({ content }: Props) => {
  if (!content) {
    return null;
  }

  const { title, label, reasons } = content;

  return (
    <div className="container mx-auto px-4 lg:px-8">
      <div className="text-center mb-12 lg:mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
          {title}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {label}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {reasons.map((reason: ImageWithLabel) => {
          const IconComponent = getIcon(reason.iconName);

          return (
            <div className="text-center" key={reason.id}>
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                {IconComponent && <IconComponent className="w-8 h-8 text-accent-foreground" />}
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">
                {reason.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {reason.label}
              </p>
            </div>
          );
        })}

      </div>
    </div>
  );
};

export default WhyChooseUs;
