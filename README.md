# Media Vault

Central pessoal para registrar filmes, séries, livros, jogos, álbuns e músicas — com notas, textos e capas. Stack pensada para **Next.js (Vercel)** + **Supabase**.

## Começar localmente

```bash
npm install
cp .env.example .env.local   # no Windows: copy .env.example .env.local
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **Project Settings → API**, copie a URL e a `anon` key para `.env.local`.
3. No **SQL Editor**, execute o arquivo `supabase/schema.sql`.
4. Em **Authentication**, habilite e-mail/senha (ou o provedor que preferir).
5. (Opcional) Crie o bucket **covers** em Storage para imagens de capa.

## Deploy na Vercel

1. Envie este repositório para o GitHub.
2. Importe o repo na [Vercel](https://vercel.com).
3. Adicione as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy — cada push na branch principal pode gerar preview/production.

## O que já existe

- Painel com menu lateral e **home** com blocos “últimos registros”.
- Páginas por categoria (CRUD completo é o próximo passo de vibecode).
- Login/cadastro via Supabase Auth em `/login`.
- RLS no Postgres: cada usuário só vê os próprios dados.

## Próximos passos sugeridos

- Formulários de criar/editar + upload de capa no Storage.
- Filtros (jogos zerados vs platina, livros lidos, etc.).
- Busca global no vault.
