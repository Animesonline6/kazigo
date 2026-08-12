import { Card } from "@/components/ui/Card";
import { LifeBuoy } from "lucide-react";

export const metadata = { title: "Ajuda" };

const faqs = [
  { q: "Como crio uma conta na KaziGo?", a: "Clica em \"Criar conta\", escolhe se és trabalhador ou cliente, e preenche os teus dados." },
  { q: "Como me candidato a um trabalho?", a: "Abre a página do trabalho e clica em \"Candidatar-me\". Podes enviar uma mensagem ao cliente." },
  { q: "A KaziGo cobra alguma taxa?", a: "As condições e taxas serão apresentadas de forma clara antes de qualquer pagamento." },
  { q: "Como denuncio um problema?", a: "Usa o botão de denúncia no perfil ou trabalho em questão, ou contacta o nosso suporte." },
];

export default function AjudaPage() {
  return (
    <div className="container-kazigo py-10 sm:py-14">
      <div className="mb-10 flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-navy-50 text-navy-700">
          <LifeBuoy className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Centro de ajuda</h1>
          <p className="mt-1 text-sm text-ink-faint">Perguntas frequentes sobre a KaziGo.</p>
        </div>
      </div>

      <div className="mx-auto flex max-w-2xl flex-col gap-3">
        {faqs.map((faq) => (
          <Card key={faq.q} className="p-5">
            <h2 className="text-sm font-semibold text-ink">{faq.q}</h2>
            <p className="mt-1.5 text-sm text-ink-faint">{faq.a}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
