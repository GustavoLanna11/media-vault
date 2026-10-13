import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { MediaCard } from "@/components/media-card";
import type { LucideIcon } from "lucide-react";

interface RecentItem {
  id: string;
  title: string;
  subtitle?: string | null;
  coverUrl?: string | null;
  rating?: number | null;
  dateLabel?: string;
  dateValue?: string | null;
  badge?: string;
}

interface RecentSectionProps {
  title: string;
  icon: LucideIcon;
  href: string;
  items: RecentItem[];
  emptyMessage: string;
}

export function RecentSection({
  title,
  icon: Icon,
  href,
  items,
  emptyMessage,
}: RecentSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="size-5 text-violet-400" aria-hidden />
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        </div>
        <Link
          href={href}
          className="flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-violet-300"
        >
          Ver tudo
          <ChevronRight className="size-4" />
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-700/80 px-4 py-8 text-center text-sm text-zinc-500">
          {emptyMessage}
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <MediaCard key={item.id} {...item} href={href} />
          ))}
        </div>
      )}
    </section>
  );
}
