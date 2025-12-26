import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"
import { getContacts } from "@/cms/contact"
import { getImageWithLabelByUID } from "@/cms/image-with-label";
import { phonePreview } from "@/lib/utils";

const Footer = async () => {
  const [contactInfo, imageWithLabel] = await Promise.all([
    getContacts(),
    getImageWithLabelByUID("footer-logo"),
  ]); 

  const { email = "", phone = "", address = "" } = contactInfo || {};
  const { title = "", label = "" } = imageWithLabel || {};

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-accent-foreground font-bold text-lg">
                LT
              </div>
              <div className="font-bold text-lg">{title}</div>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              {label}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/tours"
                className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors"
              >
                Tours
              </Link>
              <Link
                href="/booking"
                className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors"
              >
                Book Now
              </Link>
              <Link
                href="/contact"
                className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-primary-foreground/80 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/80 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{phonePreview(phone)}</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/80 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{address}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm">
            © 2025 Lisbon Tours. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;