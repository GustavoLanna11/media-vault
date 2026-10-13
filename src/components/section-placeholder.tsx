import { Plus } from "lucide-react";

interface SectionPlaceholderProps {
  entityLabel: string;
}

export function SectionPlaceholder({ entityLabel }: SectionPlaceholderProps) {
  return (
    <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-700/80 bg-[var(--color-card)]/50 px-6 py-16 text-center">
      <p className="text-zinc-400">
        Em breve: listagem e formulário para{" "}
        <span className="text-zinc-200">{entityLabel}</span>.
      </p>
      <button
        type="button"
        disabled
        className="mt-6 inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-500"
      >
        <Plus className="size-4" />
        Adicionar (próximo passo)
      </button>
    </div>
  );
}
