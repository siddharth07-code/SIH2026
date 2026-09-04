import { LoginForm } from "@/features/auth/components/login-form";

export const metadata = {
  title: "Officer Authentication | JANPRAMAAN",
};

export default function LoginPage() {
  return (
    <div className="jp-auth-page">
      <LoginForm />
    </div>
  );
}
