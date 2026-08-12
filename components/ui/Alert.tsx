import { CheckCircle2, Info, AlertTriangle, XCircle } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AlertTone = "info" | "success" | "warning" | "danger";

const toneConfig: Record<AlertTone, { icon: typeof Info; classes: string }> = {
  info: { icon: Info, classes: "bg-navy-50 text-navy-700 border-navy-100" },
  success: { icon: CheckCircle2, classes: "bg-green-50 text-success border-green-100" },
  warning: { icon: AlertTriangle, classes: "bg-amber-50 text-warning border-amber-100" },
  danger: { icon: XCircle, classes: "bg-red-50 text-danger border-red-100" },
};

export interface AlertProps {
  tone?: AlertTone;
  title: string;
  children?: ReactNode;
  className?: string;
}

export function Alert({ tone = "info", title, children, className }: AlertProps) {
  const { icon: Icon, classes } = toneConfig[tone];
  return (
    <div role="alert" className={cn("flex gap-3 rounded-sm border p-4", classes, className)}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-semibold">{title}</p>
        {children && <p className="text-sm opacity-90">{children}</p>}
      </div>
    </div>
  );
}
