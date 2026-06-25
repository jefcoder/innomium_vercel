import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { getCurrentProfile } from "@/lib/profiles/queries";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  return (
    <>
      <Navbar user={profile} />
      <main className="min-h-screen pt-[72px]">{children}</main>
      <Footer />
    </>
  );
}
