import Link from "next/link";
import { UserPlus, Search, ClipboardCheck, Handshake, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Como funciona" };

const steps = [
  { icon: UserPlus, title: "Cria a tua conta", description: "Regista-te gratuitamente como trabalhador, cliente ou empresa." },
  { icon: Search, title: "Explora ou publica", description: "Procura trabalhos por categoria, ou publica um trabalho para receberes candidaturas." },
  { icon: ClipboardCheck, title: "Combina os detalhes", description: "Conversa diretamente com a outra parte e alinha prazos, orçamento e expectativas." },
  { icon: Handshake, title: "Conclui e avalia", description: "Termina o trabalho, recebe o pagamento e deixa uma avaliação." },
];

export default function ComoFuncionaPage() {
  return (
    <div className="container-kazigo py-10 sm:py-14">
      <div className="mb-10 max-w-xl">
        <h1 className="text-2xl font-bold sm:text-3xl">Como funciona a KaziGo</h1>
        <p className="mt-2 text-sm text-ink-faint">
          Um processo simples para ligar quem precisa de um trabalho feito a quem sabe fazê-lo.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <Card key={step.title} className="flex flex-col gap-3 p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-navy-50 text-navy-700">
              <step.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="text-xs font-semibold text-teal-600">Passo {index + 1}</p>
            <h2 className="text-base font-semibold">{step.title}</h2>
            <p className="text-sm text-ink-faint">{step.description}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-10 flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-teal-600" aria-hidden="true" />
          <div>
            <h2 className="text-base font-semibold">Segurança em primeiro lugar</h2>
            <p className="text-sm text-ink-faint">
              Perfis verificados, avaliações reais e um canal de denúncias para manteres-te seguro.
            </p>
          </div>
        </div>
        <Link href="/registar">
          <Button>Criar conta</Button>
        </Link>
      </Card>
    </div>
  );
}
