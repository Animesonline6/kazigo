"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextInput, PasswordInput } from "@/components/ui/Input";
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
          <div className="flex items-center justify-end">
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
