import Image from "next/image";
import Link from "next/link";
import { StarRating } from "@/components/star-rating";
import { cn, formatDate } from "@/lib/utils";

interface MediaCardProps {
  title: string;
  subtitle?: string | null;
  coverUrl?: string | null;
  rating?: number | null;
  dateLabel?: string;
  dateValue?: string | null;
  href?: string;
  badge?: string;
}

export function MediaCard({
  title,
  subtitle,
  coverUrl,
  rating,
  dateLabel,
  dateValue,
  href,
  badge,
}: MediaCardProps) {
  const inner = (
    <article
      className={cn(
        "group flex gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-3 transition-colors",
        href && "hover:bg-[var(--color-card-hover)]",
      )}
    >
      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt=""
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-xs text-zinc-500">
            —
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-medium text-zinc-100">{title}</h3>
          {badge ? (
            <span className="shrink-0 rounded-md bg-violet-500/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-violet-300">
              {badge}
            </span>
          ) : null}
        </div>
        {subtitle ? (
          <p className="truncate text-sm text-zinc-500">{subtitle}</p>
        ) : null}
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <StarRating value={rating} />
          {dateLabel && dateValue ? (
            <span className="text-xs text-zinc-500">
              {dateLabel}: {formatDate(dateValue)}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 rounded-xl">
        {inner}
      </Link>
    );
  }

  return inner;
}
