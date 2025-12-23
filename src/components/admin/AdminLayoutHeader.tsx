"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { LogOut, Shield } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { logError, LogModule } from "@/lib/logger";
import { createSupabaseClient } from "@/supabase/client";

type Props = {
  user: User;
};

const AdminLayoutHeader = ({ user }: Props) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const supabase = createSupabaseClient();
      await supabase.auth.signOut();
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      logError("Logout error", error, undefined, LogModule.Auth);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-700/95 backdrop-blur border-b-4 border-slate-600 shadow-lg">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Admin Badge & Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-slate-600 border-2 border-slate-500">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                ADMIN PANEL
              </h1>
              <p className="text-sm text-slate-200">
                Logged in as {user.email}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white text-slate-700 hover:bg-slate-100 border-2 border-slate-500 font-semibold"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminLayoutHeader;

