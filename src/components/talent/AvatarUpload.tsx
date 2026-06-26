"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateAvatarUrl } from "@/lib/profiles/actions";
import { uploadFile } from "@/lib/storage/upload";

interface AvatarUploadProps {
  userId: string;
  currentUrl?: string | null;
}

export function AvatarUpload({ userId, currentUrl }: AvatarUploadProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleUpload(file: File) {
    setPending(true);
    const path = `${userId}/avatar-${Date.now()}`;
    const result = await uploadFile("avatars", path, file);
    if (result.url) {
      await updateAvatarUrl(result.url);
      router.refresh();
    }
    setPending(false);
  }

  return (
    <div className="space-y-2">
      {currentUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={currentUrl} alt="Avatar" className="h-16 w-16 rounded-full object-cover" />
      )}
      <input
        type="file"
        accept="image/*"
        disabled={pending}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleUpload(file);
        }}
        className="field-input"
      />
    </div>
  );
}
