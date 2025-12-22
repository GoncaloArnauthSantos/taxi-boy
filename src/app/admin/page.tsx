import { getAllTours } from "@/cms/tours";
import AdminPageClient from "@/components/admin/AdminPageClient";

const AdminPage = async () => {
  const tours = await getAllTours();

  return <AdminPageClient tours={tours} />;
};

export default AdminPage;
