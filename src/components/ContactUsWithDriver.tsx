/**
 * Server Component wrapper for ContactUs
 * Fetches driver data from CMS and passes it to the client component
 */

import ContactUs from "./ContactUs"
import { getFirstDriver } from "@/cms/drivers"

export default async function ContactUsWithDriver() {
  const driver = await getFirstDriver();

  return <ContactUs driver={driver} />
}

