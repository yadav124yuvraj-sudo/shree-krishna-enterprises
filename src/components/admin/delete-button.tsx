"use client";

/** Submit button for a delete form. Confirms with the browser before submitting. */
export function DeleteButton({ confirm, label = "Delete" }: { confirm: string; label?: string }) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(confirm)) e.preventDefault();
      }}
      className="inline-flex h-11 items-center justify-center rounded-sm border border-red-300 px-4 text-[0.95rem] font-medium text-red-700 hover:bg-red-50"
    >
      {label}
    </button>
  );
}
