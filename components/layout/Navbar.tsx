"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  X,
  Search,
  LayoutDashboard,
  User as UserIcon,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown } from "@/components/ui/Dropdown";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { href: "/trabalhos", label: "Trabalhos" },
  { href: "/categorias", label: "Categorias" },
  { href: "/como-funciona", label: "Como funciona" },
];

type NavProfile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
};

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState<NavProfile | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();

  useEffect(() => {
    let active = true;

    async function loadSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (active) {
          setProfile(null);
          setLoadingSession(false);
        }
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (active) {
        setProfile(data ?? { id: user.id, full_name: null, avatar_url: null });
        setLoadingSession(false);
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadSession();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await supabase.auth.signOut();
    setProfile(null);
    showToast({ tone: "success", title: "Sessão terminada com sucesso" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
      <div className="container-kazigo flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="KaziGo"
            width={145}
            height={40}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Navegação principal">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-ink-soft hover:text-navy-700">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/trabalhos"
            aria-label="Pesquisar"
            className="flex h-10 w-10 items-center justify-center rounded-sm text-ink-soft hover:bg-surface-muted"
          >
            <Search className="h-4.5 w-4.5" />
          </Link>

          {loadingSession ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-surface-muted" />
          ) : profile ? (
            <Dropdown
              trigger={<Avatar name={profile.full_name || "Utilizador"} src={profile.avatar_url ?? undefined} size="sm" />}
              options={[
                {
                  label: "Dashboard",
                  icon: <LayoutDashboard className="h-4 w-4" aria-hidden="true" />,
                  onSelect: () => router.push("/dashboard"),
                },
                {
                  label: "Perfil",
                  icon: <UserIcon className="h-4 w-4" aria-hidden="true" />,
                  onSelect: () => router.push("/perfil"),
                },
                {
                  label: "Sair",
                  icon: <LogOut className="h-4 w-4" aria-hidden="true" />,
                  onSelect: handleLogout,
                  danger: true,
                },
              ]}
            />
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Entrar</Button>
              </Link>
              <Link href="/registar">
                <Button variant="primary" size="sm">Criar conta</Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-sm text-ink md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-border bg-white px-4 pb-6 pt-2 md:hidden">
          <nav className="flex flex-col" aria-label="Navegação móvel">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-border py-3.5 text-sm font-medium text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {!loadingSession && profile && (
            <div className="flex items-center gap-3 border-b border-border py-3.5">
              <Avatar name={profile.full_name || "Utilizador"} src={profile.avatar_url ?? undefined} size="sm" />
              <span className="text-sm font-semibold text-ink">{profile.full_name || "Utilizador"}</span>
            </div>
          )}

          <div className="mt-4 flex flex-col gap-2.5">
            {loadingSession ? null : profile ? (
              <>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" fullWidth>
                    <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/perfil" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" fullWidth>
                    <UserIcon className="h-4 w-4" aria-hidden="true" />
                    Perfil
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  fullWidth
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" fullWidth>Entrar</Button>
                </Link>
                <Link href="/registar" onClick={() => setMenuOpen(false)}>
                  <Button variant="primary" fullWidth>Criar conta</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
