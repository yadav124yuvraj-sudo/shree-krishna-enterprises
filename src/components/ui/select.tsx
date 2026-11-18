import * as React from "react";
import { cn } from "@/lib/utils";

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-sm border border-line bg-white px-3 text-[0.95rem] text-charcoal focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold",
        className,
      )}
      {...props}
    />
  );
}

export function Checkbox({ className, label, id, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-charcoal">
      <input id={id} type="checkbox" className={cn("size-5 rounded-sm border-line accent-gold", className)} {...props} />
      {label}
    </label>
  );
}
