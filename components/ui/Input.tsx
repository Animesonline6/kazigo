"use client";

import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef, useId, useState } from "react";
import { Search, Eye, EyeOff, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldWrapperProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  htmlFor: string;
}

function FieldWrapper({ label, error, hint, required, children, htmlFor }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-ink-faint">{hint}</p>
      ) : null}
    </div>
  );
}

const baseFieldClasses =
  "w-full rounded-sm border border-border bg-white px-3.5 h-11 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-teal-500 disabled:bg-surface-muted disabled:text-ink-faint";

// ---------- TextInput ----------

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, label, error, hint, required, id, ...props }, ref) => {
    const autoId = useId();
    const fieldId = id ?? autoId;
    return (
      <FieldWrapper label={label} error={error} hint={hint} required={required} htmlFor={fieldId}>
        <input
          ref={ref}
          id={fieldId}
          required={required}
          aria-invalid={!!error}
          className={cn(baseFieldClasses, error && "border-danger", className)}
          {...props}
        />
      </FieldWrapper>
    );
  }
);
TextInput.displayName = "TextInput";

// ---------- SearchInput ----------

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, placeholder = "Pesquisar...", ...props }, ref) => {
    return (
      <div className="relative w-full">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
        <input
          ref={ref}
          type="search"
          placeholder={placeholder}
          aria-label={placeholder}
          className={cn(baseFieldClasses, "pl-10", className)}
          {...props}
        />
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

// ---------- PasswordInput ----------

export interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, error, required, id, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const autoId = useId();
    const fieldId = id ?? autoId;
    return (
      <FieldWrapper label={label} error={error} required={required} htmlFor={fieldId}>
        <div className="relative">
          <input
            ref={ref}
            id={fieldId}
            type={visible ? "text" : "password"}
            required={required}
            aria-invalid={!!error}
            className={cn(baseFieldClasses, "pr-11", error && "border-danger", className)}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </FieldWrapper>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

// ---------- TextArea ----------

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, hint, required, id, rows = 4, ...props }, ref) => {
    const autoId = useId();
    const fieldId = id ?? autoId;
    return (
      <FieldWrapper label={label} error={error} hint={hint} required={required} htmlFor={fieldId}>
        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
          required={required}
          aria-invalid={!!error}
          className={cn(baseFieldClasses, "h-auto py-2.5 resize-y", error && "border-danger", className)}
          {...props}
        />
      </FieldWrapper>
    );
  }
);
TextArea.displayName = "TextArea";

// ---------- Select ----------

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, required, id, ...props }, ref) => {
    const autoId = useId();
    const fieldId = id ?? autoId;
    return (
      <FieldWrapper label={label} error={error} required={required} htmlFor={fieldId}>
        <div className="relative">
          <select
            ref={ref}
            id={fieldId}
            required={required}
            aria-invalid={!!error}
            className={cn(baseFieldClasses, "appearance-none pr-10", error && "border-danger", className)}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
        </div>
      </FieldWrapper>
    );
  }
);
Select.displayName = "Select";

// ---------- Checkbox ----------

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const autoId = useId();
    const fieldId = id ?? autoId;
    return (
      <label htmlFor={fieldId} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink">
        <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
          <input
            ref={ref}
            id={fieldId}
            type="checkbox"
            className={cn(
              "peer h-5 w-5 shrink-0 appearance-none rounded-xs border border-border-strong bg-white transition-colors checked:border-teal-500 checked:bg-teal-500",
              className
            )}
            {...props}
          />
          <Check className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100" aria-hidden="true" />
        </span>
        {label}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

// ---------- Radio ----------

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ...props }, ref) => {
    const autoId = useId();
    const fieldId = id ?? autoId;
    return (
      <label htmlFor={fieldId} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink">
        <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
          <input
            ref={ref}
            id={fieldId}
            type="radio"
            className={cn(
              "peer h-5 w-5 shrink-0 appearance-none rounded-full border border-border-strong bg-white transition-colors checked:border-[6px] checked:border-teal-500",
              className
            )}
            {...props}
          />
        </span>
        {label}
      </label>
    );
  }
);
Radio.displayName = "Radio";

// ---------- FileInput (visual only) ----------

export interface FileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, label, hint, id, ...props }, ref) => {
    const autoId = useId();
    const fieldId = id ?? autoId;
    const [fileName, setFileName] = useState<string | null>(null);
    return (
      <FieldWrapper label={label} hint={hint} htmlFor={fieldId}>
        <label
          htmlFor={fieldId}
          className="flex h-28 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-sm border-2 border-dashed border-border-strong bg-surface-subtle text-center transition-colors hover:border-teal-500 hover:bg-teal-50"
        >
          <span className="text-sm font-medium text-ink">
            {fileName ?? "Clique para carregar um ficheiro"}
          </span>
          <span className="text-xs text-ink-faint">PNG, JPG ou PDF até 5MB</span>
          <input
            ref={ref}
            id={fieldId}
            type="file"
            className={cn("sr-only", className)}
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            {...props}
          />
        </label>
      </FieldWrapper>
    );
  }
);
FileInput.displayName = "FileInput";
