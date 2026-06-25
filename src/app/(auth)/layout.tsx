import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <div className="section-container flex min-h-screen flex-col items-center justify-center py-12">
        <Link href="/" className="mb-8">
          <Logo />
        </Link>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
