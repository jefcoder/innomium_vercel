import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { footerNav, site } from "@/lib/content/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="section-container py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-muted">
              {site.description}
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-text">Platform</h3>
            <ul className="space-y-2">
              {footerNav.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted transition-colors hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-text">Trust</h3>
            <ul className="space-y-2">
              {footerNav.trust.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted transition-colors hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-text">Account</h3>
            <ul className="space-y-2">
              {footerNav.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted transition-colors hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-8 text-sm text-text-soft sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Innomium. All rights reserved.</p>
          <a href={`mailto:${site.contactEmail}`} className="hover:text-brand">
            {site.contactEmail}
          </a>
        </div>
      </div>
    </footer>
  );
}
