"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClient();

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) {
        setMessage(error.message);
        return;
      }
      setMessage("Conta criada! Confira seu e-mail se a confirmação estiver ativa.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300">
            <Sparkles className="size-6" />
          </div>
          <h1 className="text-xl font-semibold">Media Vault</h1>
          <p className="text-sm text-zinc-500">Acesso ao seu arquivo pessoal</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block space-y-1.5 text-sm">
            <span className="text-zinc-400">E-mail</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 outline-none focus:border-violet-500"
            />
          </label>
          <label className="block space-y-1.5 text-sm">
            <span className="text-zinc-400">Senha</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 outline-none focus:border-violet-500"
            />
          </label>
          {message ? (
            <p className="text-sm text-amber-300/90">{message}</p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-violet-600 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-60"
          >
            {loading
              ? "Aguarde…"
              : mode === "login"
                ? "Entrar"
                : "Criar conta"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500">
          {mode === "login" ? "Primeira vez?" : "Já tem conta?"}{" "}
          <button
            type="button"
            className="text-violet-400 hover:underline"
            onClick={() =>
              setMode((m) => (m === "login" ? "signup" : "login"))
            }
          >
            {mode === "login" ? "Criar conta" : "Entrar"}
          </button>
        </p>

        <Link
          href="/"
          className="block text-center text-sm text-zinc-500 hover:text-zinc-300"
        >
          Voltar ao painel
        </Link>
      </div>
    </div>
  );
}
