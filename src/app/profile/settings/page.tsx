import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/profiles/queries";
import { settingsPathForAccountType } from "@/lib/auth/routes";

/** Legacy agency URL — forwards to role-based settings. */
export default async function ProfileSettingsRedirectPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?redirectTo=/profile/settings");
  redirect(settingsPathForAccountType(profile.account_type));
}
