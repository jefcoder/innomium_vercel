import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/Button";
import { Mail } from "lucide-react";

export const metadata = { title: "Verify Email" };

export default function VerifyEmailPage() {
  return (
    <AuthCard title="Check your email">
      <Mail className="mb-4 text-brand" size={32} />
      <p className="text-sm text-text-muted">
        We sent a verification link to your email. Click the link to activate your account.
      </p>
      <Button href="/login" variant="outline" className="mt-6" showArrow={false}>
        Back to Sign In
      </Button>
      <p className="mt-4 text-center text-sm text-text-muted">
        <Link href="/apply" className="text-brand hover:underline">
          Continue to talent application
        </Link>
      </p>
    </AuthCard>
  );
}
