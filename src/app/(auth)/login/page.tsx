import { LoginForm } from "@/features/auth/components/login-form";

export const metadata = {
  title: "Officer Authentication | JANPRAMAAN",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-ambient-mesh relative overflow-hidden">
      {/* Ambient Lighting Orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      <LoginForm />
    </div>
  );
}
