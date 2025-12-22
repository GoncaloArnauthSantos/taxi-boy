"use client";

import { usePathname } from "next/navigation";
import AdminLayoutHeader from "./AdminLayoutHeader";
import type { User } from "@supabase/supabase-js";

type Props = {
  children: React.ReactNode;
  user: User | null;
};

const AdminLayoutWrapper = ({ children, user }: Props) => {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  // Don't show admin header on login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show admin header for authenticated admin pages
  if (user) {
    return (
      <>
        <AdminLayoutHeader user={user} />
        <main className="flex-1">{children}</main>
      </>
    );
  }

  // Fallback (shouldn't happen due to middleware)
  return <>{children}</>;
};

export default AdminLayoutWrapper;

