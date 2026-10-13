import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Media Vault",
  description: "Central pessoal de filmes, séries, livros, jogos e música.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
