"use client";

import Link from "next/link";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextInput, PasswordInput, Checkbox } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";

export default function LoginPage() {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Autenticação real será implementada numa etapa futura (backend).
  }

  return (
    <div className="container-kazigo flex min-h-[70vh] items-center justify-center py-14">
      <Card className="w-full max-w-md p-7 sm:p-8">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-navy-700 text-white">
            <Briefcase className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className="text-xl font-bold">Entrar na KaziGo</h1>
          <p className="text-sm text-ink-faint">Acede à tua conta para continuar.</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <TextInput label="Email" type="email" placeholder="tu@email.com" required />
          <PasswordInput label="Palavra-passe" placeholder="••••••••" required />
          <div className="flex items-center justify-between">
            <Checkbox label="Manter sessão iniciada" />
            <Link href="/login" className="text-sm font-medium text-teal-600 hover:underline">
              Esqueceste-te?
            </Link>
          </div>
          <Button type="submit" fullWidth>Entrar</Button>
        </form>

        <Divider label="ou" className="my-6" />

        <p className="text-center text-sm text-ink-faint">
          Ainda não tens conta?{" "}
          <Link href="/registar" className="font-semibold text-navy-700 hover:underline">
            Criar conta
          </Link>
        </p>
      </Card>
    </div>
  );
}
