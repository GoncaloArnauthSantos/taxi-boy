import { createSupabaseServerClient } from "@/supabase/server";
import AdminLayoutWrapper from "@/components/admin/AdminLayoutWrapper";
import PWAInstaller from "@/components/pwa/PWAInstaller";

type Props = {
  children: React.ReactNode;
};

const AdminLayout = async ({ children }: Props) => {
  const supabase = await createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <AdminLayoutWrapper user={session?.user ?? null}>
      <>
        {children}
        <PWAInstaller />
      </>
    </AdminLayoutWrapper>
  );
};

export default AdminLayout;

