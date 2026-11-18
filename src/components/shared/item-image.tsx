import Image from "next/image";
import { cn } from "@/lib/utils";
import { publicMediaUrl } from "@/lib/storage";

/**
 * A photo from the public bucket, or a calm placeholder block when there is no photo yet.
 * Give it an aspect ratio through className, for example "aspect-[4/3]".
 */
export function ItemImage({
  path,
  alt,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  className,
  priority = false,
}: {
  path: string | null | undefined;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  const src = publicMediaUrl(path);
  return (
    <div className={cn("relative overflow-hidden bg-beige", className)}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm text-stone">Photo coming soon</span>
        </div>
      )}
    </div>
  );
}
