import LoginForm from "@/components/admin/LoginForm";
import PWAInstaller from "@/components/pwa/PWAInstaller";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <LoginForm />
      <PWAInstaller />
    </div>
  );
};

export default LoginPage;
