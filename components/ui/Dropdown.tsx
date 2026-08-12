"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface DropdownOption {
  label: string;
  onSelect: () => void;
  icon?: ReactNode;
  danger?: boolean;
}

export function Dropdown({ trigger, options }: { trigger: ReactNode; options: DropdownOption[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open}>
        {trigger}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-2 w-52 animate-fadeIn rounded-sm border border-border bg-white p-1.5 shadow-elevated"
        >
          {options.map((opt) => (
            <button
              key={opt.label}
              role="menuitem"
              type="button"
              onClick={() => {
                opt.onSelect();
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-xs px-3 py-2 text-left text-sm hover:bg-surface-muted",
                opt.danger ? "text-danger" : "text-ink"
              )}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
