import { SignupForm } from "@/features/auth/components/signup-form";

export const metadata = {
  title: "Officer Enlistment | JANPRAMAAN",
};

export default function SignupPage() {
  return (
    <div className="jp-auth-page">
      <SignupForm />
    </div>
  );
}
