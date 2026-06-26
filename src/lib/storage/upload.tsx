"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
  });

  if (error) return { url: null, error: error.message };

  if (bucket === "avatars") {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return { url: data.publicUrl, error: null };
  }

  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24 * 7);
  return { url: data?.signedUrl ?? null, error: null };
}

interface FileUploadFieldProps {
  bucket: string;
  pathPrefix: string;
  name: string;
  label: string;
  accept?: string;
  onUploaded?: (url: string) => void;
}

export function FileUploadField({
  bucket,
  pathPrefix,
  name,
  label,
  accept,
  onUploaded,
}: FileUploadFieldProps) {
  const [pending, setPending] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPending(true);
    setError(null);
    const path = `${pathPrefix}/${Date.now()}-${file.name}`;
    const result = await uploadFile(bucket, path, file);
    if (result.url) {
      setUrl(result.url);
      onUploaded?.(result.url);
    } else {
      setError(result.error);
    }
    setPending(false);
  }

  return (
    <label className="block space-y-1 text-sm">
      <span className="font-medium text-text">{label}</span>
      <input type="file" accept={accept} onChange={handleChange} disabled={pending} className="field-input" />
      <input type="hidden" name={name} value={url ?? ""} />
      {url && <p className="text-xs text-brand">Uploaded</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </label>
  );
}
