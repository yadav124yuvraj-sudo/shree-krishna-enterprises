export type Photo = { id: string; url: string };

/** Customer photos. URLs are temporary signed links from the private bucket. */
export function PhotoGrid({ photos }: { photos: Photo[] }) {
  if (photos.length === 0) return null;
  return (
    <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {photos.map((p) => (
        <li key={p.id}>
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden rounded-sm border border-line"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.url} alt="Photo sent by the customer" loading="lazy" className="aspect-[4/3] w-full object-cover" />
          </a>
        </li>
      ))}
    </ul>
  );
}
