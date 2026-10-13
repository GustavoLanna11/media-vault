import Link from "next/link";
import { AlertCircle } from "lucide-react";

interface SetupBannerProps {
  variant: "env" | "auth";
}

export function SetupBanner({ variant }: SetupBannerProps) {
  if (variant === "env") {
    return (
      <div className="flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
        <AlertCircle className="size-5 shrink-0 text-amber-400" />
        <div>
          <p className="font-medium">Supabase ainda não configurado</p>
          <p className="mt-1 text-amber-100/70">
            Copie <code className="rounded bg-black/30 px-1">.env.example</code>{" "}
            para <code className="rounded bg-black/30 px-1">.env.local</code>,
            preencha URL e anon key, e rode o SQL em{" "}
            <code className="rounded bg-black/30 px-1">supabase/schema.sql</code>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        <AlertCircle className="size-5 shrink-0 text-violet-300" />
        <div>
          <p className="font-medium text-violet-100">Entre para ver seus dados</p>
          <p className="mt-1 text-violet-100/70">
            Seu vault é privado — faça login para cadastrar e listar registros.
          </p>
        </div>
      </div>
      <Link
        href="/login"
        className="inline-flex justify-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500"
      >
        Ir para login
      </Link>
    </div>
  );
}
