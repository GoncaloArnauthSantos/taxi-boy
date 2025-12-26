import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import type { Contact } from "@/cms/types";
import { buildMailtoLink, buildWhatsAppLink } from "@/lib/utils";

type Props = {
  contactInfo: Contact | null;
};

const QuickContact = ({ contactInfo }: Props) => {
  const { email, phone } = contactInfo || {};

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Quick Contact</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1 text-sm">
          <p className="font-medium text-foreground">
            Prefer to talk directly?
          </p>
          <p className="text-muted-foreground">
            You can also reach me instantly via WhatsApp or email.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-12">
          {phone && (
            <Button
              asChild
              className="w-full lg:w-1/3 bg-[#25D366] hover:bg-[#1ebe5a] text-white border-transparent"
            >
              <a
                href={buildWhatsAppLink(phone)}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp Me
              </a>
            </Button>
          )}

          {email && (
            <Button asChild className="w-full lg:w-1/3">
              <a href={buildMailtoLink(email)}>Send an Email</a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickContact;
