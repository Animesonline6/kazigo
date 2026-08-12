"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/trabalhos", label: "Trabalhos" },
  { href: "/categorias", label: "Categorias" },
  { href: "/como-funciona", label: "Como funciona" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
      <div className="container-kazigo flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold text-navy-700">
          <span className="flex h-8 w-8 items-center justify-center rounded-xs bg-navy-700 text-white">
            <Briefcase className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-display">
            Kazi<span className="text-teal-500">Go</span>
          </span>
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
            <Search className="h-[18px] w-[18px]" />
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="sm">Entrar</Button>
          </Link>
          <Link href="/registar">
            <Button variant="primary" size="sm">Criar conta</Button>
          </Link>
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
          <div className="mt-4 flex flex-col gap-2.5">
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              <Button variant="outline" fullWidth>Entrar</Button>
            </Link>
            <Link href="/registar" onClick={() => setMenuOpen(false)}>
              <Button variant="primary" fullWidth>Criar conta</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
