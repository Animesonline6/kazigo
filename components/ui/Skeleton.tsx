import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-sm", className)} aria-hidden="true" />;
}

export function JobCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-border bg-white p-5">
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-3.5 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-xs" />
        <Skeleton className="h-6 w-20 rounded-xs" />
      </div>
    </div>
  );
}
