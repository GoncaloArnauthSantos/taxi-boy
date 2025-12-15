import QuickContact from "@/components/contact/QuickContact";
import ContactInfo from "@/components/contact/ContactInfo";
import DriverInfo from "@/components/contact/DriverInfo";
import FleetInfo from "@/components/contact/FleetInfo";
import { getDriver } from "@/cms/drivers";
import { getPageSectionByUID } from "@/cms/page-sections";
import { getContacts } from "@/cms/contact";

const ContactPage = async () => {
  const [
    driver,
    contactPage,
    driverSectionContent,
    fleetSectionContent,
    contactInfo,
  ] = await Promise.all([
    getDriver(),
    getPageSectionByUID("contact-page"),
    getPageSectionByUID("contact-page-driver-section"),
    getPageSectionByUID("contact-page-fleet"),
    getContacts(),
  ]);

  const { title, label } = contactPage || {};

  return (
    <>
      {/* Hero section */}
      <section className="border-b border-border/40 bg-muted/30 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-balance text-center text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-center text-lg text-muted-foreground md:text-xl">
            {label}
          </p>
        </div>
      </section>

      {/* Contact form and quick contact section */}
      <div className="container mx-auto px-4 lg:px-8">
        <section className="border-b border-border/40 bg-muted/20 py-12 md:py-16 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
          <QuickContact contactInfo={contactInfo}/>

          <ContactInfo content={contactInfo} />
        </section>

        <DriverInfo content={driverSectionContent} driver={driver} />

        <FleetInfo
          content={fleetSectionContent}
          vehicles={driver?.vehicles || []}
        />
      </div>
    </>
  );
};

export default ContactPage;
