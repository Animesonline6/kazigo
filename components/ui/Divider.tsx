import { cn } from "@/lib/utils";

export function Divider({ className, label }: { className?: string; label?: string }) {
  if (label) {
    return (
      <div className={cn("flex items-center gap-3", className)} role="separator">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium text-ink-faint">{label}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
    );
  }
  return <hr className={cn("border-border", className)} />;
}
