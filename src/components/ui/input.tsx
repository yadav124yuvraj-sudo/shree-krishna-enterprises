import * as React from "react";
import { cn } from "@/lib/utils";

const base =
  "w-full rounded-sm border border-line bg-white px-3 text-[0.95rem] text-charcoal placeholder:text-stone/60 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold disabled:opacity-50";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(base, "h-11", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(base, "min-h-24 py-2", className)} {...props} />;
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-charcoal">
        {label}
      </label>
      {children}
      {hint ? <p className="text-sm text-stone">{hint}</p> : null}
      {error ? (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
