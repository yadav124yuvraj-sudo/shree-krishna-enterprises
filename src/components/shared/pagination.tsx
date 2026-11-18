import Link from "next/link";

export function Pagination({
  page,
  totalPages,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}) {
  if (totalPages <= 1) return null;
  const linkClass =
    "inline-flex h-11 min-w-11 items-center justify-center rounded-sm border border-line px-4 text-charcoal hover:bg-beige";
  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-3">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={linkClass} rel="prev">
          Previous
        </Link>
      ) : null}
      <span className="text-stone" aria-current="page">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className={linkClass} rel="next">
          Next
        </Link>
      ) : null}
    </nav>
  );
}
