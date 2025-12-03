import WhyChooseUs from "@/components/WhyChooseUs"
import Banner from "@/components/Banner"
import PopularTours from "@/components/PopularTours"
import ReadyToExplore from "@/components/ReadyToExplore"
import ContactUsWithDriver from "@/components/ContactUsWithDriver"

export default function HomePage() {
  return (
    <>
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <Banner />
      </section>

      <section className="py-16 lg:py-24 bg-muted/30">
        <WhyChooseUs />
      </section>

      <section id="tours" className="py-16 lg:py-24 bg-background">
        <PopularTours />
      </section>

      <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
        <ReadyToExplore />
      </section>

      <section id="contact" className="py-16 lg:py-24 bg-muted/30">
        <ContactUsWithDriver />
      </section>
    </>
  )
}