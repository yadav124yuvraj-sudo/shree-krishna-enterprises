import type { FormState } from "@/lib/form-state";

export function FormMessage({ state }: { state: FormState }) {
  if (!state?.message) return null;
  return (
    <p
      role={state.ok ? "status" : "alert"}
      className={
        state.ok
          ? "rounded-sm border border-green-200 bg-green-50 px-3 py-2 text-green-900"
          : "rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-red-800"
      }
    >
      {state.message}
    </p>
  );
}
