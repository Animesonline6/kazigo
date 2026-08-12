"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

export function Tabs({ items, defaultValue }: { items: TabItem[]; defaultValue?: string }) {
  const [active, setActive] = useState(defaultValue ?? items[0]?.value);

  return (
    <div>
      <div role="tablist" className="flex gap-1 border-b border-border">
        {items.map((item) => (
          <button
            key={item.value}
            role="tab"
            type="button"
            aria-selected={active === item.value}
            onClick={() => setActive(item.value)}
            className={cn(
              "relative px-4 py-2.5 text-sm font-medium transition-colors",
              active === item.value ? "text-navy-700" : "text-ink-faint hover:text-ink"
            )}
          >
            {item.label}
            {active === item.value && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-teal-500" />
            )}
          </button>
        ))}
      </div>
      <div className="pt-4" role="tabpanel">
        {items.find((item) => item.value === active)?.content}
      </div>
    </div>
  );
}
