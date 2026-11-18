/** Visible reminder for text the owner must still supply. Remove by editing the content file. */
export function TodoNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-sm border border-dashed border-gold bg-beige/50 px-4 py-3 text-stone">
      {children}
    </p>
  );
}
