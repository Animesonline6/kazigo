"use client";

import { ReactNode, useId, useState } from "react";
import { cn } from "@/lib/utils";

export function Tooltip({ content, children, className }: { content: string; children: ReactNode; className?: string }) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      <span aria-describedby={visible ? id : undefined}>{children}</span>
      <span
        role="tooltip"
        id={id}
        className={cn(
          "pointer-events-none absolute bottom-full left-1/2 z-40 mb-2 -translate-x-1/2 whitespace-nowrap rounded-xs bg-navy-800 px-2.5 py-1.5 text-xs font-medium text-white transition-opacity",
          visible ? "opacity-100" : "opacity-0",
          className
        )}
      >
        {content}
      </span>
    </span>
  );
}
