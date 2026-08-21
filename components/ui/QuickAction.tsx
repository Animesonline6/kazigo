import Link from "next/link";
import { LucideIcon } from "lucide-react";

export interface QuickActionProps {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function QuickAction({ href, label, icon: Icon }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-md border border-border bg-white p-4 text-center transition-colors hover:border-teal-500/60 hover:bg-teal-50/40 active:bg-teal-50"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-navy-50 text-navy-700">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="text-sm font-medium text-ink">{label}</span>
    </Link>
  );
}
