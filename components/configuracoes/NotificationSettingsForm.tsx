"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Divider } from "@/components/ui/Divider";
import { createClient } from "@/lib/supabase/client";

export interface NotificationSettings {
  notify_candidaturas: boolean;
  notify_mensagens: boolean;
  notify_marketing: boolean;
}

export function NotificationSettingsForm({ userId, initial }: { userId: string; initial: NotificationSettings }) {
  const supabase = createClient();

  const [settings, setSettings] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    if (loading) return;
    setLoading(true);
    setSuccess(false);

    await supabase.from("user_settings").upsert(
      { user_id: userId, ...settings, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );

    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <div className="flex flex-col gap-4">
      {success && (
        <Alert tone="success" title="Preferências guardadas">
          As tuas escolhas já estão ativas.
        </Alert>
      )}

      <Checkbox
        label="Notificar sobre candidaturas (novas, aceites, recusadas)"
        checked={settings.notify_candidaturas}
        onChange={(e) => setSettings((s) => ({ ...s, notify_candidaturas: e.target.checked }))}
      />
      <Checkbox
        label="Notificar sobre novas mensagens"
        checked={settings.notify_mensagens}
        onChange={(e) => setSettings((s) => ({ ...s, notify_mensagens: e.target.checked }))}
      />
      <Checkbox
        label="Notificar sobre promoções e novidades"
        checked={settings.notify_marketing}
        onChange={(e) => setSettings((s) => ({ ...s, notify_marketing: e.target.checked }))}
      />
      <Divider />
      <Button className="w-fit" onClick={handleSave} disabled={loading}>
        {loading ? "A guardar..." : "Guardar preferências"}
      </Button>
    </div>
  );
}
