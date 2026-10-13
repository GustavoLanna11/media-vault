import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number | null | undefined;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}

export function StarRating({
  value,
  max = 5,
  size = "sm",
  className,
}: StarRatingProps) {
  const n = value ?? 0;
  const iconClass = size === "sm" ? "size-3.5" : "size-4";

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      aria-label={value != null ? `${n} de ${max} estrelas` : "Sem nota"}
    >
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={cn(
            iconClass,
            i < n
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-zinc-600",
          )}
        />
      ))}
    </div>
  );
}
