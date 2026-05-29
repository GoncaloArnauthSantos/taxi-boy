import { getAllBookings } from "@/app/api/bookings/store";
import AdminBookingsPageClient from "@/components/admin-v2/AdminBookingsPageClient";

const AdminBookingsV2Page = async () => {
  const initialBookings = await getAllBookings({ future: true });

  return <AdminBookingsPageClient initialBookings={initialBookings} />;
};

export default AdminBookingsV2Page;
