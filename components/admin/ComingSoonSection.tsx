import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function ComingSoonSection({
  icon: Icon,
  title,
  description,
  requiredTable,
  requiredFields,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  requiredTable: string;
  requiredFields: string[];
}) {
  return (
    <Card className="flex flex-col items-center gap-4 p-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-50 text-navy-700">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <div>
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        <p className="mx-auto mt-1 max-w-md text-sm text-ink-faint">{description}</p>
      </div>

      <div className="w-full max-w-md rounded-md border border-dashed border-border bg-surface-subtle p-4 text-left">
        <p className="text-xs font-semibold text-ink-soft">Ainda não disponível — falta no Supabase:</p>
        <p className="mt-1 text-xs text-ink-faint">
          Tabela <code className="rounded bg-white px-1 py-0.5">{requiredTable}</code> com:
        </p>
        <ul className="mt-1.5 list-inside list-disc text-xs text-ink-faint">
          {requiredFields.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
