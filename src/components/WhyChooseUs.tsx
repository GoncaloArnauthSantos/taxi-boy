import { Globe, Clock, Star, MessageCircle } from "lucide-react";

const WhyChooseUs = () => {
  return (
    <div className="container mx-auto px-4 lg:px-8">
      <div className="text-center mb-12 lg:mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
          Why Choose Our Tours
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Professional service, local expertise, and personalized experiences
          that make your visit truly special
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-accent-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-foreground">
            Multilingual Guide
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Tours available in English, Portuguese, Spanish, French, German, and
            Italian
          </p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-accent-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-foreground">
            Flexible Schedule
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Customize your itinerary and timing to match your preferences
          </p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-accent-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-foreground">
            Local Expertise
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Discover hidden gems and authentic experiences known only to locals
          </p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-accent-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-foreground">
            Personal Service
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Small groups and private tours for an intimate, personalized
            experience
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
