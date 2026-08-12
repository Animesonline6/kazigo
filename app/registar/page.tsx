"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, Wrench, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextInput, PasswordInput, Checkbox } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

const roleOptions: { value: Extract<UserRole, "worker" | "client" | "company">; label: string; icon: typeof Wrench }[] = [
  { value: "worker", label: "Sou trabalhador", icon: Wrench },
  { value: "client", label: "Sou cliente", icon: Briefcase },
  { value: "company", label: "Sou empresa", icon: Building2 },
];

export default function RegistarPage() {
  const [role, setRole] = useState<UserRole>("worker");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Registo real (Supabase Auth) será implementado numa etapa futura.
  }

  return (
    <div className="container-kazigo flex min-h-[70vh] items-center justify-center py-14">
      <Card className="w-full max-w-md p-7 sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold">Criar conta na KaziGo</h1>
          <p className="mt-1 text-sm text-ink-faint">Encontra. Trabalha. Ganha.</p>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-2">
          {roleOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRole(opt.value)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-sm border p-3 text-center transition-colors",
                role === opt.value ? "border-teal-500 bg-teal-50 text-teal-700" : "border-border text-ink-faint hover:border-border-strong"
              )}
              aria-pressed={role === opt.value}
            >
              <opt.icon className="h-[18px] w-[18px]" aria-hidden="true" />
              <span className="text-xs font-medium">{opt.label}</span>
            </button>
          ))}
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <TextInput label="Nome completo" placeholder="O teu nome" required />
          <TextInput label="Email" type="email" placeholder="tu@email.com" required />
          <PasswordInput label="Palavra-passe" placeholder="Mínimo 8 caracteres" required />
          <Checkbox label="Aceito os Termos e a Política de Privacidade" required />
          <Button type="submit" fullWidth>Criar conta</Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-faint">
          Já tens conta?{" "}
          <Link href="/login" className="font-semibold text-navy-700 hover:underline">
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  );
}
