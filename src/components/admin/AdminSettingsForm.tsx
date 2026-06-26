"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

const DEFAULT_SETTINGS = {
  platformFeePercent: "10",
  supportEmail: "support@innomium.com",
};

export function AdminSettingsForm() {
  const router = useRouter();
  const [fee, setFee] = useState(DEFAULT_SETTINGS.platformFeePercent);
  const [email, setEmail] = useState(DEFAULT_SETTINGS.supportEmail);
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "innomium_platform_settings",
        JSON.stringify({ platformFeePercent: fee, supportEmail: email })
      );
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSave} className="card-surface max-w-2xl space-y-4 p-6">
      <label className="block space-y-1 text-sm">
        <span className="font-medium text-text">Platform fee (%)</span>
        <input
          type="number"
          min={0}
          max={100}
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          className="field-input"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="font-medium text-text">Support email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field-input"
        />
      </label>
      {saved && <p className="text-sm text-brand">Settings saved locally.</p>}
      <Button type="submit" showArrow={false}>
        Save settings
      </Button>
    </form>
  );
}
