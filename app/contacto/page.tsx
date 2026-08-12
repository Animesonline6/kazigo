"use client";

import { Mail, MessageCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextInput, TextArea } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";

export default function ContactoPage() {
  const { showToast } = useToast();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    showToast({ tone: "success", title: "Mensagem enviada", description: "Entraremos em contacto em breve." });
  }

  return (
    <div className="container-kazigo grid gap-10 py-10 sm:py-14 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Contacta-nos</h1>
        <p className="mt-2 text-sm text-ink-faint">
          Tens uma dúvida, sugestão ou queres fazer uma parceria? Escreve-nos.
        </p>

        <div className="mt-8 flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 text-teal-600" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-ink">Email</p>
              <p className="text-sm text-ink-faint">suporte@kazigo.co.mz</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MessageCircle className="mt-0.5 h-5 w-5 text-teal-600" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-ink">Ajuda</p>
              <p className="text-sm text-ink-faint">Consulta o nosso centro de ajuda para respostas rápidas.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 text-teal-600" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-ink">Onde estamos</p>
              <p className="text-sm text-ink-faint">A começar em Moçambique.</p>
            </div>
          </div>
        </div>
      </div>

      <Card className="p-6">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <TextInput label="Nome" placeholder="O teu nome" required />
          <TextInput label="Email" type="email" placeholder="tu@email.com" required />
          <TextArea label="Mensagem" placeholder="Como podemos ajudar?" required />
          <Button type="submit" fullWidth>Enviar mensagem</Button>
        </form>
      </Card>
    </div>
  );
}
