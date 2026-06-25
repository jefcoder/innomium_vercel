import { getClientProfile } from "@/lib/profiles/helpers";
import { ClientProfileForm } from "@/components/forms/ClientProfileForm";

export default async function ClientSettingsPage() {
  const clientProfile = await getClientProfile();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Settings</h1>
      <ClientProfileForm profile={clientProfile} />
    </div>
  );
}
