import { Users, Briefcase, Flag, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { jobs } from "@/data/mock";

export const metadata = { title: "Administração" };

const stats = [
  { icon: Users, label: "Utilizadores registados", value: "1 284" },
  { icon: Briefcase, label: "Trabalhos ativos", value: jobs.filter((j) => j.status === "aberto").length.toString() },
  { icon: Flag, label: "Denúncias pendentes", value: "2" },
  { icon: TrendingUp, label: "Crescimento mensal", value: "+18%" },
];

export default function AdminPage() {
  return (
    <div className="container-kazigo py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Administração</h1>
        <p className="mt-1 text-sm text-ink-faint">Visão geral da plataforma KaziGo.</p>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="flex flex-col gap-2 p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-navy-50 text-navy-700">
              <stat.icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <p className="text-xl font-bold text-ink">{stat.value}</p>
            <p className="text-xs text-ink-faint">{stat.label}</p>
          </Card>
        ))}
      </div>

      <h2 className="mb-4 text-lg font-semibold">Trabalhos recentes</h2>
      <div className="overflow-x-auto rounded-md border border-border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface-subtle text-left text-xs uppercase text-ink-faint">
            <tr>
              <th className="p-4 font-medium">Título</th>
              <th className="p-4 font-medium">Cliente</th>
              <th className="p-4 font-medium">Localização</th>
              <th className="p-4 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="p-4 font-medium text-ink">{job.title}</td>
                <td className="p-4 text-ink-faint">{job.clientName}</td>
                <td className="p-4 text-ink-faint">{job.location.city}</td>
                <td className="p-4">
                  <Badge tone={job.status === "aberto" ? "success" : "neutral"}>{job.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
