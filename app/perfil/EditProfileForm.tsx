"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextInput, TextArea } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { createClient } from "@/lib/supabase/client";

export function EditProfileForm({
  userId,
  profile,
  roleData,
  userRole,
}: {
  userId: string;
  profile: any;
  roleData: any;
  userRole: string;
}) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Campos comuns
  const [city, setCity] = useState(profile.city || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp || "");

  // Campos worker
  const [headline, setHeadline] = useState(roleData?.headline || "");
  const [skills, setSkills] = useState(roleData?.skills || "");
  const [hourlyRate, setHourlyRate] = useState(roleData?.hourly_rate || "");
  const [workerBio, setWorkerBio] = useState(roleData?.bio || "");

  // Campos company
  const [companyName, setCompanyName] = useState(roleData?.company_name || "");
  const [nuit, setNuit] = useState(roleData?.nuit || "");
  const [sector, setSector] = useState(roleData?.sector || "");
  const [employeesRange, setEmployeesRange] = useState(roleData?.employees_range || "");
  const [companyBio, setCompanyBio] = useState(roleData?.bio || "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return; // impede múltiplos envios
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      // Atualiza profiles (localização, bio geral, contactos)
      const profileChanged =
        city !== (profile.city || "") ||
        bio !== (profile.bio || "") ||
        phone !== (profile.phone || "") ||
        whatsapp !== (profile.whatsapp || "");

      if (profileChanged) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ city, bio, phone, whatsapp })
          .eq("id", userId);

        if (updateError) throw updateError;
      }

      // Atualiza dados específicos do rol
      if (userRole === "worker") {
        const { error: updateError } = await supabase
          .from("worker_profiles")
          .update({
            headline,
            skills,
            hourly_rate: hourlyRate ? Number(hourlyRate) : null,
            bio: workerBio,
          })
          .eq("id", userId);

        if (updateError) throw updateError;
      } else if (userRole === "company") {
        const { error: updateError } = await supabase
          .from("companies")
          .update({
            company_name: companyName,
            nuit,
            sector,
            employees_range: employeesRange,
            bio: companyBio,
          })
          .eq("id", userId);

        if (updateError) throw updateError;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Não foi possível guardar as alterações. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      {error && (
        <Alert tone="danger" title="Não foi possível guardar as alterações">
          {error}
        </Alert>
      )}

      {success && (
        <Alert tone="success" title="Alterações guardadas com sucesso">
          O teu perfil foi atualizado.
        </Alert>
      )}

      {/* Localização */}
      <Card className="p-6 sm:p-8">
        <h2 className="mb-4 text-base font-semibold">Localização</h2>
        <TextInput
          label="Cidade"
          placeholder="Ex: Maputo"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <p className="mt-2 text-xs text-ink-faint">
          Província ainda não disponível — pede ao teu programador para adicionar este campo se precisares dele.
        </p>
      </Card>

      {/* Sobre mim (comum a todos os tipos de conta) */}
      <Card className="p-6 sm:p-8">
        <h2 className="mb-4 text-base font-semibold">Sobre mim</h2>
        <TextArea
          label="Biografia"
          placeholder="Conta-nos um pouco sobre ti..."
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </Card>

      {/* Contacto */}
      <Card className="p-6 sm:p-8">
        <h2 className="mb-4 text-base font-semibold">Contacto</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Telefone"
            type="tel"
            placeholder="Ex: 84 123 4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextInput
            label="WhatsApp"
            type="tel"
            placeholder="Ex: 84 123 4567"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
        </div>
      </Card>

      {/* Worker-specific */}
      {userRole === "worker" && (
        <Card className="p-6 sm:p-8">
          <h2 className="mb-4 text-base font-semibold">Informações profissionais</h2>
          <div className="flex flex-col gap-4">
            <TextInput
              label="Título profissional"
              placeholder="Ex: Eletricista experiente"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />
            <TextInput
              label="Competências (separadas por vírgula)"
              placeholder="Ex: Eletricidade, Reparações, Instalações"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
            <TextInput
              label="Taxa horária (MTn)"
              type="number"
              min={0}
              placeholder="Ex: 2500"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
            <TextArea
              label="Sobre a tua experiência profissional"
              placeholder="Fala um pouco sobre a tua experiência e trabalhos anteriores..."
              rows={4}
              value={workerBio}
              onChange={(e) => setWorkerBio(e.target.value)}
            />
          </div>
        </Card>
      )}

      {/* Company-specific */}
      {userRole === "company" && (
        <Card className="p-6 sm:p-8">
          <h2 className="mb-4 text-base font-semibold">Informações da empresa</h2>
          <div className="flex flex-col gap-4">
            <TextInput
              label="Nome da empresa"
              placeholder="Ex: TechSolutions Moçambique"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <TextInput
              label="NUIT"
              placeholder="Número único de identificação tributária"
              value={nuit}
              onChange={(e) => setNuit(e.target.value)}
            />
            <TextInput
              label="Setor"
              placeholder="Ex: Tecnologia"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
            />
            <TextInput
              label="Número de colaboradores"
              placeholder="Ex: 1-10"
              value={employeesRange}
              onChange={(e) => setEmployeesRange(e.target.value)}
            />
            <TextArea
              label="Sobre a empresa"
              placeholder="Descreve a tua empresa e a tua experiência..."
              rows={4}
              value={companyBio}
              onChange={(e) => setCompanyBio(e.target.value)}
            />
          </div>
        </Card>
      )}

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "A guardar..." : "Guardar alterações"}
      </Button>
    </form>
  );
}
