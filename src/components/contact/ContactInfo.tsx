import { Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import type { Contact } from "@/cms/types";
import { phonePreview } from "@/lib/utils";

type Props = {
  content: Contact | null;
};

const ContactInfo = ({ content }: Props) => {
  const {
    email = "",
     phone = "",
      address = ""
    } = content || {};

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 flex-shrink-0" />
            <span>{email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>{phonePreview(phone)}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>{address}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfo;