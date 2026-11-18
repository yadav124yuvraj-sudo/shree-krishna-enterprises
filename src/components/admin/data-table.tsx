import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/states/empty-state";

export function AdminListHeader({
  title,
  newHref,
  newLabel = "Add new",
}: {
  title: string;
  newHref: string;
  newLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-3xl text-charcoal">{title}</h1>
      <Button asChild>
        <Link href={newHref}>
          <Plus aria-hidden="true" />
          {newLabel}
        </Link>
      </Button>
    </div>
  );
}

export function Badge({ tone, children }: { tone: "good" | "neutral" | "warn"; children: React.ReactNode }) {
  const toneClass =
    tone === "good"
      ? "bg-green-100 text-green-900"
      : tone === "warn"
        ? "bg-amber-100 text-amber-900"
        : "bg-beige text-stone";
  return <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium ${toneClass}`}>{children}</span>;
}

export function EmptyRow({ title, newHref, newLabel }: { title: string; newHref: string; newLabel: string }) {
  return (
    <EmptyState
      title={title}
      action={
        <Button asChild>
          <Link href={newHref}>{newLabel}</Link>
        </Button>
      }
    />
  );
}
