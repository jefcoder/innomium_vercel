import { AdminSettingsForm } from "@/components/admin/AdminSettingsForm";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Settings</h1>
      <p className="text-sm text-text-muted">Platform configuration and admin preferences.</p>
      <AdminSettingsForm />
    </div>
  );
}
