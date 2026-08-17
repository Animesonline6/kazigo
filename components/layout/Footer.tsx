import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";

const columns = [
  {
    title: "Plataforma",
    links: [
      { href: "/trabalhos", label: "Trabalhos" },
      { href: "/categorias", label: "Categorias" },
      { href: "/como-funciona", label: "Como funciona" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "/sobre", label: "Sobre" },
      { href: "/contacto", label: "Contacto" },
      { href: "/ajuda", label: "Ajuda" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/termos", label: "Termos" },
      { href: "/privacidade", label: "Privacidade" },
      { href: "/pagamentos", label: "Pagamentos" },
      { href: "/denuncias", label: "Denúncias" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-navy-800 text-white">
      <div className="container-kazigo grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center">
            <Image src="/logo-white.png" alt="KaziGo" width={145} height={40} className="h-9 w-auto" />
          </Link>
          <p className="text-sm font-medium text-navy-100">Encontra. Trabalha. Ganha.</p>
          <p className="flex items-center gap-1.5 text-sm text-navy-200">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            A começar em Moçambique
          </p>
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="mb-3 text-sm font-semibold text-navy-100">{col.title}</h3>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-navy-200 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-navy-700">
        <div className="container-kazigo flex flex-col items-center justify-between gap-2 py-5 text-xs text-navy-300 sm:flex-row">
          <p>© {new Date().getFullYear()} KaziGo. Todos os direitos reservados.</p>
          <p>Feito para ligar profissionais e oportunidades em Moçambique.</p>
        </div>
      </div>
    </footer>
  );
}
