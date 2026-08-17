"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextInput, PasswordInput, Checkbox } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { Alert } from "@/components/ui/Alert";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "Email ou palavra-passe incorretos."
          : "Não foi possível entrar. Tenta novamente."
      );
      return;
    }

    const redirectTo = searchParams.get("redirectTo") || "/dashboard";
    router.push(redirectTo);
    router.refresh();
  }

  async function handleGoogleLogin() {
    setError(null);
    setGoogleLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError("Não foi possível entrar com Google. Tenta novamente.");
      setGoogleLoading(false);
    }
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

        {error && (
          <Alert tone="danger" title="Não foi possível entrar" className="mb-4">
            {error}
          </Alert>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <Checkbox label="Manter sessão iniciada" />
            <Link href="/recuperar-password" className="text-sm font-medium text-teal-600 hover:underline">
              Esqueceste-te?
            </Link>
          </div>
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "A entrar..." : "Entrar"}
          </Button>
        </form>

        <Divider label="ou" className="my-6" />

        <Button
          variant="outline"
          fullWidth
          onClick={handleGoogleLogin}
          disabled={googleLoading}
        >
          {googleLoading ? "A ligar ao Google..." : "Continuar com Google"}
        </Button>

        <p className="mt-6 text-center text-sm text-ink-faint">
          Ainda não tens conta?{" "}
          <Link href="/registar" className="font-semibold text-navy-700 hover:underline">
            Criar conta
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
