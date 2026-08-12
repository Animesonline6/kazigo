"use client";

import { Tabs } from "@/components/ui/Tabs";
import { TextInput, TextArea, Checkbox } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";

export default function ConfiguracoesPage() {
  return (
    <div className="container-kazigo py-10 sm:py-14">
      <h1 className="mb-8 text-2xl font-bold sm:text-3xl">Configurações</h1>

      <Card className="max-w-2xl p-6">
        <Tabs
          items={[
            {
              value: "perfil",
              label: "Perfil",
              content: (
                <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                  <TextInput label="Nome completo" placeholder="O teu nome" />
                  <TextInput label="Email" type="email" placeholder="tu@email.com" />
                  <TextArea label="Biografia" placeholder="Fala um pouco sobre ti..." />
                  <Button type="submit" className="w-fit">Guardar alterações</Button>
                </form>
              ),
            },
            {
              value: "notificacoes",
              label: "Notificações",
              content: (
                <div className="flex flex-col gap-4">
                  <Checkbox label="Notificar sobre novas mensagens" defaultChecked />
                  <Checkbox label="Notificar sobre candidaturas" defaultChecked />
                  <Checkbox label="Notificar sobre promoções e novidades" />
                  <Divider />
                  <Button className="w-fit">Guardar preferências</Button>
                </div>
              ),
            },
            {
              value: "seguranca",
              label: "Segurança",
              content: (
                <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                  <TextInput label="Palavra-passe atual" type="password" />
                  <TextInput label="Nova palavra-passe" type="password" />
                  <Button type="submit" className="w-fit">Atualizar palavra-passe</Button>
                </form>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
