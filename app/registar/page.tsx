"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Briefcase, Wrench, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextInput, PasswordInput, Checkbox } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { Alert } from "@/components/ui/Alert";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/types";

const roleOptions: { value: Extract<UserRole, "worker" | "client" | "company">; label: string; icon: typeof Wrench }[] = [
  { value: "worker", label: "Sou trabalhador", icon: Wrench },
  { value: "client", label: "Sou cliente", icon: Briefcase },
  { value: "company", label: "Sou empresa", icon: Building2 },
];

export default function RegistarPage() {
  const router = useRouter();
  const supabase = createClient();

  const [role, setRole] = useState<UserRole>("worker");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!acceptedTerms) {
      setError("Tens de aceitar os Termos e a Política de Privacidade.");
      return;
    }
    if (password.length < 8) {
      setError("A palavra-passe deve ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    });

    setLoading(false);

    if (error) {
      setError(
        error.message.includes("already registered")
          ? "Este email já está registado. Tenta entrar."
          : "Não foi possível criar a conta. Tenta novamente."
      );
      return;
    }

    if (data.user && !data.session) {
      // Confirmação de email exigida
      setSuccess(true);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleGoogleSignup() {
    setError(null);
    setGoogleLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?role=${role}`,
      },
    });

    if (error) {
      setError("Não foi possível continuar com Google. Tenta novamente.");
      setGoogleLoading(false);
    }
  }

  if (success) {
    return (
      <div className="container-kazigo flex min-h-[70vh] items-center justify-center py-14">
        <Card className="w-full max-w-md p-7 text-center sm:p-8">
          <h1 className="text-xl font-bold">Confirma o teu email</h1>
          <p className="mt-2 text-sm text-ink-faint">
            Enviámos um link de confirmação para <span className="font-medium text-ink">{email}</span>.
            Abre o email e toca no link para ativares a tua conta.
          </p>
          <Link href="/login" className="mt-6 inline-block font-semibold text-navy-700 hover:underline">
            Voltar ao login
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-kazigo flex min-h-[70vh] items-center justify-center py-14">
      <Card className="w-full max-w-md p-7 sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold">Criar conta na KaziGo</h1>
          <p className="mt-1 text-sm text-ink-faint">Encontra. Trabalha. Ganha.</p>
        </div>

        {error && (
          <Alert tone="danger" title="Não foi possível concluir o registo" className="mb-4">
            {error}
          </Alert>
        )}

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
          <TextInput
            label="Nome completo"
            placeholder="O teu nome"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <TextInput
            label="Email"
            type="email"
            placeholder="tu@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            label="Palavra-passe"
            placeholder="Mínimo 8 caracteres"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Checkbox
            label="Aceito os Termos e a Política de Privacidade"
            required
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
          />
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "A criar conta..." : "Criar conta"}
          </Button>
        </form>

        <Divider label="ou" className="my-6" />

        <Button
          variant="outline"
          fullWidth
          onClick={handleGoogleSignup}
          disabled={googleLoading}
          className="flex items-center justify-center gap-2"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {googleLoading ? "A ligar ao Google..." : "Continuar com Google"}
        </Button>

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
