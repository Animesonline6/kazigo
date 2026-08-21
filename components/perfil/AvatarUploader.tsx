"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Trash2, Loader2 } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { createClient } from "@/lib/supabase/client";
import { initials } from "@/lib/utils";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 3 * 1024 * 1024; // 3MB

export function AvatarUploader({
  userId,
  fullName,
  avatarUrl,
}: {
  userId: string;
  fullName: string;
  avatarUrl: string | null;
}) {
  const supabase = createClient();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(avatarUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validateFile(file: File): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Formato não suportado. Usa JPG, PNG ou WebP.";
    }
    if (file.size > MAX_SIZE_BYTES) {
      return "A imagem é demasiado grande. Tamanho máximo: 3MB.";
    }
    return null;
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      e.target.value = "";
      return;
    }

    setError(null);

    // Preview local imediato, antes do upload terminar
    const localPreviewUrl = URL.createObjectURL(file);
    setPreview(localPreviewUrl);
    setUploading(true);

    try {
      const extension = file.name.split(".").pop() || "jpg";
      const filePath = `${userId}/avatar.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true, cacheControl: "3600" });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Cache-busting para a imagem atualizar de imediato em todo o site
      const publicUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", userId);

      if (updateError) throw updateError;

      setPreview(publicUrl);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Não foi possível carregar a foto. Tenta novamente.");
      setPreview(avatarUrl);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove() {
    if (!avatarUrl && !preview) return;
    setError(null);
    setUploading(true);

    try {
      // Remove qualquer extensão possível guardada anteriormente
      const removals = ["jpg", "jpeg", "png", "webp"].map(
        (ext) => `${userId}/avatar.${ext}`
      );
      await supabase.storage.from("avatars").remove(removals);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: null })
        .eq("id", userId);

      if (updateError) throw updateError;

      setPreview(null);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Não foi possível remover a foto. Tenta novamente.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <span className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy-100 text-xl font-semibold text-navy-700">
          {preview ? (
            // Usa <img> nativo (não next/image) para suportar pré-visualização
            // local (blob:) antes do upload terminar.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt={fullName} className="h-full w-full object-cover" />
          ) : (
            <span aria-hidden="true">{initials(fullName)}</span>
          )}
        </span>
        {uploading && (
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-navy-900/40">
            <Loader2 className="h-6 w-6 animate-spin text-white" aria-hidden="true" />
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:text-teal-600 disabled:opacity-50"
        >
          <Camera className="h-4 w-4" aria-hidden="true" />
          Alterar foto
        </button>

        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-danger hover:opacity-80 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Remover
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="sr-only"
        onChange={handleFileChange}
      />

      {error && (
        <div className="w-full max-w-xs">
          <Alert tone="danger" title="Erro ao atualizar a foto">
            {error}
          </Alert>
        </div>
      )}
    </div>
  );
}
