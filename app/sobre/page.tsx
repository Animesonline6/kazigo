import { Card } from "@/components/ui/Card";
import { Target, Users, Rocket } from "lucide-react";

export const metadata = { title: "Sobre" };

const pillars = [
  { icon: Target, title: "Missão", text: "Ligar profissionais moçambicanos a oportunidades reais, de forma simples e confiável." },
  { icon: Users, title: "Comunidade", text: "Construída com e para trabalhadores, clientes e pequenas empresas de Moçambique." },
  { icon: Rocket, title: "Visão", text: "Tornar-se a plataforma de referência para trabalho e serviços em África lusófona." },
];

export default function SobrePage() {
  return (
    <div className="container-kazigo py-10 sm:py-14">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold sm:text-3xl">Sobre a KaziGo</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-faint">
          A KaziGo nasceu para resolver um problema simples: em Moçambique, encontrar trabalho de confiança
          ou um profissional qualificado ainda depende demasiado de contactos pessoais. Criámos um espaço
          digital onde trabalhadores, freelancers, empresas e clientes se encontram com transparência.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {pillars.map((p) => (
          <Card key={p.title} className="flex flex-col gap-3 p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-teal-50 text-teal-600">
              <p.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="text-base font-semibold">{p.title}</h2>
            <p className="text-sm text-ink-faint">{p.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
