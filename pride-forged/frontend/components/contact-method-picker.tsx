"use client";

import { cn } from "@/lib/utils";

export type PreferredContactMethod = "call" | "telegram" | "whatsapp" | "max";

const contactMethods: Array<{ value: PreferredContactMethod; label: string }> = [
  { value: "call", label: "Звонок" },
  { value: "telegram", label: "Telegram" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "max", label: "MAX" }
];

type ContactMethodPickerProps = {
  value: PreferredContactMethod;
  onChange: (value: PreferredContactMethod) => void;
  className?: string;
};

export function ContactMethodPicker({ value, onChange, className }: ContactMethodPickerProps) {
  return (
    <fieldset className={cn("min-w-0", className)}>
      <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
        Предпочитаемый способ связи
      </legend>
      <div className="grid grid-cols-2 gap-1.5 rounded-[18px] border border-[var(--border)] bg-[var(--surface-2)] p-1.5 sm:grid-cols-4" role="group">
        {contactMethods.map((method) => (
          <button
            key={method.value}
            type="button"
            aria-pressed={value === method.value}
            onClick={() => onChange(method.value)}
            className={cn(
              "min-h-10 min-w-0 rounded-[13px] px-2 text-xs font-extrabold transition duration-200 sm:text-[0.8rem]",
              value === method.value
                ? "bg-accent text-white shadow-[0_10px_24px_rgb(var(--accent-rgb)/0.28)]"
                : "border border-transparent text-[var(--text-secondary)] hover:border-[var(--border)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
            )}
          >
            {method.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
