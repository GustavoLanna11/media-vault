# Media Vault — Central de Entretenimento 🎬🎮📺

Central pessoal para registrar **filmes**, **séries** e **jogos** (além de livros) — com notas, capas, horas jogadas, temporadas assistidas, sinopses e notas pessoais.

Construído exatamente sob a **mesma arquitetura do Porquinho**:
- **Vite + React SPA**: Interface puramente client-side, inicialização instantânea (0ms), responsiva (desktop com sidebar, mobile com navegação inferior).
- **Criptografia Zero-Knowledge**: PBKDF2 (100.000 iterações) + AES-256-GCM no navegador via Web Crypto API. O servidor/nuvem nunca vê o PIN nem os dados decodificados.
- **Sincronização Não-Bloqueante na Nuvem**: Sincroniza em segundo plano com o Supabase (`media_vaults`). Se a rede ou banco cair, a aplicação continua funcionando perfeitamente em modo local/offline.

---

## 🔐 Como Funciona o Login & Acesso

1. **Primeiro Acesso (Novo Cofre)**:
   - Você cadastra um **PIN numérico** (mínimo de 4 dígitos).
   - O sistema gera automaticamente uma **Sequência Numérica Única de 8 dígitos** (ex: `84920153`).
   - Todos os registros ficam vinculados a esse cofre criptografado.
2. **Acesso em Outro Dispositivo (Celular, Tablet, outro PC)**:
   - **Opção 1 (Link Direto)**: Abra a sua URL única: `https://seu-dominio/?vault=84920153` e digite seu PIN.
   - **Opção 2 (Código Numérico)**: Na tela de restauração, digite o código de 8 dígitos + seu PIN para desbloquear os dados instantaneamente.

---

## 🚀 Como Rodar Localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173).

---

## 🗄️ Configuração do Supabase (Opcional para sincronização em nuvem)

1. Crie um projeto no [supabase.com](https://supabase.com).
2. Em **Settings → API**, copie a URL e a Anon Key para o `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
   ```
3. No **SQL Editor** do Supabase, execute o script em:
   ```
   supabase/schema.sql
   ```
   Ele cria a tabela `media_vaults` com colunas `sync_id`, `payload`, `salt`, `updated_at` e as políticas de Row Level Security (RLS).

---

## 🛡️ Segurança Implementada

- **Chaves Criptográficas Locais**: As chaves AES-256 são derivadas sob demanda no navegador usando PBKDF2 com salt aleatório e 100k rounds de SHA-256.
- **Payload Cifrado**: O payload salvo no `localStorage` e enviado para o Supabase é uma string cifrada com vetor de inicialização (IV) aleatório de 12 bytes por gravação.
- **Sessão em Memória**: Ao fechar a aba ou clicar em "Bloquear Cofre", a chave da sessão é descartada da memória, exigindo o PIN para desbloqueio.
