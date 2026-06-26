import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/profiles/queries";
import { homeForAccountType } from "@/lib/auth/routes";

/** Legacy agency URL — forwards to the role-based dashboard. */
export default async function ProfileRedirectPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?redirectTo=/profile");
  redirect(homeForAccountType(profile.account_type));
}
