import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { ToastProvider } from "@/components/ui/Toast";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "KaziGo — Encontra. Trabalha. Ganha.",
    template: "%s · KaziGo",
  },
  description:
    "Encontra oportunidades de trabalho e profissionais em Moçambique com a KaziGo, o marketplace que liga clientes, freelancers e empresas.",
  openGraph: {
    title: "KaziGo — Encontra. Trabalha. Ganha.",
    description:
      "O marketplace que conecta profissionais, trabalhadores, freelancers, empresas e clientes em Moçambique.",
    locale: "pt_MZ",
    type: "website",
    siteName: "KaziGo",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-MZ" className={`${manrope.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col">
        <ToastProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <ConditionalFooter />
        </ToastProvider>
      </body>
    </html>
  );
}
